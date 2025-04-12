import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  Box,
  OutlinedInput
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useTodoContext } from '../context/TodoContext';
import { format, parseISO } from 'date-fns';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditTodoDialog = ({ open, handleClose, todo }) => {
  const { updateTodo, users: contextUsers, tags: availableContextTags } = useTodoContext();
  
  // Initialize state with todo data
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.dueDate ? parseISO(todo.dueDate) : null);
  const [priority, setPriority] = useState(todo?.priority || 'Low');
  const [status, setStatus] = useState(todo?.status || 'Pending');
  // Keep mentions as an array of objects
  const [mentions, setMentions] = useState(todo?.mentions || []);
  const [tags, setTags] = useState(todo?.tags || []);
  const [users, setUsers] = useState(contextUsers || []);
  const [availableTags, setAvailableTags] = useState(availableContextTags || []);
  
  // Update state when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setDueDate(todo.dueDate ? parseISO(todo.dueDate) : null);
      setPriority(todo.priority || 'Low');
      setStatus(todo.status || 'Pending');
      setMentions(todo.mentions || []);
      setTags(todo.tags || []);
    }
  }, [todo]);
  
  // Update users and tags from context
  useEffect(() => {
    setUsers(contextUsers);
    setAvailableTags(availableContextTags);
  }, [contextUsers, availableContextTags]);
  
  // Remove the fetch effect since we're using context data
  
  // Update handleSubmit to keep mentions as objects
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedTodo = {
      ...todo,
      title,
      description,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null,
      priority,
      status,
      mentions, // Keep as is since it's already an array of objects
      tags // Keep as is since it's already an array of objects
    };
    
    try {
      updateTodo(updatedTodo);
      handleClose();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  
  // Update the remove handlers to work with objects
  const handleRemoveMention = (userId) => {
    console.log("Removing mention with ID:", userId); // Debugging line
    setMentions(mentions.filter(mention => mention.id !== userId));
  };
  
  const handleRemoveTag = (tagId) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '8px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Todo</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ paddingTop: 1 }}>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          

          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel id="mentions-label">Mentioned Users</InputLabel>
            <Select
              labelId="mentions-label"
              multiple
              value={mentions.map(mention => mention.id)}
              onChange={(e) => {
                const selectedIds = e.target.value;
                const newMentions = selectedIds.map(id => {
                  const existingMention = mentions.find(m => m.id === id);
                  if (existingMention) return existingMention;
                  
                  const user = users.find(u => u.id === id);
                  return user || { id };
                });
                setMentions(newMentions);
              }}
              input={<OutlinedInput id="select-mentions" label="Mentioned Users" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((userId) => {
                    const mention = mentions.find(m => m.id === userId);
                    return (
                      <Chip 
                        key={userId} 
                        label={mention?.username || mention?.name || userId}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onDelete={(e) => {
                          e && e.stopPropagation();
                          handleRemoveMention(userId);
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username || user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={tags.map(tag => tag.id)}
              onChange={(e) => {
                const selectedIds = e.target.value;
                const newTags = selectedIds.map(id => {
                  const existingTag = tags.find(t => t.id === id);
                  if (existingTag) return existingTag;
                  
                  const tag = availableTags.find(t => t.id === id);
                  return tag || { id };
                });
                setTags(newTags);
              }}
              input={<OutlinedInput id="select-tags" label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return (
                      <Chip 
                        key={tagId} 
                        label={tag?.name || tagId}
                        style={{
                          backgroundColor: tag?.color || '#e0e0e0',
                          color: tag?.textColor || '#000'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onDelete={(e) => {
                          e && e.stopPropagation();
                          handleRemoveTag(tagId);
                        }}
                      />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={(newDate) => setDueDate(newDate)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="dense" />
              )}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleClose}
            sx={{ 
              color: 'gray',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '4px',
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTodoDialog;