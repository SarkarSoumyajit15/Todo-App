import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTodoContext } from "../context/TodoContext";
import TodoItem from "./TodoItem";
import AddTodoModal from "./AddTodoModal";
import TodoDetailModal from "./TodoDetailModal";
import EditTodoDialog from "./EditTodoDialog";

const TodoList = ({ limit, showViewAll = false, currentUser }) => {
  const {
    todos,
    loading,
    error,
    filters,
    getFilteredTodos,
    sortOption,
    setSortOption,
  } = useTodoContext();

  console.log("getFilteredTodos",getFilteredTodos);

  const [localLoading, setLocalLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditTodo, setCurrentEditTodo] = useState(null);
  const [paginatedTodos, setPaginatedTodos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // const itemsPerPage = 2; // Number of items per page

  useEffect(() => {
    // Reset pagination when todos or filters change
    const applyFilters = async () => {
      setLocalLoading(true);
      const filtered = await getFilteredTodos();

      

      // Sort todos
      const sorted = [...filtered].sort((a, b) => {
        if (sortOption === "date-asc") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortOption === "date-desc") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOption === "priority") {
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Default to no sorting as the compare function returns 0
        return 0;
      });

      console.log("Sorted Todos", sorted);

      // calcaulating the total pages
      const TotalPages =
        sorted.length > limit
          ? Math.ceil(sorted.length / limit)
          : 1;
      setTotalPages(TotalPages);



      // Paginate todos
      const PaginatedTodos =
        sorted.length > limit
          ? sorted.slice(
              (currentPage - 1) * limit,
              currentPage * limit
            )
          : sorted;

      setPaginatedTodos(PaginatedTodos);


      setLocalLoading(false);
    };

    applyFilters();
  }, [todos, filters, limit, getFilteredTodos, searchQuery, sortOption,currentPage ]);

  const handleOpenTodoDetail = (todo) => { 
    setSelectedTodo(todo);
  };

  const handleCloseTodoDetail = () => {
    setSelectedTodo(null);
  };

  const handleOpenEditDialog = (todo) => {
    setCurrentEditTodo(todo);
    setEditDialogOpen(true);
  };

  // Pagination
  // const TotalPages = (filteredTodos.length > limit) ? Math.ceil(filteredTodos.length / limit) : 1;
  // setTotalPages(TotalPages);

  // console.log("Filtered todos",filteredTodos );
  // // console.log("limit",limit );
  // const PaginatedTodos = (filteredTodos.length > limit) ?
  //   filteredTodos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) :
  //   filteredTodos;

  //   setPaginatedTodos(PaginatedTodos);

  // console.log("Paginated Todos", paginatedTodos);

  if (loading || localLoading) {
    return (
      <div className="flex justify-center items-center py-8">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">Error: {error}</div>;
  }

  console.log("next clicked",currentPage)
  if (paginatedTodos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No tasks found. </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Todo
          </button>

          <div className="flex items-center space-x-4">
            {/*<div className="relative">
              <input
                type="text"
                placeholder="Search todos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div> */}

            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      }

      <div className="space-y-4">
        {paginatedTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onOpenDetail={() => handleOpenTodoDetail(todo)}
            onEdit={handleOpenEditDialog}
            currentUser={currentUser}
          />
        ))}

        {/* {showViewAll && todos.length > limit && (
          <div className="text-center mt-4">
            <Link 
              to="/todos" 
              className="text-primary hover:text-primary-dark font-medium"
            >
              View all tasks
            </Link>
          </div>
        )} */}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
          <button
            className="text-gray-600 flex items-center"
            onClick={() => {
              console.log("prev clicked" , currentPage);
              setCurrentPage((prev) => Math.max(prev - 1, 1))}}
            disabled={currentPage === 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>

          <div className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </div>

          <button
            className="text-gray-600 flex items-center"
            onClick={() =>
              setCurrentPage((prev) => 
                Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <AddTodoModal
          onClose={() => setIsAddModalOpen(false)}
          currentUser={currentUser}
        />
      )}

      {selectedTodo && (
        <TodoDetailModal
          todo={selectedTodo}
          onClose={handleCloseTodoDetail}
          currentUser={currentUser}
        />
      )}

      {editDialogOpen && currentEditTodo && (
        <EditTodoDialog
          open={editDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          todo={currentEditTodo}
        />
      )}
    </div>
  );
};

export default TodoList;
