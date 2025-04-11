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
  const { updateTodo } = useTodoContext();
  
  // Initialize state with todo data
  console.log(todo);
  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [dueDate, setDueDate] = useState(todo?.dueDate ? parseISO(todo.dueDate) : null);
  const [priority, setPriority] = useState(todo?.priority || 'Low');
  const [status, setStatus] = useState(todo?.status || 'Pending');
  // Update to use mentions instead of assignedUsers
  const [mentions, setMentions] = useState(todo?.mentions?.map(user => user.name || user) || []);
  const [tags, setTags] = useState(todo?.tags?.map(tag => tag.name || tag) || []);
  const [users, setUsers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  // Update state when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setDueDate(todo.dueDate ? parseISO(todo.dueDate) : null);
      setPriority(todo.priority || 'Low');
      setStatus(todo.status || 'Pending');
      // Update to use mentions
      setMentions(todo.mentions?.map(user => typeof user === 'object' ? user.name : user) || []);
      setTags(todo.tags?.map(tag => typeof tag === 'object' ? tag.name : tag) || []);
    }
  }, [todo]);
  
  // Fetch users and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          credentials: 'include'
        });
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Fetch tags
        const tagsResponse = await fetch('http://localhost:5000/api/tags', {
          credentials: 'include'
        });
        const tagsData = await tagsResponse.json();
        setAvailableTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedTodo = {
      ...todo,
      title,
      description,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null,
      priority,
      status,
      // Update to use mentions
      mentions,
      tags: tags.map(tagId => {
        const tag = availableTags.find(t => t.id === tagId);
        return tag || { id: tagId };
      })
    };
    
    try {
      await updateTodo(updatedTodo);
      handleClose();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
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
              value={mentions}
              onChange={(e) => setMentions(e.target.value)}
              input={<OutlinedInput id="select-mentions" label="Mentioned Users" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((userId) => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <Chip key={userId} label={user ? user.username : userId} />
                    );
                  })}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="dense" sx={{ marginBottom: 2 }}>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              input={<OutlinedInput id="select-tags" label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((tagId) => {
                    const tag = availableTags.find(t => t.id === tagId);
                    return (
                      <Chip 
                        key={tagId} 
                        label={tag ? tag.name : tagId}
                        style={{
                          backgroundColor: tag?.color || '#e0e0e0',
                          color: tag?.textColor || '#000'
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