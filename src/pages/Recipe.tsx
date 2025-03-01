
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, ChefHat, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { FEATURED_RECIPES } from '../config/data';
import type { Recipe as RecipeType } from '../types/recipe';

const Recipe = ({ recipeId, onBack }: { recipeId: string; onBack: () => void }) => {
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  useEffect(() => {
    const foundRecipe = FEATURED_RECIPES.find(r => r.id === recipeId);
    if (foundRecipe) {
      const completeRecipe: RecipeType = {
        ...foundRecipe,
        prepTime: '20 min',
        cookTime: foundRecipe.time,
        totalTime: foundRecipe.time,
        author: 'Tazart',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        },
        tags: [],
        tips: []
      };
      setRecipe(completeRecipe);
    }
  }, [recipeId]);

  if (!recipe) return null;

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-[7%]">
<div className="container mx-auto px-4 py-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux recettes</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="relative h-[70vh] overflow-hidden group">
              {recipe.gallery.map((image, index) => (
                <motion.img
                  key={index}
                  src={image}
                  alt={`${recipe.title} - Image ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700"
                  style={{
                    scale: currentImage === index ? 1 : 1.1,
                    opacity: currentImage === index ? 1 : 0,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentImage === index ? 1 : 0 }}
                  transition={{ duration: 0.7 }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {recipe.gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentImage === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{recipe.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Clock className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">Temps Total</span>
                    <span className="font-semibold">{recipe.time}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Users className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">Portions</span>
                    <span className="font-semibold">{recipe.servings} pers.</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <ChefHat className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">Difficulté</span>
                    <span className="font-semibold">{recipe.difficulty}</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gray-50">
                    <Timer className="w-6 h-6 text-[#96cc39]" />
                    <span className="text-sm text-gray-500">Préparation</span>
                    <span className="font-semibold">{recipe.prepTime || '20 min'}</span>
                  </div>
                </div>

                <div className="flex space-x-4 mb-8">
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      activeTab === 'ingredients'
                        ? 'bg-[#96cc39] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Ingrédients
                  </button>
                  <button
                    onClick={() => setActiveTab('instructions')}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                      activeTab === 'instructions'
                        ? 'bg-[#96cc39] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Instructions
                  </button>
                </div>

                {activeTab === 'ingredients' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ul className="space-y-4">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 py-2 border-b border-gray-100"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#96cc39]" />
                          <span className="text-gray-700">{ingredient}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'instructions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ol className="space-y-6">
                      {recipe.instructions.map((instruction, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex space-x-6"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#96cc39]/10 flex items-center justify-center text-[#96cc39] font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-grow pt-1">
                            <p className="text-gray-700 leading-relaxed">{instruction}</p>
                          </div>
                        </motion.li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recipe;
