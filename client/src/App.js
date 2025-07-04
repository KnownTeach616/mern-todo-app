// src/App.App.js
// Main React component for the To-Do application.
// Manages user authentication, To-Do operations, and UI theming.

import React, { useState, useEffect, useCallback } from 'react';

// Defines available themes with Tailwind CSS classes.
const themes = {
    'default': {
        background: 'from-blue-100 via-purple-100 to-pink-100',
        primaryBtn: 'from-indigo-600 to-purple-700',
        secondaryBtn: 'from-teal-600 to-emerald-700',
        editBtn: 'from-yellow-500 to-orange-600',
        deleteBtn: 'from-red-500 to-red-700',
        toggleBtn: 'from-blue-300 to-blue-500',
        grayToggleBtn: 'from-gray-300 to-gray-500',
        toggleBtnTextColor: 'text-black',
        primaryFocus: 'focus:ring-indigo-400',
        secondaryFocus: 'focus:ring-teal-400',
        filterFocus: 'focus:ring-purple-400',
        checkboxFocus: 'focus:ring-indigo-500',
        addTodoBg: 'bg-blue-50 border-blue-200',
        addTodoFocus: 'focus:ring-indigo-400',
        priorityHigh: 'bg-red-200 text-red-800',
        priorityMedium: 'bg-yellow-200 text-yellow-800',
        priorityLow: 'bg-green-200 text-green-800',
        loginLink: 'text-indigo-700',
        inputBorder: 'border-gray-300',
        inputBg: 'bg-white',
        cardBg: 'bg-white',
        cardShadow: 'shadow-2xl',
        todoItemBg: 'bg-gray-50',
        todoItemBorder: 'border-gray-200',
        filterBg: 'bg-gray-50',
        filterBorder: 'border-gray-200',
        textColor: 'text-gray-900',
        labelColor: 'text-gray-700',
        placeholderColor: 'placeholder-gray-400',
    },
    'dark': {
        background: 'from-gray-800 via-gray-900 to-black',
        primaryBtn: 'from-blue-700 to-blue-900',
        secondaryBtn: 'from-green-700 to-green-900',
        editBtn: 'from-yellow-600 to-orange-700',
        deleteBtn: 'from-red-700 to-red-900',
        toggleBtn: 'from-emerald-600 to-emerald-800',
        grayToggleBtn: 'from-gray-600 to-gray-800',
        toggleBtnTextColor: 'text-white',
        primaryFocus: 'focus:ring-blue-500',
        secondaryFocus: 'focus:ring-green-500',
        filterFocus: 'focus:ring-purple-500',
        checkboxFocus: 'focus:ring-blue-600',
        addTodoBg: 'bg-gray-700 border-gray-600',
        addTodoFocus: 'focus:ring-blue-500',
        priorityHigh: 'bg-red-700 text-red-100',
        priorityMedium: 'bg-yellow-700 text-yellow-100',
        priorityLow: 'bg-green-700 text-green-100',
        loginLink: 'text-blue-400',
        inputBorder: 'border-gray-600',
        inputBg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        cardShadow: 'shadow-lg',
        todoItemBg: 'bg-gray-700',
        todoItemBorder: 'border-gray-600',
        filterBg: 'bg-gray-700',
        filterBorder: 'border-gray-600',
        textColor: 'text-gray-100',
        labelColor: 'text-gray-200',
        placeholderColor: 'placeholder-gray-500',
    },
    'forest': {
        background: 'from-green-100 via-green-200 to-emerald-100',
        primaryBtn: 'from-lime-600 to-green-700',
        secondaryBtn: 'from-teal-600 to-cyan-700',
        editBtn: 'from-orange-500 to-amber-600',
        deleteBtn: 'from-red-600 to-red-800',
        toggleBtn: 'from-emerald-300 to-emerald-500',
        grayToggleBtn: 'from-stone-300 to-stone-500',
        toggleBtnTextColor: 'text-black',
        primaryFocus: 'focus:ring-lime-400',
        secondaryFocus: 'focus:ring-teal-400',
        filterFocus: 'focus:ring-green-400',
        checkboxFocus: 'focus:ring-green-600',
        addTodoBg: 'bg-lime-50 border-lime-200',
        addTodoFocus: 'focus:ring-lime-400',
        priorityHigh: 'bg-red-300 text-red-900',
        priorityMedium: 'bg-orange-300 text-orange-900',
        priorityLow: 'bg-green-300 text-green-900',
        loginLink: 'text-green-800',
        inputBorder: 'border-green-300',
        inputBg: 'bg-white',
        cardBg: 'bg-white',
        cardShadow: 'shadow-2xl',
        todoItemBg: 'bg-green-50',
        todoItemBorder: 'border-green-200',
        filterBg: 'bg-green-50',
        filterBorder: 'border-green-200',
        textColor: 'text-gray-900',
        labelColor: 'text-gray-700',
        placeholderColor: 'placeholder-gray-400',
    }
};

