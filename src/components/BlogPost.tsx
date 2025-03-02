import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Tag, Copy, Check, ThumbsUp, Share2, Bookmark, MessageCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, title }) => {
  const [copied, setCopied] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 mb-6">
      {title && (
        <div className="flex items-center justify-between bg-gray-800 rounded-t-lg px-4 py-2 border-b border-gray-700">
          <span className="text-sm text-gray-400">{title}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      )}
      <div className={`relative bg-gray-900 rounded-lg ${!title ? 'rounded-t-lg' : ''} overflow-hidden`}>
        <pre className={`line-numbers ${isExpanded ? 'max-h-none' : 'max-h-[400px]'} overflow-auto`}>
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

const ProjectPreview: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className="mt-8 rounded-xl overflow-hidden border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-white font-medium">Live Project Preview</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </a>
      </div>
      <div className="relative pb-[56.25%] h-0">
        <iframe
          src={url}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const BlogPost = () => {

  const post = {
    title: 'AI and Machine Learning: An Introduction to Minimax Algorithm',
    author: 'Iheb Chebbi',
    date: 'March 14, 2024',
    image: 'https://i.ibb.co/R09cq5b/image.png',
    readTime: '12 min read',
    tags: ['AI', 'Machine Learning', 'Minimax', 'Game Theory', 'Data Science'],
    projectUrl: 'https://tictacai.vercel.app/',
    content: `
      Artificial Intelligence and Machine Learning have revolutionized how we interact with technology. 
  In this post, we explore the Minimax Algorithm, a cornerstone in AI used in decision-making processes for games like chess and tic-tac-toe.

  The Minimax Algorithm is a recursive algorithm used for decision-making in two-player, zero-sum games, where one player's gain is another player's loss. It operates by simulating all possible moves in a game tree, evaluating each resulting state, and choosing the optimal move for the current player based on the assumption that the opponent will also play optimally.

  The algorithm works by alternating between two types of players:
  - **Maximizing player**: The player who aims to maximize their own score or utility.
  - **Minimizing player**: The opponent, who aims to minimize the maximizing player's score or utility.

  At each level of the game tree, the algorithm assigns a score to each possible game state. These scores represent the desirability of that state for the maximizing player. The algorithm starts from the leaf nodes of the game tree (the end states) and works its way back to the root node (the current state). For the maximizing player, the algorithm selects the move that leads to the highest score, while for the minimizing player, it selects the move that leads to the lowest score.

  **Alpha-Beta Pruning**: The Minimax algorithm can be optimized using Alpha-Beta pruning, which is a technique that eliminates the need to evaluate certain branches of the game tree. If a branch of the tree has already been evaluated and determined to be worse than another branch, there's no need to explore it further, which significantly reduces the number of calculations required and speeds up the decision-making process.

  The Minimax Algorithm is particularly useful in deterministic, complete-information games, where the outcome of a move is fully known to both players. In games like chess and tic-tac-toe, this approach helps computers or AI agents to make decisions that mimic human strategies, such as blocking the opponent’s moves or setting up a winning strategy.

  Let's take a look at a simple example of the Minimax Algorithm applied to a game like tic-tac-toe. The code implementation below demonstrates how the algorithm can be used to evaluate possible moves and choose the optimal one.

  We will see how the recursive nature of the Minimax Algorithm is applied to find the best move in a Tic-Tac-Toe game:

  (Code block follows below)
    `,
    content3: `Artificial Intelligence (AI) and Machine Learning (ML) are revolutionizing industries. The Minimax Algorithm, a key AI technique, excels in decision-making for competitive, two-player scenarios like chess or tic-tac-toe. By alternating between maximizing and minimizing outcomes, it simulates optimal moves for both players.

Key Features:

Alpha-Beta Pruning: Optimizes the algorithm by skipping irrelevant moves, improving efficiency.
Applications: Beyond games, Minimax is utilized in robotics, negotiation, finance, resource allocation, supply chain, and economics.
The Minimax Algorithm’s versatility makes it a powerful tool in solving complex, multi-agent challenges, balancing risks, and maximizing rewards.`,
    content2: `
    While the Minimax Algorithm is most commonly associated with board games, its applications extend far beyond gaming scenarios. Below, we explore several real-world fields where the Minimax Algorithm has been adapted and utilized:

  1. **Robotics and Path Planning**: In the field of robotics, Minimax is used for decision-making and pathfinding, particularly in dynamic environments. Robots often need to navigate through unpredictable and competitive environments filled with obstacles and other agents. The Minimax Algorithm helps in these situations by allowing robots to evaluate the consequences of their actions and anticipate the movements of other agents (e.g., other robots or humans). By simulating various possible paths and moves, the robot can select the optimal strategy that minimizes risk or error while maximizing its chances of achieving its goal. This kind of decision-making is crucial in applications like autonomous vehicles, drones, and robotic arms operating in manufacturing or surgical environments. 

  2. **Negotiation and Conflict Resolution**: Minimax is applicable in scenarios where two or more entities or agents are involved in a negotiation or conflict, each with potentially opposing interests. This can include diplomacy, business negotiations, or even legal arbitration. In these cases, the algorithm helps in simulating different negotiation strategies to understand the optimal outcomes for all involved parties. By minimizing the potential loss (or regret) while maximizing the benefit, Minimax facilitates decision-making under uncertainty, where each party’s next move is anticipated, and responses are formulated accordingly. This approach can lead to more balanced and fair agreements, as it helps identify solutions that consider the interests of all parties involved.

  3. **Financial Trading and Risk Management**: In financial markets, the Minimax Algorithm is applied in algorithmic trading to make decisions based on expected market conditions and competing agents (i.e., other traders or institutions). By simulating potential market moves and the possible outcomes of different investment strategies, the algorithm helps traders optimize their portfolios and reduce risk. The Minimax Algorithm accounts for both the maximization of return and the minimization of potential losses, making it a useful tool in risk-sensitive financial sectors such as hedge funds, insurance, and banking. Furthermore, it is instrumental in developing strategies for high-frequency trading, where decisions must be made in milliseconds based on market fluctuations and competitor behavior.

  4. **Resource Allocation and Operations Research**: Resource allocation is a critical challenge in many industries, where limited resources must be distributed optimally among competing demands. The Minimax Algorithm can be employed to model various strategies for allocating resources like time, money, or materials, minimizing inefficiencies, and ensuring optimal usage. In operations research, this application extends to problems such as the allocation of computing power in distributed systems, the scheduling of tasks in manufacturing plants, or the allocation of healthcare resources during crises. The algorithm helps simulate various distribution methods and outcomes, allowing organizations to select the strategy that minimizes waste and maximizes efficiency.

  5. **Supply Chain Management and Logistics**: The Minimax Algorithm can assist in decision-making related to logistics and supply chain management, particularly when faced with uncertainty or disruptions in supply and demand. For example, during periods of sudden demand spikes or supply chain disruptions (e.g., natural disasters or geopolitical issues), Minimax can help businesses simulate various scenarios and determine the best response to mitigate the impact of these disruptions. It can also be used to model strategies for optimizing inventory levels, transportation routes, and the selection of suppliers, with the goal of minimizing costs and delays while ensuring the smooth functioning of the supply chain.

  6. **Game Theory in Economics and Social Sciences**: Game theory, which forms the foundation of the Minimax Algorithm, has been extensively used in economics and social sciences to model competitive and cooperative behaviors between rational agents. In this context, the Minimax Algorithm can be used to simulate and optimize strategies in competitive markets, auctions, and bargaining scenarios. For instance, in auction design, Minimax principles can guide the development of auction formats that minimize the chances of exploitation while maximizing fairness and efficiency in the distribution of resources. Similarly, in political science, it can be applied to model voting systems and coalition-building strategies, ensuring that optimal strategies are chosen under adversarial conditions.

  The Minimax Algorithm, therefore, is more than just a decision-making tool for games. Its theoretical foundation in game theory makes it highly adaptable to a variety of real-world applications where decisions are made under uncertainty and involve competing interests. By simulating different outcomes and strategically choosing the best move, the Minimax Algorithm helps optimize decision-making processes in complex, multi-agent environments.

  Let's now look at a simple example of the Minimax Algorithm applied to a game like Tic-Tac-Toe. The following code implementation demonstrates how the algorithm evaluates possible moves and chooses the optimal one. We’ll see how recursion and the principle of alternating between maximizing and minimizing players are used to simulate the game tree and identify the best move.

  (Code block follows below)
    `,
    code: {
      example1: {
        title: 'Basic Minimax Algorithm Implementation',
        code: `def minimax(depth, node_index, maximizing_player, values, alpha, beta):
    if depth == 3:
        return values[node_index]
    if maximizing_player:
        best = float('-inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, False, values, alpha, beta)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:
                break
        return best
    else:
        best = float('inf')
        for i in range(2):
            val = minimax(depth + 1, node_index * 2 + i, True, values, alpha, beta)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:
                break
        return best

values = [3, 5, 6, 9, 1, 2, 0, -1]
print("The optimal value is:", minimax(0, 0, True, values, float('-inf'), float('inf')))`,
      },
      example2: {
        title: 'Minimax Algorithm for Supply Chain Management and Logistics',
        code: `def minimax(depth, node_index, maximizing_player, values, alpha, beta):
    # Base case: when depth reaches the maximum or end of the decision tree, return the value
    if depth == 3:
        return values[node_index]

    # Maximizing player's turn (e.g., supply chain manager trying to maximize profit)
    if maximizing_player:
        best = float('-inf')
        for i in range(2):  # Simulating 2 different strategies (e.g., supply options)
            val = minimax(depth + 1, node_index * 2 + i, False, values, alpha, beta)
            best = max(best, val)
            alpha = max(alpha, best)
            if beta <= alpha:  # Beta cut-off
                break
        return best
    # Minimizing player's turn (e.g., demand fluctuations or costs)
    else:
        best = float('inf')
        for i in range(2):  # Simulating 2 different demand scenarios (e.g., high vs low demand)
            val = minimax(depth + 1, node_index * 2 + i, True, values, alpha, beta)
            best = min(best, val)
            beta = min(beta, best)
            if beta <= alpha:  # Alpha cut-off
                break
        return best

# Example of simulated inventory strategies with costs and profits:
values = [3, 5, 6, 9, 1, 2, 0, -1]
print("Optimal inventory value:", minimax(0, 0, True, values, float('-inf'), float('inf')))`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                >
                  <Tag className="h-3 w-3 inline-block mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between text-gray-400 text-sm mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {post.date} · {post.readTime}
                </div>
              </div>
            </div>

            <div className="prose prose-invert">
              <p>{post.content}</p>
            </div>

            <CodeBlock
              code={post.code.example1.code}
              language="python"
              title={post.code.example1.title}
            />

<div className="prose prose-invert">
              <p>{post.content2}</p>
            </div>


            <CodeBlock
              code={post.code.example2.code}
              language="python"
              title={post.code.example2.title}
            />

            
<div className="prose prose-invert">
              <p>{post.content3}</p>
            </div>
                        <ProjectPreview url={post.projectUrl} />
          </div>
        </motion.article>
           <footer className="mt-16 border-t border-gray-800 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">About the Author</h3>
              <p className="text-gray-400">
                Iheb Chebbi is a Full Stack Developer specializing in React, Node.js, and AI integration.
                He shares his knowledge and experiences through detailed technical articles and tutorials.
              </p>
            </div>
          
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Follow Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/ihebchebbi1998tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/chebbi-iheb/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Iheb Chebbi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogPost;
