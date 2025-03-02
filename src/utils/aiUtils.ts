import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

let model: use.UniversalSentenceEncoder | null = null;

export const initializeAI = async () => {
  try {
    model = await use.load();
    console.log('AI model loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading AI model:', error);
    return false;
  }
};

export const trainClassifier = () => {
  // Train the classifier with common queries and their categories
  classifier.addDocument('what services do you offer', 'services');
  classifier.addDocument('what can you do', 'services');
  classifier.addDocument('tell me about your work', 'portfolio');
  classifier.addDocument('show me your projects', 'portfolio');
  classifier.addDocument('how can I contact', 'contact');
  classifier.addDocument('get in touch', 'contact');
  classifier.addDocument('who are you', 'about');
  classifier.addDocument('tell me about yourself', 'about');
  classifier.train();
};

export const processUserInput = async (
  input: string,
  t: (key: string) => string
): Promise<{
  response: string;
  category: string;
  confidence: number;
}> => {
  if (!model) {
    await initializeAI();
  }

  const normalizedInput = input.toLowerCase().trim();
  const tokens = tokenizer.tokenize(normalizedInput);
  
  // Get intent classification
  const classification = classifier.getClassifications(normalizedInput);
  const topCategory = classification[0];
  
  // Get sentence embeddings for semantic similarity
  const embeddings = await model!.embed([normalizedInput]);
  const confidenceScore = tf.tidy(() => {
    const similarity = embeddings.gather([0]).arraySync() as number[][];
    return Math.max(...similarity[0]);
  });

  let response = '';
  switch (topCategory.label) {
    case 'services':
      response = t('chat.responses.services');
      break;
    case 'portfolio':
      response = t('chat.responses.projects');
      break;
    case 'contact':
      response = t('chat.responses.contact');
      break;
    case 'about':
      response = t('chat.responses.about');
      break;
    default:
      response = t('chat.responses.default');
  }

  return {
    response,
    category: topCategory.label,
    confidence: confidenceScore
  };
};