/**
 * ConfirmationModal Component: Reusable modal for user confirmations.
 * @param {object} props - Component properties.
 * @param {string} props.message - Message displayed in the modal.
 * @param {function} props.onConfirm - Callback for confirm action.
 * @param {function} props.onCancel - Callback for cancel action.
 * @param {boolean} props.isVisible - Controls modal visibility.
 * @param {string} [props.confirmText='Confirm'] - Text for the confirm button.
 * @param {string} [props.cancelText='Cancel'] - Text for the cancel button.
 */
const ConfirmationModal = ({ message, onConfirm, onCancel, isVisible, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-sm w-full text-center transform transition-all duration-300 scale-100 opacity-100">
                <p className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-medium text-base sm:text-lg"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-medium text-base sm:text-lg"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [newTodoPriority, setNewTodoPriority] = useState('Medium');
    const [editingTodo, setEditingTodo] = useState(null);

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortOption, setSortOption] = useState('createdAtDesc');

    const [todoCounts, setTodoCounts] = useState({ all: 0, completed: 0, incomplete: 0, High: 0, Medium: 0, Low: 0 });

    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('appTheme') || 'default';
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmModalAction, setConfirmModalAction] = useState(null);

    const [forgotPasswordView, setForgotPasswordView] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [securityQuestionDisplayed, setSecurityQuestionDisplayed] = useState('');
    const [securityQuestionUserId, setSecurityQuestionUserId] = useState(null);
    const [securityAnswerInput, setSecurityAnswerInput] = useState('');
    const [newPasswordReset, setNewPasswordReset] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);


    const [userSecurityQuestion, setUserSecurityQuestion] = useState('');
    const [userSecurityAnswer, setUserSecurityAnswer] = useState('');


    const API_URL = 'http://localhost:5000/api';

    /**
     * Displays a transient message.
     * @param {string} msg - Message text.
     * @param {string} type - Message type ('success' or 'error').
     */
    const showMessage = useCallback((msg, type) => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    /**
     * Saves user preferences (filter/sort) to the backend.
     */
    const saveUserPreferences = useCallback(async (preferences) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/auth/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(preferences),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('User preferences saved:', data.user);
            } else {
                console.error('Failed to save user preferences:', data.message);
            }
        } catch (error) {
            console.error('Network error saving user preferences:', error);
        }
    }, [API_URL]);

    /**
     * Fetches To-Do items for the authenticated user with filters and sorting.
     */
    const fetchTodos = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            setUser(null);
            window.location.hash = '#/login';
            return;
        }
        try {
            const queryParams = new URLSearchParams();
            if (filterStatus !== 'all') {
                queryParams.append('completed', filterStatus === 'completed');
            }
            if (filterPriority !== 'all') {
                queryParams.append('priority', filterPriority);
            }
            queryParams.append('sort', sortOption);

            const response = await fetch(`${API_URL}/todos?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setTodos(data);

                const allTodos = data;
                const completedCount = allTodos.filter(todo => todo.completed).length;
                const incompleteCount = allTodos.filter(todo => !todo.completed).length;
                const highPriorityCount = allTodos.filter(todo => todo.priority === 'High').length;
                const mediumPriorityCount = allTodos.filter(todo => todo.priority === 'Medium').length;
                const lowPriorityCount = allTodos.filter(todo => todo.priority === 'Low').length;

                setTodoCounts({
                    all: allTodos.length,
                    completed: completedCount,
                    incomplete: incompleteCount,
                    High: highPriorityCount,
                    Medium: mediumPriorityCount,
                    Low: lowPriorityCount,
                });

            } else {
                showMessage(data.message || 'Failed to fetch To-Dos.', 'error');
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setUser(null);
                    window.location.hash = '#/login';
                }
            }
        } catch (error) {
            console.error('Fetch todos error:', error);
            showMessage('Network error fetching To-Dos. Please try again.', 'error');
        }
    }, [API_URL, showMessage, filterStatus, filterPriority, sortOption]);

    /**
     * Determines the current view based on the URL hash.
     * @returns {string} Current view ('login', 'signup', 'todos', or 'forgot-password').
     */
    const getCurrentView = useCallback(() => {
        const hash = window.location.hash;
        if (hash === '#/signup') return 'signup';
        if (hash === '#/todos' && isLoggedIn) return 'todos';
        if (hash === '#/forgot-password') return 'forgot-password';
        return 'login';
    }, [isLoggedIn]);

    const [currentHashView, setCurrentHashView] = useState(getCurrentView());

    /**
     * Verifies the client-side authentication token with the backend.
     */
    const verifyToken = useCallback(async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUser(data);
                // Apply fetched preferences. The useEffect hook will trigger fetchTodos after these states update.
                if (data.defaultFilterStatus) setFilterStatus(data.defaultFilterStatus);
                if (data.defaultFilterPriority) setFilterPriority(data.defaultFilterPriority);
                if (data.defaultSortOption) setSortOption(data.defaultSortOption);

                if (window.location.hash !== '#/todos') {
                    window.location.hash = '#/todos';
                }
            } else {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUser(null);
                if (window.location.hash !== '#/login') {
                    window.location.hash = '#/login';
                }
                showMessage('Session expired or invalid. Please log in again.', 'error');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            setUser(null);
            if (window.location.hash !== '#/login') {
                window.location.hash = '#/login';
            }
            showMessage('Network error during session check. Please try again.', 'error');
        }
    }, [API_URL, showMessage]); // Removed fetchTodos from dependencies as it's triggered by other useEffect

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            if (window.location.hash !== '#/login' && window.location.hash !== '#/signup' && window.location.hash !== '#/forgot-password') {
                window.location.hash = '#/login';
            }
        }

        const handleHashChange = () => {
            setCurrentHashView(getCurrentView());
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [verifyToken, getCurrentView]);

    // Effect to trigger fetchTodos when filter/sort options or login status changes
    useEffect(() => {
        if (isLoggedIn) {
            fetchTodos();
        }
    }, [isLoggedIn, filterStatus, filterPriority, sortOption, fetchTodos]);

    // Effect to save preferences when they change (debounced for performance)
    useEffect(() => {
        if (isLoggedIn && user) {
            const timer = setTimeout(() => {
                saveUserPreferences({
                    defaultFilterStatus: filterStatus,
                    defaultFilterPriority: filterPriority,
                    defaultSortOption: sortOption
                });
            }, 1000); // Debounce for 1 second
            return () => clearTimeout(timer);
        }
    }, [filterStatus, filterPriority, sortOption, isLoggedIn, user, saveUserPreferences]);


    /**
     * Handles user login form submission.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsAuthenticating(true);
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                verifyToken(data.token);
                showMessage(data.message, 'success');
            } else {
                showMessage(data.message || 'Login failed.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showMessage('Network error during login. Please try again.', 'error');
        } finally {
            setIsAuthenticating(false);
        }
    };

    /**
     * Handles user signup form submission.
     */
    const handleSignup = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const securityQuestion = e.target.securityQuestion.value;
        const securityAnswer = e.target.securityAnswer.value;

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, securityQuestion, securityAnswer }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                verifyToken(data.token);
                showMessage(data.message, 'success');
            } else {
                showMessage(data.message || 'Signup failed.', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            showMessage('Network error during signup. Please try again.', 'error');
        }
    };

    /**
     * Handles user logout.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        setTodos([]);
        setFilterStatus('all');
        setFilterPriority('all');
        setSortOption('createdAtDesc');
        window.location.hash = '#/login';
        showMessage('Logged out successfully.', 'success');
    };

    /**
     * Handles creation of a new To-Do item.
     */
    const handleCreateTodo = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ title: newTodoTitle, description: newTodoDescription, priority: newTodoPriority }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                setNewTodoTitle('');
                setNewTodoDescription('');
                setNewTodoPriority('Medium');
                fetchTodos();
            } else {
                showMessage(data.message || 'Failed to create To-Do.', 'error');
            }
        } catch (error) {
            console.error('Create todo error:', error);
            showMessage('Network error creating To-Do. Please try again.', 'error');
        }
    };

    /**
     * Handles updating an existing To-Do item.
     * @param {string} id - To-Do item ID.
     * @param {object} updatedFields - Fields to update.
     */
    const handleUpdateTodo = async (id, updatedFields) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify(updatedFields),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                setEditingTodo(null);
                fetchTodos();
            } else {
                showMessage(data.message || 'Failed to update To-Do.', 'error');
            }
        } catch (error) {
            console.error('Update todo error:', error);
            showMessage('Network error updating To-Do. Please try again.', 'error');
        }
    };

    /**
     * Handles deleting a To-Do item.
     * @param {string} id - To-Do item ID.
     */
    const handleDeleteTodo = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token,
                },
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                fetchTodos();
            } else {
                showMessage(data.message || 'Failed to delete To-Do.', 'error');
            }
        } catch (error) {
            console.error('Delete todo error:', error);
            showMessage('Network error deleting To-Do. Please try again.', 'error');
        }
    };

    /**
     * Updates the current theme.
     * @param {string} themeName - Name of the theme to apply.
     */
    const handleThemeChange = (themeName) => {
        setCurrentTheme(themeName);
        localStorage.setItem('appTheme', themeName);
    };

    const activeTheme = themes[currentTheme];

    const confirmAction = () => {
        if (confirmModalAction) {
            confirmModalAction();
        }
        setShowConfirmModal(false);
        setConfirmModalMessage('');
        setConfirmModalAction(null);
    };

    const cancelAction = () => {
        setShowConfirmModal(false);
        setConfirmModalMessage('');
        setConfirmModalAction(null);
    };

    /**
     * Requests confirmation before deleting a To-Do.
     * @param {string} id - To-Do item ID.
     */
    const requestDeleteConfirmation = (id) => {
        setConfirmModalMessage('Are you sure you want to delete this To-Do? This action cannot be undone.');
        setConfirmModalAction(() => () => handleDeleteTodo(id));
        setShowConfirmModal(true);
    };

    /**
     * Requests confirmation before changing a To-Do's completion status.
     * @param {string} todoId - To-Do item ID.
     * @param {boolean} currentStatus - Current completion status of the To-Do.
     */
    const requestStatusChangeConfirmation = (todoId, currentStatus) => {
        const newStatusText = currentStatus ? 'unmark' : 'mark';
        setConfirmModalMessage(`Are you sure you want to ${newStatusText} this To-Do as ${currentStatus ? 'incomplete' : 'completed'}?`);
        setConfirmModalAction(() => () => handleUpdateTodo(todoId, { completed: !currentStatus }));
        setShowConfirmModal(true);
    };

    /**
     * Requests confirmation before saving edited To-Do details.
     * @param {object} todo - The To-Do object with current editing state.
     */
    const requestEditSaveConfirmation = (todo) => {
        setConfirmModalMessage('Are you sure you want to save these changes?');
        setConfirmModalAction(() => () => handleUpdateTodo(todo._id, { title: todo.title, description: todo.description, completed: todo.completed, priority: todo.priority }));
        setShowConfirmModal(true);
    };

    /**
     * Handles the request to initiate password reset.
     */
    const handleForgotPasswordRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/forgot-password-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotPasswordEmail }),
            });
            const data = await response.json();
            if (response.ok) {
                setSecurityQuestionDisplayed(data.securityQuestion);
                setSecurityQuestionUserId(data.userId);
                showMessage('Please answer your security question.', 'success');
            } else {
                showMessage(data.message || 'Failed to find user.', 'error');
            }
        } catch (error) {
            console.error('Forgot password request error:', error);
            showMessage('Network error during password reset request. Please try again.', 'error');
        }
    };

    /**
     * Handles password reset via security question.
     */
    const handleSecurityQuestionReset = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/reset-password-security-question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: securityQuestionUserId, securityAnswer: securityAnswerInput, newPassword: newPasswordReset }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                setForgotPasswordView(false);
                setForgotPasswordEmail('');
                setSecurityQuestionDisplayed('');
                setSecurityQuestionUserId(null);
                setSecurityAnswerInput('');
                setNewPasswordReset('');
                window.location.hash = '#/login';
            } else {
                showMessage(data.message || 'Password reset failed.', 'error');
            }
        } catch (error) {
            console.error('Security question reset error:', error);
            showMessage('Network error during password reset. Please try again.', 'error');
        }
    };

    /**
     * Handles setting security question and answer for a logged-in user.
     */
    const handleSetSecurityQuestion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/auth/set-security-question`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ securityQuestion: userSecurityQuestion, securityAnswer: userSecurityAnswer }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(data.message, 'success');
                setUser(prevUser => ({ ...prevUser, securityQuestion: userSecurityQuestion }));
                setUserSecurityQuestion('');
                setUserSecurityAnswer('');
            } else {
                showMessage(data.message || 'Failed to set security question.', 'error');
            }
        } catch (error) {
            console.error('Set security question error:', error);
            showMessage('Network error setting security question. Please try again.', 'error');
        }
    };


    /**
     * Renders content based on the current view.
     */
    const renderContent = () => {
        const view = getCurrentView();

        if (view === 'login') {
            return (
                <div className={`${activeTheme.cardBg} p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl ${activeTheme.cardShadow} w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-all duration-300`}>
                    <h2 className={`text-3xl sm:text-4xl font-extrabold ${activeTheme.textColor} mb-2 text-center`}>Welcome Back!</h2>
                    <p className={`text-center ${activeTheme.labelColor} text-base sm:text-lg mb-6 sm:mb-8`}>
                        Log in to manage your tasks and boost your productivity.
                    </p>
                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your.email@example.com"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className={`w-full bg-gradient-to-r ${activeTheme.primaryBtn} text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:ring-opacity-50 transition duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isAuthenticating ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className={`mt-6 sm:mt-8 text-center ${activeTheme.labelColor} text-base sm:text-lg`}>
                        Don't have an account?{' '}
                        <button
                            onClick={() => { window.location.hash = '#/signup'; }}
                            className={`${activeTheme.loginLink} hover:underline font-bold transition duration-300`}
                        >
                            Sign Up
                        </button>
                    </p>
                    <p className={`mt-2 text-center ${activeTheme.labelColor} text-base sm:text-lg`}>
                        Forgot your password?{' '}
                        <button
                            onClick={() => { window.location.hash = '#/forgot-password'; setForgotPasswordView(true); }}
                            className={`${activeTheme.loginLink} hover:underline font-bold transition duration-300`}
                        >
                            Reset Here
                        </button>
                    </p>
                </div>
            );
        } else if (view === 'signup') {
            return (
                <div className={`${activeTheme.cardBg} p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl ${activeTheme.cardShadow} w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-all duration-300 hover:scale-105`}>
                    <h2 className={`text-3xl sm:text-4xl font-extrabold ${activeTheme.textColor} mb-2 text-center`}>Join Us!</h2>
                    <p className={`text-center ${activeTheme.labelColor} text-base sm:text-lg mb-6 sm:mb-8`}>
                        Create an account to start organizing your life with ease.
                    </p>
                    <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Your Username"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your.email@example.com"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="securityQuestion">
                                Security Question (Optional)
                            </label>
                            <input
                                type="text"
                                id="securityQuestion"
                                name="securityQuestion"
                                placeholder="e.g., What is your mother's maiden name?"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="securityAnswer">
                                Security Answer (Optional)
                            </label>
                            <input
                                type="password"
                                id="securityAnswer"
                                name="securityAnswer"
                                placeholder="Your answer"
                                className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-gradient-to-r ${activeTheme.secondaryBtn} text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-teal-700 hover:to-emerald-800 focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:ring-opacity-50 transition duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className={`mt-6 sm:mt-8 text-center ${activeTheme.labelColor} text-base sm:text-lg`}>
                        Already have an account?{' '}
                        <button
                            onClick={() => { window.location.hash = '#/login'; }}
                            className={`${activeTheme.loginLink} hover:underline font-bold transition duration-300`}
                        >
                            Login
                        </button>
                    </p>
                </div>
            );
        } else if (view === 'forgot-password') {
            return (
                <div className={`${activeTheme.cardBg} p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl ${activeTheme.cardShadow} w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl transform transition-all duration-300`}>
                    <h2 className={`text-3xl sm:text-4xl font-extrabold ${activeTheme.textColor} mb-2 text-center`}>Forgot Password?</h2>
                    <p className={`text-center ${activeTheme.labelColor} text-base sm:text-lg mb-6 sm:mb-8`}>
                        Enter your email to retrieve your security question.
                    </p>
                    {!securityQuestionDisplayed ? (
                        <form onSubmit={handleForgotPasswordRequest} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="forgotEmail">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="forgotEmail"
                                    name="forgotEmail"
                                    placeholder="your.email@example.com"
                                    value={forgotPasswordEmail}
                                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-gradient-to-r ${activeTheme.primaryBtn} text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:ring-opacity-50 transition duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                            >
                                Get Security Question
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSecurityQuestionReset} className="space-y-4 sm:space-y-6">
                            <div>
                                <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`}>
                                    Security Question:
                                </label>
                                <p className={`text-lg font-medium ${activeTheme.textColor} mb-2`}>
                                    {securityQuestionDisplayed}
                                </p>
                            </div>
                            <div>
                                <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="securityAnswerInput">
                                    Your Answer
                                </label>
                                <input
                                    type="text"
                                    id="securityAnswerInput"
                                    name="securityAnswerInput"
                                    placeholder="Your answer"
                                    value={securityAnswerInput}
                                    onChange={(e) => setSecurityAnswerInput(e.target.value)}
                                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block ${activeTheme.labelColor} text-base sm:text-lg font-semibold mb-2`} htmlFor="newPasswordReset">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPasswordReset"
                                    name="newPasswordReset"
                                    placeholder="••••••••"
                                    value={newPasswordReset}
                                    onChange={(e) => setNewPasswordReset(e.target.value)}
                                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:border-transparent transition duration-300 text-base sm:text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-gradient-to-r ${activeTheme.secondaryBtn} text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-teal-700 hover:to-emerald-800 focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:ring-opacity-50 transition duration-300 text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                    <p className={`mt-6 sm:mt-8 text-center ${activeTheme.labelColor} text-base sm:text-lg`}>
                        Remembered your password?{' '}
                        <button
                            onClick={() => { window.location.hash = '#/login'; setForgotPasswordView(false); setSecurityQuestionDisplayed(''); setSecurityQuestionUserId(null); setSecurityAnswerInput(''); setNewPasswordReset(''); }}
                            className={`${activeTheme.loginLink} hover:underline font-bold transition duration-300`}
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            );
        } else if (view === 'todos' && isLoggedIn) {
            return (
                <div className={`${activeTheme.cardBg} p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl ${activeTheme.cardShadow} w-full max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-7xl transform transition-all duration-300`}>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-3 border-b border-gray-200">
                        <h2 className={`text-4xl font-extrabold ${activeTheme.textColor} mb-4 sm:mb-0`}>
                            Hello, {user ? user.username : 'User'}!
                        </h2>
                        <button
                            onClick={handleLogout}
                            className={`bg-gradient-to-r ${activeTheme.deleteBtn} text-white font-bold py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                        >
                            Logout
                        </button>
                    </div>
                    <p className={`text-center ${activeTheme.labelColor} text-base sm:text-lg mb-6 sm:mb-8`}>
                        Your personalized space to conquer your daily tasks. Let's get things done!
                    </p>

                    {/* Section to set security question if not already set */}
                    {user && !user.securityQuestion && (
                        <div className={`mb-6 p-6 ${activeTheme.addTodoBg} rounded-xl shadow-inner border ${activeTheme.addTodoBorder || 'border-blue-200'} space-y-4`}>
                            <h3 className={`text-3xl font-bold ${activeTheme.labelColor} mb-4`}>Set Up Security Question</h3>
                            <p className={`${activeTheme.labelColor} text-base mb-4`}>
                                To enable password reset via security questions, please set up your question and answer.
                            </p>
                            <form onSubmit={handleSetSecurityQuestion} className="space-y-4">
                                <div>
                                    <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="userSecurityQuestion">
                                        Security Question
                                    </label>
                                    <input
                                        type="text"
                                        id="userSecurityQuestion"
                                        value={userSecurityQuestion}
                                        onChange={(e) => setUserSecurityQuestion(e.target.value)}
                                        placeholder="e.g., What was your first pet's name?"
                                        className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.addTodoFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="userSecurityAnswer">
                                        Security Answer
                                    </label>
                                    <input
                                        type="password"
                                        id="userSecurityAnswer"
                                        value={userSecurityAnswer}
                                        onChange={(e) => setUserSecurityAnswer(e.target.value)}
                                        placeholder="Your answer"
                                        className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.addTodoFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full bg-gradient-to-r ${activeTheme.secondaryBtn} text-white font-bold py-3 px-6 rounded-lg hover:from-teal-700 hover:to-emerald-800 focus:outline-none focus:ring-4 ${activeTheme.secondaryFocus} focus:ring-opacity-50 transition duration-300 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                                >
                                    Set Security Question
                                </button>
                            </form>
                        </div>
                    )}


                    {/* Add New Todo Form */}
                    <form onSubmit={handleCreateTodo} className={`mb-6 p-6 ${activeTheme.addTodoBg} rounded-xl shadow-inner border ${activeTheme.addTodoBorder || 'border-blue-200'} space-y-4`}>
                        <h3 className={`text-3xl font-bold ${activeTheme.labelColor} mb-4`}>Add New To-Do</h3>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="newTodoTitle">
                                Title
                            </label>
                            <input
                                type="text"
                                id="newTodoTitle"
                                value={newTodoTitle}
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                placeholder="e.g., Plan weekend trip"
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.addTodoFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="newTodoDescription">
                                Description (Optional)
                            </label>
                            <textarea
                                id="newTodoDescription"
                                value={newTodoDescription}
                                onChange={(e) => setNewTodoDescription(e.target.value)}
                                placeholder="e.g., Research destinations, book flights, pack bags"
                                rows="3"
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.addTodoFocus} focus:border-transparent resize-y transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor} ${activeTheme.placeholderColor}`}
                            ></textarea>
                        </div>
                        <div>
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="newTodoPriority">
                                Priority
                            </label>
                            <select
                                id="newTodoPriority"
                                value={newTodoPriority}
                                onChange={(e) => setNewTodoPriority(e.target.value)}
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.addTodoFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className={`w-full bg-gradient-to-r ${activeTheme.primaryBtn} text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-4 ${activeTheme.primaryFocus} focus:ring-opacity-50 transition duration-300 text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                        >
                            Add To-Do
                        </button>
                    </form>

                    {/* Filter and Sort Controls */}
                    <div className={`mb-6 p-4 ${activeTheme.filterBg} rounded-xl shadow-inner border ${activeTheme.filterBorder} flex flex-col sm:flex-row gap-4 justify-around items-center`}>
                        <div className="w-full sm:w-1/2">
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="filterStatus">
                                Filter by Status
                            </label>
                            <select
                                id="filterStatus"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.filterFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                            >
                                <option value="all">All Statuses ({todoCounts.all})</option>
                                <option value="completed">
                                    {`Completed${todoCounts.completed > 0 ? ` (${todoCounts.completed})` : ''}`}
                                </option>
                                <option value="incomplete">
                                    {`Incomplete${todoCounts.incomplete > 0 ? ` (${todoCounts.incomplete})` : ''}`}
                                </option>
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="filterPriority">
                                Filter by Priority
                            </label>
                            <select
                                id="filterPriority"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.filterFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                            >
                                <option value="all">All Priorities ({todoCounts.all})</option>
                                <option value="High">
                                    {`High${todoCounts.High > 0 ? ` (${todoCounts.High})` : ''}`}
                                </option>
                                <option value="Medium">
                                    {`Medium${todoCounts.Medium > 0 ? ` (${todoCounts.Medium})` : ''}`}
                                </option>
                                <option value="Low">
                                    {`Low${todoCounts.Low > 0 ? ` (${todoCounts.Low})` : ''}`}
                                </option>
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className={`block ${activeTheme.labelColor} text-lg font-semibold mb-2`} htmlFor="sortOption">
                                Sort By
                            </label>
                            <select
                                id="sortOption"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className={`w-full px-5 py-3 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-4 ${activeTheme.filterFocus} focus:border-transparent transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                            >
                                <option value="createdAtDesc">Newest First</option>
                                <option value="createdAtAsc">Oldest First</option>
                                <option value="priorityDesc">Priority (High to Low)</option>
                                <option value="priorityAsc">Priority (Low to High)</option>
                                <option value="completedDesc">Status (Completed First)</option>
                                <option value="completedAsc">Status (Incomplete First)</option>
                            </select>
                        </div>
                    </div>

                    {/* To-Do List */}
                    <h3 className={`text-3xl font-bold ${activeTheme.textColor} mb-6`}>Your To-Dos</h3>
                    {todos.length === 0 ? (
                        <p className={`text-center ${activeTheme.labelColor} text-xl py-8`}>No To-Do items yet. Let's add some!</p>
                    ) : (
                        <ul className="space-y-4">
                            {todos.map((todo) => (
                                <li
                                    key={todo._id}
                                    className={`${activeTheme.todoItemBg} p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border ${activeTheme.todoItemBorder} transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                                >
                                    {editingTodo && editingTodo._id === todo._id ? (
                                        // Editing mode UI
                                        <div className="flex-grow w-full space-y-3">
                                            <input
                                                type="text"
                                                value={editingTodo.title}
                                                onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                                                className={`w-full px-4 py-2 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 ${activeTheme.primaryFocus} text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                                            />
                                            <textarea
                                                value={editingTodo.description || ''}
                                                onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                                                rows="2"
                                                className={`w-full px-4 py-2 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 ${activeTheme.primaryFocus} resize-y transition duration-300 text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                                            ></textarea>
                                            <div className="flex items-center mt-3">
                                                <input
                                                    type="checkbox"
                                                    checked={editingTodo.completed}
                                                    onChange={(e) => setEditingTodo({ ...editingTodo, completed: e.target.checked })}
                                                    className={`mr-3 h-5 w-5 text-indigo-600 border-gray-300 rounded ${activeTheme.checkboxFocus}`}
                                                />
                                                <label className={`text-base font-medium ${activeTheme.labelColor}`}>Completed</label>
                                            </div>
                                            <div>
                                                <label className={`block ${activeTheme.labelColor} text-base font-medium mb-2`} htmlFor={`editPriority-${todo._id}`}>
                                                    Priority
                                                </label>
                                                <select
                                                    id={`editPriority-${todo._id}`}
                                                    value={editingTodo.priority}
                                                    onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value })}
                                                    className={`w-full px-4 py-2 border ${activeTheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 ${activeTheme.primaryFocus} text-lg ${activeTheme.inputBg} ${activeTheme.textColor}`}
                                                >
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <button
                                                    onClick={() => requestEditSaveConfirmation(editingTodo)}
                                                    className={`bg-gradient-to-r ${activeTheme.secondaryBtn} text-white font-bold py-2 px-5 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingTodo(null)}
                                                    className={`bg-gradient-to-r ${activeTheme.grayToggleBtn} text-white font-bold py-2 px-5 rounded-lg hover:from-gray-500 hover:to-gray-700 transition duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display mode UI
                                        <div className="flex-grow">
                                            <h4 className={`text-2xl font-semibold ${todo.completed ? 'line-through text-gray-500' : activeTheme.textColor}`}>
                                                {todo.title}
                                            </h4>
                                            {todo.description && (
                                                <p className={`${activeTheme.labelColor} text-base mt-2 ${todo.completed ? 'line-through' : ''}`}>
                                                    {todo.description}
                                                </p>
                                            )}
                                            <div className="flex items-center mt-2">
                                                <span className={`${activeTheme.labelColor} text-sm font-medium mr-2`}>Priority:</span>
                                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                                                    todo.priority === 'High' ? activeTheme.priorityHigh :
                                                    todo.priority === 'Medium' ? activeTheme.priorityMedium :
                                                    activeTheme.priorityLow
                                                }`}>
                                                    {todo.priority}
                                                </span>
                                            </div>
                                            <p className={`${activeTheme.labelColor} text-sm mt-2`}>
                                                Created: {new Date(todo.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    {!editingTodo || editingTodo._id !== todo._id ? (
                                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:ml-6">
                                            <button
                                                onClick={() => setEditingTodo({ ...todo })}
                                                className={`bg-gradient-to-r ${activeTheme.editBtn} text-white font-bold py-2 px-5 rounded-lg hover:from-yellow-600 hover:to-orange-700 transition duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                                >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => requestDeleteConfirmation(todo._id)}
                                                className={`bg-gradient-to-r ${activeTheme.deleteBtn} text-white font-bold py-2 px-5 rounded-lg hover:from-red-600 hover:to-red-800 transition duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                                >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => requestStatusChangeConfirmation(todo._id, todo.completed)}
                                                className={`bg-gradient-to-r ${todo.completed ? activeTheme.grayToggleBtn : activeTheme.toggleBtn} ${activeTheme.toggleBtnTextColor} font-bold py-2 px-5 rounded-lg transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                                >
                                                {todo.completed ? 'Unmark' : 'Mark Done'}
                                            </button>
                                        </div>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${activeTheme.background} flex items-center justify-center p-4 sm:p-8 lg:p-12`}>
            {/* Global message display area */}
            {message && (
                <div
                    className={`fixed top-6 right-6 p-5 rounded-xl shadow-xl text-white z-50 transform transition-all duration-300 ${
                        messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    <p className="font-semibold text-lg">{message}</p>
                </div>
            )}

            {/* Rendered Content */}
            {renderContent()}

            {/* Theme Selector Dropdown */}
            <div className="fixed bottom-4 left-4 w-auto h-auto z-50">
                <label htmlFor="theme-select" className="sr-only">Choose Theme</label>
                <select
                    id="theme-select"
                    value={currentTheme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="p-1 text-xs sm:p-2 sm:text-sm md:p-3 md:text-base rounded-lg shadow-md bg-white text-gray-800 font-semibold border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                >
                    {Object.keys(themes).map((themeName) => (
                        <option key={themeName} value={themeName}>
                            {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme
                        </option>
                    ))}
                </select>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                message={confirmModalMessage}
                onConfirm={confirmAction}
                onCancel={cancelAction}
                isVisible={showConfirmModal}
                confirmText="Yes"
                cancelText="No"
            />
        </div>
    );
}

export default App;
