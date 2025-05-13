import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPost, updatePost } from '../api/posts';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    tags: '',
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPost(id, token);
        setFormData({
          title: data.post.title,
          content: data.post.content,
          location: data.post.location,
          tags: data.post.tags.join(', '),
        });
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/');
      }
    };
    loadPost();
  }, [id, token, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      await updatePost(id, { ...formData, tags: tagsArray }, token);
      navigate('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name='title'
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name='content'
        value={formData.content}
        onChange={handleChange}
        required
      />
      <input
        name='location'
        value={formData.location}
        onChange={handleChange}
      />
      <input
        name='tags'
        value={formData.tags}
        onChange={handleChange}
        placeholder='Tags (comma separated)'
      />
      <button type='submit'>Update Post</button>
    </form>
  );
};

export default EditPost;
