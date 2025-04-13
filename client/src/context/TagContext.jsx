import React, { createContext, useEffect, useState } from 'react'
import tagService from '../api/tagService';
import { set } from 'mongoose';
import toast from 'react-hot-toast';

const TagContext = createContext();

const TagProvider = ({children}) => {

    const [tags, setTags] = useState([]);   

    // fetch all tags when component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await tagService.getAllTags();
                setTags(response.data.tags || []);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }
    , []);
     
    // create a new tag
    const createTag = async (tagData) => {
        try {
            // setTags((prevTags) => [...prevTags, tagData]);
            const response = await tagService.createTag(tagData);
            setTags((prevTags) => [...prevTags, response.data.tag]);
            toast.success('Tag created successfully!');
        } catch (error) {
            toast.error('Failed to create tag');
            console.error('Error creating tag:', error);
        }
    }

    // fetch all tags when component mounts
    const fetchTags = async () => {
        try {
            const response = await tagService.getAllTags();
            setTags(response.data.tags || []);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };


  return (
    <TagContext.Provider value={{
        tags,
        setTags,
        createTag,
        fetchTags,

      }}>
        {children}
      </TagContext.Provider>
  )
}

export default TagProvider;

// Custom hook to use the TagContext
// This hook allows components to access the TagContext values easily
export const useTagContext = () => {
    const context = React.useContext(TagContext);
    if (!context) {
        throw new Error('useTagContext must be used within a TagProvider');
    }
    return context;
}