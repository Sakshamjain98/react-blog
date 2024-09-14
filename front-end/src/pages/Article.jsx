import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import articleContent from './article-content'
import Articles from '../components/Articles'
import NotFound from './NotFound'
import CommentsList from "../components/CommentsList"
import AddComment from "../components/AddComment"


/*const fetchData = async () => {
      const result = await fetch(`http://localhost:8000/api/articles/learn-react`);
      const body = await result.json();
      console.log(body);
    };
fetchData();*/

const Article = () => {
  const { name } = useParams();
  const article = articleContent.find((article) => article.name === name);
  const [articleInfo, setArticleInfo] = useState({ comments: [] });

  useEffect(() => {
    const fetchData = async () => {
<<<<<<< HEAD
      const result = await fetch(`http://localhost:8080/api/articles/${name}`);
=======
	 const result = await fetch(`/api/articles/${name}`);
>>>>>>> c501af01a6d94acc84070ae9f335d9f8f1d61253
      const body = await result.json();
      console.log(body);
      setArticleInfo(body);
    };
    fetchData();
  }, [name]);

  if (!article) return <NotFound />;
  const otherArticles = articleContent.filter(
    (article) => article.name !== name
  );
  return (
    <>
      <h1 className='sm:text-4xl text-2xl font-bold my-6 text-gray-900'>
        {article.title}
      </h1>
      {article.content && article.content.map((paragraph, index) => (
        <p className='mx-auto leading-relaxed text-base mb-4' key={index}>
          {paragraph}
        </p>
      ))}
      <CommentsList comments={articleInfo.comments} />
      <AddComment articleName={name} setArticleInfo={setArticleInfo} />
      <h1 className='sm:text-2xl text-xl font-bold my-4 text-gray-900'>
        Other Articles
      </h1>
      <div className='flex flex-wrap -m-4'>
        <Articles articles={otherArticles} />
      </div>
    </>
  )
}

export default Article;
