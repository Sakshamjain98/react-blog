import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Markdown from 'react-markdown';
import { link } from '../components/Baselink';
import LikeButton from '../components/LikeButton';
import NoarticleImage from '../assets/noarticle.png';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [tagby, setTagby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const url = `${link}`;

  // Comprehensive Animation Variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const buttonVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: { 
        type: "spring",
        stiffness: 300,
        duration: 0.2
      }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.08)",
      transition: { duration: 0.3 }
    }
  };

  // Fetch Articles and Login Check
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${url}/api/article/getallarticle`);
        if (response.status === 200) {
          setArticles(response.data);
          setFilteredArticles(sortArticles(response.data, sortBy));
        }
      } catch (err) {
        setError('Error fetching articles');
      } finally {
        setLoading(false);
      }
    };

    const checkLogin = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();
    fetchArticles();
  }, []);
  useEffect(() => {
    setFilteredArticles(sortArticles(articles, sortBy));
  }, [articles, sortBy]);

  // Sorting and Filtering Logic (keep existing methods)
  const sortArticles = (articles, sortOrder) => {
    // Existing sorting logic
    return [...articles].sort((a, b) => {
      switch (sortOrder) {
        case 'most-liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  // Handler Methods (keep existing implementations)
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredArticles(
      sortArticles(
        articles.filter((article) =>
          article.title.toLowerCase().includes(query) ||
          article.content?.toLowerCase().includes(query)
        ),
        sortBy
      )
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setFilteredArticles(sortArticles(filteredArticles, e.target.value));
  };

  const handletagchange=async(e)=>{
    setTagby(e.target.value)
    console.log(e.target.value)
    const resp = await axios.post(`${url}/api/article/getarticlebytag`, { tag: e.target.value })
    // console.log(resp.data.articles)
    console.log(resp.data)
    if (resp.data.success) {
      setArticles(resp.data.articles)
    }else{
      setArticles([])
    }
    // setArticles(resp.data.articles)
  }

  


  const handleTagClick = async (tag) => {
    try {
      const resp = await axios.post(`${url}/api/article/getarticlebytag`, { tag });
      setArticles(resp.data.articles || []);
    } catch (error) {
      console.error('Error fetching articles by tag', error);
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen py-10 pt-24"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Animated Title with Enhanced Gradient */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-extrabold text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-12"
        >
          Explore Articles
        </motion.h1>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-400 transition duration-300"
          />

          {/* Tag and Sort Dropdowns */}
          <div className="flex space-x-4">
            <select 
              value={tagby} 
              onChange={(e) => handleTagClick(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            >
             <option value="Tech">Technology</option>
          <option value="Music">Music</option>
          <option value="Game">Gaming</option>
          <option value="Movies">Movies</option>
          <option value="Books">Books</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Fashion">Fashion</option>
          <option value="Health">Health</option>
          <option value="Sports">Sports</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Finance">Finance</option>
          <option value="Politics">Politics</option>
          <option value="Narratives">Narratives</option>
          <option value="Trending-Topics">Trending-Topics</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
            >
             <option value="most-liked">Most Liked</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="more than 500 words">More than 500 words</option>
          <option value="less than 500 words">Less than 500 words</option>
          <option value="more than 1000 words">More than 1000 words</option>
          <option value="less than 1000 words">Less than 1000 words</option>
            </select>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {!loading && filteredArticles.length > 0 && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredArticles.map((article) => (
                <motion.div
                  key={article._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Article Thumbnail */}
                  {article.thumbnail && (
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                        {article.tag || 'Uncategorized'}
                      </span>
                      <LikeButton
                        articleId={article._id}
                        initialLikes={article.likes || 0}
                      />
                    </div>

                    <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-3">
                      {article.title}
                    </h3>

                    <Markdown className="text-gray-600 dark:text-gray-300  h-20 mb-8 line-clamp-3">
                      {article.content || 'No description available.'}
                    </Markdown>

                    {/* Read More Button with Advanced Animation */}
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => window.location.href = `/article/${article.name}`}
                      className=" relative w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition duration-300 bottom-4"
                    >
                      Read More
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* No Articles State */}
        {!loading && filteredArticles.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <img 
              src={NoarticleImage} 
              alt="No articles" 
              className="mx-auto w-64 h-64 mb-6 opacity-70"
            />
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">
              No Articles Found
            </h2>
            <p className="text-gray-500">
              Check back later or start writing your first article!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ArticleList;