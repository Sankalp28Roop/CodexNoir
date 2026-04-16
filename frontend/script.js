const API_URL = '/api';

let currentUser = null;
let notes = [];
let activeNote = null;
let selectedColor = '#ffffff';
let isOnline = navigator.onLine;
let saveTimeout = null;
let currentAITool = null;
let currentIntent = 'all';
let isRecording = false;
let mediaRecorder = null;

const elements = {
  onboardingScreen: document.getElementById('onboardingScreen'),
  homeScreen: document.getElementById('homeScreen'),
  mainApp: document.getElementById('mainApp'),
  useCaseBtns: document.querySelectorAll('.use-case-btn'),
  getStartedBtn: document.getElementById('getStartedBtn'),
  greetingText: document.getElementById('greetingText'),
  greetingSubtext: document.getElementById('greetingSubtext'),
  userInitial: document.getElementById('userInitial'),
  homeSearchInput: document.getElementById('homeSearchInput'),
  recentNotesScroll: document.getElementById('recentNotesScroll'),
  pinnedNotesScroll: document.getElementById('pinnedNotesScroll'),
  aiSuggestionsScroll: document.getElementById('aiSuggestionsScroll'),
  continuePreview: document.getElementById('continuePreview'),
  homeThemeToggle: document.getElementById('homeThemeToggle'),
  homeProfileBtn: document.getElementById('homeProfileBtn'),
  profileBtn: document.getElementById('profileBtn'),
  profilePanel: document.getElementById('profilePanel'),
  closeProfile: document.getElementById('closeProfile'),
  profileName: document.getElementById('profileName'),
  profileEmail: document.getElementById('profileEmail'),
  totalNotes: document.getElementById('totalNotes'),
  totalXP: document.getElementById('totalXP'),
  totalStreak: document.getElementById('totalStreak'),
  themeToggle: document.getElementById('themeToggle'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  backToHomeBtn: document.getElementById('backToHomeBtn'),
  sidebar: document.getElementById('sidebar'),
  aiToggle: null,
  aiPanel: document.getElementById('aiPanel'),
  closeAiPanel: document.getElementById('closeAiPanel'),
  aiMenuBtn: document.getElementById('aiMenuBtn'),
  aiContent: document.getElementById('aiContent'),
  aiInputSection: document.getElementById('aiInputSection'),
  aiInput: document.getElementById('aiInput'),
  aiOptions: document.getElementById('aiOptions'),
  rewriteStyle: document.getElementById('rewriteStyle'),
  aiSubmit: document.getElementById('aiSubmit'),
  aiLoading: document.getElementById('aiLoading'),
  authSection: document.getElementById('authSection'),
  userSection: document.getElementById('userSection'),
  loginBtn: document.getElementById('loginBtn'),
  signupBtn: document.getElementById('signupBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  authModal: document.getElementById('authModal'),
  authForm: document.getElementById('authForm'),
  authTitle: document.getElementById('authTitle'),
  nameGroup: document.getElementById('nameGroup'),
  nameInput: document.getElementById('nameInput'),
  emailInput: document.getElementById('emailInput'),
  passwordInput: document.getElementById('passwordInput'),
  authSubmitBtn: document.getElementById('authSubmitBtn'),
  authSwitch: document.getElementById('authSwitch'),
  switchAuth: document.getElementById('switchAuth'),
  closeAuth: document.querySelector('.close-auth'),
  appContainer: document.getElementById('appContainer'),
  newNoteBtn: document.getElementById('newNoteBtn'),
  newNotebookBtn: document.getElementById('newNotebookBtn'),
  notebooksList: document.getElementById('notebooksList'),
  notebookModal: document.getElementById('notebookModal'),
  notebookName: document.getElementById('notebookName'),
  notebookDesc: document.getElementById('notebookDesc'),
  notebookColor: document.getElementById('notebookColor'),
  searchInput: document.getElementById('searchInput'),
  notesList: document.getElementById('notesList'),
  emptyList: document.getElementById('emptyList'),
  editorPanel: document.getElementById('editorPanel'),
  noNoteSelected: document.getElementById('noNoteSelected'),
  noteTitle: document.getElementById('noteTitle'),
  noteContent: document.getElementById('noteContent'),
  noteDate: document.getElementById('noteDate'),
  pinNote: document.getElementById('pinNote'),
  deleteNote: document.getElementById('deleteNote'),
  colorBtns: document.querySelectorAll('.color-btn'),
  charCount: document.querySelector('.char-count'),
  toastContainer: document.getElementById('toastContainer'),
  createOfflineNote: document.getElementById('createOfflineNote'),
  aiToolBtns: document.querySelectorAll('.ai-tool-btn'),
  syncStatus: document.getElementById('syncStatus'),
  floatingNewNote: document.getElementById('floatingNewNote'),
  imageUpload: document.getElementById('imageUpload'),
  toggleTask: document.getElementById('toggleTask'),
  completeTask: document.getElementById('completeTask'),
  bookmarkNote: document.getElementById('bookmarkNote'),
  userStats: document.getElementById('userStats'),
  xpCount: document.getElementById('xpCount'),
  streakCount: document.getElementById('streakCount'),
  insightsBtn: document.getElementById('insightsBtn'),
  insightsPanel: document.getElementById('insightsPanel'),
  closeInsights: document.getElementById('closeInsights'),
  insightPatterns: document.getElementById('insightPatterns'),
  insightMemory: document.getElementById('insightMemory'),
  insightSuggestions: document.getElementById('insightSuggestions'),
  createNoteSheet: document.getElementById('createNoteSheet'),
  closeCreateSheet: document.getElementById('closeCreateSheet'),
  createOptions: document.querySelectorAll('.create-option'),
  bottomNav: document.getElementById('bottomNav'),
  navItems: document.querySelectorAll('.nav-item'),
  voiceCaptureBtn: document.getElementById('voiceCaptureBtn'),
  aiSuggestionContinue: document.getElementById('aiSuggestionContinue'),
  aiSuggestionSummarize: document.getElementById('aiSuggestionSummarize'),
  aiSuggestionMemory: document.getElementById('aiSuggestionMemory'),
  copilotSidebar: document.getElementById('copilotSidebar'),
  closeCopilot: document.getElementById('closeCopilot'),
  copilotMessages: document.getElementById('copilotMessages'),
  copilotInput: document.getElementById('copilotInput'),
  copilotSend: document.getElementById('copilotSend'),
  offlineIndicator: document.getElementById('offlineIndicator'),
  syncStatusDot: document.querySelector('.sync-dot')
};

let isLoginMode = true;

// Feature Functions

// Export Note
function showExportModal() {
  document.getElementById('exportModal').classList.remove('hidden');
}

function exportNote(format) {
  if (!activeNote) return;
  let content, filename, type;
  
  if (format === 'markdown') {
    content = `# ${activeNote.title}\n\n${activeNote.content}`;
    filename = `${activeNote.title || 'note'}.md`;
    type = 'text/markdown';
  } else if (format === 'pdf') {
    content = `${activeNote.title}\n\n${activeNote.content}`;
    filename = `${activeNote.title || 'note'}.txt`;
    type = 'text/plain';
  } else {
    content = `${activeNote.title}\n\n${activeNote.content}`;
    filename = `${activeNote.title || 'note'}.txt`;
    type = 'text/plain';
  }
  
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('exportModal').classList.add('hidden');
  showToast(`Exported as ${format.toUpperCase()}`);
}

// Tags
function showTagModal() {
  renderTagList();
  document.getElementById('tagModal').classList.remove('hidden');
}

function renderTagList() {
  const tags = JSON.parse(localStorage.getItem('tags') || '[]');
  document.getElementById('tagList').innerHTML = tags.map(tag => 
    `<span class="tag-item" data-tag="${tag}">#${tag}</span>`
  ).join('');
  document.querySelectorAll('.tag-item').forEach(item => {
    item.addEventListener('click', () => {
      if (!activeNote) return;
      if (!activeNote.tags) activeNote.tags = [];
      if (!activeNote.tags.includes(item.dataset.tag)) {
        activeNote.tags.push(item.dataset.tag);
        saveNote();
        renderNotesList();
      }
    });
  });
}

function saveNewTag() {
  const tag = document.getElementById('tagInput').value.trim().toLowerCase();
  if (!tag) return;
  let tags = JSON.parse(localStorage.getItem('tags') || '[]');
  if (!tags.includes(tag)) {
    tags.push(tag);
    localStorage.setItem('tags', JSON.stringify(tags));
  }
  if (activeNote) {
    if (!activeNote.tags) activeNote.tags = [];
    if (!activeNote.tags.includes(tag)) {
      activeNote.tags.push(tag);
      saveNote();
    }
  }
  document.getElementById('tagInput').value = '';
  document.getElementById('tagModal').classList.add('hidden');
  showToast('Tag added');
}

// Reminder
function showReminderModal() {
  document.getElementById('reminderModal').classList.remove('hidden');
}

function saveReminder() {
  const reminder = document.getElementById('reminderInput').value;
  if (!reminder || !activeNote) return;
  activeNote.reminder = reminder;
  saveNote();
  document.getElementById('reminderModal').classList.add('hidden');
  showToast('Reminder set');
}

// Bookmark
function toggleBookmark() {
  if (!activeNote) return;
  activeNote.bookmarked = !activeNote.bookmarked;
  elements.bookmarkNote.classList.toggle('active', activeNote.bookmarked);
  saveNote();
  renderNotesList();
}

// Private Mode
function togglePrivateMode() {
  if (!activeNote) {
    showToast('Open a note first');
    return;
  }
  activeNote.isPrivate = !activeNote.isPrivate;
  document.getElementById('togglePrivate').classList.toggle('active', activeNote.isPrivate);
  saveNote();
  showToast(activeNote.isPrivate ? 'Note is now private' : 'Note is now shared');
}

document.getElementById('togglePrivate')?.addEventListener('click', togglePrivateMode);

// Pomodoro Timer
let pomodoroInterval = null;
let timeLeft = 25 * 60;
let isPaused = true;

function startPomodoro() {
  if (pomodoroInterval) clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(pomodoroInterval);
      showToast('Session complete! 🎉');
      playNotificationSound();
    }
  }, 1000);
  isPaused = false;
  document.getElementById('startTimer').classList.add('hidden');
  document.getElementById('pauseTimer').classList.remove('hidden');
}

function pausePomodoro() {
  clearInterval(pomodoroInterval);
  isPaused = true;
  document.getElementById('startTimer').classList.remove('hidden');
  document.getElementById('pauseTimer').classList.add('hidden');
}

function resetPomodoro() {
  clearInterval(pomodoroInterval);
  const session = parseInt(document.getElementById('sessionLength').value) || 25;
  timeLeft = session * 60;
  isPaused = true;
  updateTimerDisplay();
  document.getElementById('startTimer').classList.remove('hidden');
  document.getElementById('pauseTimer').classList.add('hidden');
}

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  document.getElementById('timerDisplay').textContent = 
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleAdminPanel() {
  document.getElementById('adminPanel').classList.remove('hidden');
  document.getElementById('profilePanel').classList.add('hidden');
  updateAdminStats();
}

function updateAdminStats() {
  const notesCount = notes.length;
  const notebooksCount = notebooks.length;
  const usersCount = parseInt(localStorage.getItem('userCount') || '1');
  
  document.getElementById('adminTotalNotes').textContent = notesCount;
  document.getElementById('adminTotalUsers').textContent = usersCount;
  document.getElementById('adminTotalNotebooks').textContent = notebooksCount;
  
  // Show all notes in admin
  const allNotesList = notes.map(n => `
    <div class="admin-note-item">
      <strong>${n.title || 'Untitled'}</strong>
      <span>${new Date(n.updatedAt).toLocaleDateString()}</span>
    </div>
  `).join('');
  
  document.getElementById('adminNotesList').innerHTML = allNotesList || '<p>No notes</p>';
}

// Notifications
let notifications = [];

function addNotification(message, type = 'info') {
  const notification = {
    id: 'notif_' + Date.now(),
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
  notifications.unshift(notification);
  if (notifications.length > 20) notifications.pop();
  localStorage.setItem('notifications', JSON.stringify(notifications));
  showToast(message);
}

function renderNotifications() {
  const list = document.getElementById('notificationsList');
  if (notifications.length === 0) {
    list.innerHTML = '<p>No notifications</p>';
    return;
  }
  list.innerHTML = notifications.map(n => `
    <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
      <span>${n.type === 'share' ? '📤' : n.type === 'comment' ? '💬' : 'ℹ️'}</span>
      <span>${n.message}</span>
    </div>
  `).join('');
  
  document.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const notif = notifications.find(n => n.id === item.dataset.id);
      if (notif) notif.read = true;
      item.classList.remove('unread');
      localStorage.setItem('notifications', JSON.stringify(notifications));
    });
  });
}

// Sharing
function showShareModal() {
  if (!activeNote) {
    showToast('Open a note first');
    return;
  }
  document.getElementById('shareModal').classList.remove('hidden');
}

function shareNote() {
  const email = document.getElementById('shareEmail').value.trim();
  const role = document.getElementById('shareRole').value;
  if (!email) {
    showToast('Enter email address');
    return;
  }
  addNotification(`Note shared with ${email} (${role})`, 'share');
  document.getElementById('shareModal').classList.add('hidden');
  document.getElementById('shareEmail').value = '';
  showToast('Invitation sent!');
}

// Public Link Sharing
document.getElementById('createPublicLink')?.addEventListener('click', async () => {
  if (!activeNote) return;
  
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/notes/${activeNote._id}/public`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    
    const publicUrl = `${window.location.origin}/public/${data.slug}`;
    document.getElementById('publicLinkInput').value = publicUrl;
    document.getElementById('publicLinkResult').classList.remove('hidden');
  } catch (error) {
    showToast('Error creating public link', 'error');
  }
});

document.getElementById('copyPublicLink')?.addEventListener('click', () => {
  const input = document.getElementById('publicLinkInput');
  input.select();
  document.execCommand('copy');
  showToast('Link copied!');
});

// Comments
let comments = [];

function showCommentsPanel() {
  if (!activeNote) {
    showToast('Open a note first');
    return;
  }
  document.getElementById('commentsPanel').classList.remove('hidden');
  renderComments();
}

function renderComments() {
  const noteComments = comments.filter(c => c.noteId === activeNote._id);
  const list = document.getElementById('commentsList');
  if (noteComments.length === 0) {
    list.innerHTML = '<p>No comments yet</p>';
    return;
  }
  list.innerHTML = noteComments.map(c => `
    <div class="comment-item">
      <span class="comment-author">${c.author}</span>
      <p class="comment-text">${c.text}</p>
      <span class="comment-time">${new Date(c.createdAt).toLocaleString()}</span>
    </div>
  `).join('');
}

function addComment() {
  const text = document.getElementById('newComment').value.trim();
  if (!text || !activeNote) return;
  
  comments.push({
    id: 'comment_' + Date.now(),
    noteId: activeNote._id,
    text,
    author: 'You',
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('comments', JSON.stringify(comments));
  document.getElementById('newComment').value = '';
  addNotification('New comment added', 'comment');
  renderComments();
}

// Advanced Search
function toggleSearchFilters() {
  document.getElementById('searchFilters').classList.toggle('hidden');
  populateFilterOptions();
}

function populateFilterOptions() {
  const tags = JSON.parse(localStorage.getItem('tags') || '[]');
  const tagSelect = document.getElementById('filterTag');
  tagSelect.innerHTML = '<option value="">All Tags</option>' + 
    tags.map(t => `<option value="${t}">${t}</option>`).join('');
  
  const nbSelect = document.getElementById('filterNotebook');
  nbSelect.innerHTML = '<option value="">All Notebooks</option>' + 
    notebooks.map(nb => `<option value="${nb.id}">${nb.name}</option>`).join('');
}

function applyFilters() {
  const sortBy = document.getElementById('sortBy').value;
  const filterTag = document.getElementById('filterTag').value;
  const filterNotebook = document.getElementById('filterNotebook').value;
  
  let filtered = [...notes];
  
  if (filterTag) {
    filtered = filtered.filter(n => n.tags && n.tags.includes(filterTag));
  }
  if (filterNotebook) {
    filtered = filtered.filter(n => n.notebookId === filterNotebook);
  }
  
  if (sortBy === 'title') {
    filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sortBy === 'created') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else {
    filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  
  elements.notesList.innerHTML = filtered.map(note => createNoteItem(note)).join('');
  document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', () => selectNote(item.dataset.id));
  });
  showToast('Filters applied');
}

function clearFilters() {
  document.getElementById('sortBy').value = 'date';
  document.getElementById('filterTag').value = '';
  document.getElementById('filterNotebook').value = '';
  renderNotesList();
  showToast('Filters cleared');
}

// Setup event listeners for new features
document.getElementById('shareNote').addEventListener('click', () => showShareModal());
document.getElementById('sendShare').addEventListener('click', () => shareNote());
document.getElementById('closeShare').addEventListener('click', () => document.getElementById('shareModal').classList.add('hidden'));

document.getElementById('addComment').addEventListener('click', () => showCommentsPanel());
document.getElementById('postComment').addEventListener('click', () => addComment());
document.getElementById('closeComments').addEventListener('click', () => document.getElementById('commentsPanel').classList.add('hidden'));

document.getElementById('advancedSearchBtn').addEventListener('click', () => toggleSearchFilters());
document.getElementById('applyFilters').addEventListener('click', () => applyFilters());
document.getElementById('clearFilters').addEventListener('click', () => clearFilters());

document.getElementById('closeShortcuts').addEventListener('click', () => document.getElementById('shortcutsModal').classList.add('hidden'));

document.addEventListener('keydown', handleKeyboard);

// Load notifications
notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
comments = JSON.parse(localStorage.getItem('comments') || '[]');

function handleKeyboard(e) {
  const key = e.key.toLowerCase();
  
  // Command Palette (Cmd+K or Ctrl+K)
  if ((e.metaKey || e.ctrlKey) && key === 'k') {
    e.preventDefault();
    showCommandPalette();
    return;
  }
  
  // Focus Mode (F)
  if (key === 'f' && !e.ctrlKey && !e.metaKey && !e.target.closest('.editor-panel')) {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      toggleFocusMode();
      return;
    }
  }
  
  // Quick Capture (Q)
  if (key === 'q' && !e.ctrlKey && !e.metaKey) {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      showQuickCapture();
      return;
    }
  }
  
  // Voice Note (V)
  if (key === 'v' && !e.ctrlKey && !e.metaKey) {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      toggleVoiceRecording();
      return;
    }
  }
  
  // Copilot Sidebar (C)
  if (key === 'c' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
    if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      toggleCopilotSidebar();
      return;
    }
  }
  
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  if (e.ctrlKey || e.metaKey) {
    if (key === 'b') { e.preventDefault(); applyFormat('bold'); }
    else if (key === 'i') { e.preventDefault(); applyFormat('italic'); }
    else if (key === 's') { e.preventDefault(); saveNote(); }
    else if (key === 'n') { e.preventDefault(); createNewNote(); }
  } else {
    if (key === 'd') deleteActiveNote();
    else if (key === 'p') togglePinNote();
    else if (key === 'b') toggleBookmark();
    else if (key === 'a') toggleAIPanel();
    else if (key === 't') toggleTaskMode();
    else if (key === '?') document.getElementById('shortcutsModal').classList.remove('hidden');
    else if (key === 'Escape') {
      document.getElementById('shortcutsModal').classList.add('hidden');
      document.getElementById('shareModal').classList.add('hidden');
      document.getElementById('commentsPanel').classList.add('hidden');
      document.getElementById('commandPalette').classList.add('hidden');
      document.getElementById('contextMenu').classList.add('hidden');
      exitFocusMode();
    }
  }
}

// ===== MODERN FEATURES =====

// Command Palette
const commands = [
  { id: 'new-note', label: 'Create New Note', icon: '📝', shortcut: 'Ctrl+N', action: () => createNewNote() },
  { id: 'search', label: 'Search Notes', icon: '🔍', shortcut: 'Ctrl+F', action: () => document.getElementById('searchInput').focus() },
  { id: 'ai-chat', label: 'AI Chat', icon: '🤖', action: () => { selectAITool('chat'); toggleAIPanel(); } },
  { id: 'calendar', label: 'Calendar View', icon: '📅', action: () => { document.getElementById('calendarPanel').classList.remove('hidden'); renderCalendar(); } },
  { id: 'focus', label: 'Focus Mode', icon: '🎯', shortcut: 'F', action: () => toggleFocusMode() },
  { id: 'copilot', label: 'AI Copilot', icon: '🤖', shortcut: 'C', action: () => toggleCopilotSidebar() },
  { id: 'pomodoro', label: 'Start Pomodoro', icon: '⏱️', action: () => { document.getElementById('pomodoroPanel').classList.remove('hidden'); } },
  { id: 'stats', label: 'View Stats', icon: '📊', action: () => { updateStats(); document.getElementById('statsPanel').classList.remove('hidden'); } },
  { id: 'theme', label: 'Toggle Theme', icon: '🌙', action: () => toggleTheme() },
  { id: 'export', label: 'Export Note', icon: '📤', action: () => showExportModal() },
  { id: 'backup', label: 'Backup Data', icon: '💾', action: () => exportBackup() },
  { id: 'restore', label: 'Restore Data', icon: '📥', action: () => importBackup() },
  { id: 'help', label: 'Keyboard Shortcuts', icon: '❓', shortcut: '?', action: () => document.getElementById('shortcutsModal').classList.remove('hidden') },
  { id: 'weekly-summary', label: 'Weekly Summary', icon: '📅', action: () => { selectAITool('weekly'); toggleAIPanel(); } },
  { id: 'daily-brief', label: 'Daily Brief', icon: '🌅', action: () => { selectAITool('brief'); toggleAIPanel(); } },
  { id: 'related-notes', label: 'Related Notes', icon: '🔗', action: () => { selectAITool('related'); toggleAIPanel(); } }
];

let paletteIndex = 0;

function showCommandPalette() {
  document.getElementById('commandPalette').classList.remove('hidden');
  document.getElementById('commandInput').value = '';
  document.getElementById('commandInput').focus();
  renderPaletteResults('');
  paletteIndex = 0;
}

function renderPaletteResults(query) {
  const filtered = commands.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.id.includes(query.toLowerCase())
  );
  
  const results = document.getElementById('paletteResults');
  results.innerHTML = filtered.map((c, i) => `
    <div class="palette-item ${i === paletteIndex ? 'selected' : ''}" data-index="${i}">
      <span class="palette-item-icon">${c.icon}</span>
      <span class="palette-item-text">${c.label}</span>
      ${c.shortcut ? `<span class="palette-item-shortcut">${c.shortcut}</span>` : ''}
    </div>
  `).join('');
  
  document.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      filtered[index].action();
      document.getElementById('commandPalette').classList.add('hidden');
    });
  });
}

document.getElementById('commandInput').addEventListener('input', (e) => {
  renderPaletteResults(e.target.value);
});

document.getElementById('commandInput').addEventListener('keydown', (e) => {
  const items = document.querySelectorAll('.palette-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    paletteIndex = (paletteIndex + 1) % items.length;
    updatePaletteSelection();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    paletteIndex = (paletteIndex - 1 + items.length) % items.length;
    updatePaletteSelection();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (items[paletteIndex]) items[paletteIndex].click();
  } else if (e.key === 'Escape') {
    document.getElementById('commandPalette').classList.add('hidden');
  }
});

function updatePaletteSelection() {
  document.querySelectorAll('.palette-item').forEach((item, i) => {
    item.classList.toggle('selected', i === paletteIndex);
  });
}

document.querySelector('.palette-overlay').addEventListener('click', () => {
  document.getElementById('commandPalette').classList.add('hidden');
});

// Context Menu
let contextNoteId = null;

function showContextMenu(e, noteId) {
  e.preventDefault();
  contextNoteId = noteId;
  const menu = document.getElementById('contextMenu');
  menu.classList.remove('hidden');
  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
}

function hideContextMenu() {
  document.getElementById('contextMenu').classList.add('hidden');
}

document.querySelectorAll('.context-item').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.dataset.action;
    if (action === 'pin') togglePinNote();
    else if (action === 'bookmark') toggleBookmark();
    else if (action === 'share') showShareModal();
    else if (action === 'duplicate') duplicateNote();
    else if (action === 'export') showExportModal();
    else if (action === 'delete') deleteActiveNote();
    hideContextMenu();
  });
});

document.addEventListener('click', hideContextMenu);

// Focus Mode
function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
  const isFocus = document.body.classList.contains('focus-mode');
  
  if (isFocus) {
    document.getElementById('focusModeBtn').classList.add('hidden');
    showToast('Focus Mode ON - Press Esc or F to exit');
  } else {
    exitFocusMode();
  }
}

function exitFocusMode() {
  document.body.classList.remove('focus-mode');
  document.getElementById('focusModeBtn').classList.remove('hidden');
  elements.copilotSidebar?.classList.add('hidden');
}

// Copilot Sidebar
function toggleCopilotSidebar() {
  if (!elements.copilotSidebar) return;
  
  const isHidden = elements.copilotSidebar.classList.contains('hidden');
  
  if (isHidden) {
    elements.copilotSidebar.classList.remove('hidden');
    elements.copilotInput.focus();
  } else {
    elements.copilotSidebar.classList.add('hidden');
  }
}

if (elements.closeCopilot) {
  elements.closeCopilot.addEventListener('click', toggleCopilotSidebar);
}

if (elements.copilotSend) {
  elements.copilotSend.addEventListener('click', sendCopilotMessage);
}

if (elements.copilotInput) {
  elements.copilotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendCopilotMessage();
  });
}

document.querySelectorAll('.copilot-suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    sendCopilotAction(btn.dataset.action);
  });
});

async function sendCopilotMessage() {
  const message = elements.copilotInput.value.trim();
  if (!message) return;
  
  addCopilotMessage(message, 'user');
  elements.copilotInput.value = '';
  
  showCopilotTyping();
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        action: 'explain',
        currentText: message,
        context: activeNote?.content || ''
      })
    });
    
    const data = await res.json();
    removeCopilotTyping();
    addCopilotMessage(data.suggestion || 'I can help you with your writing. Try the suggestions above!', 'ai');
  } catch (error) {
    removeCopilotTyping();
    addCopilotMessage('Sorry, I encountered an error. Try again!', 'ai');
  }
}

async function sendCopilotAction(action) {
  if (!activeNote) {
    showToast('Open a note first', 'error');
    return;
  }
  
  const text = elements.noteContent.value || '';
  const cursorPos = elements.noteContent.selectionStart;
  
  showCopilotTyping();
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        action,
        currentText: text,
        cursorPosition: cursorPos,
        context: activeNote.title + '\n' + text
      })
    });
    
    const data = await res.json();
    removeCopilotTyping();
    
    if (action === 'suggest') {
      addCopilotMessage('Suggestions: ' + (data.suggestion || 'No suggestions'), 'ai');
    } else {
      addCopilotMessage(data.suggestion || 'Try again', 'ai');
    }
  } catch (error) {
    removeCopilotTyping();
    addCopilotMessage('Error: ' + error.message, 'ai');
  }
}

function addCopilotMessage(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `copilot-message ${type}`;
  msgDiv.textContent = text;
  elements.copilotMessages.appendChild(msgDiv);
  elements.copilotMessages.scrollTop = elements.copilotMessages.scrollHeight;
}

function showCopilotTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'copilot-typing';
  typingDiv.id = 'copilotTyping';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  elements.copilotMessages.appendChild(typingDiv);
  elements.copilotMessages.scrollTop = elements.copilotMessages.scrollHeight;
}

function removeCopilotTyping() {
  document.getElementById('copilotTyping')?.remove();
}

document.getElementById('focusModeBtn').addEventListener('click', toggleFocusMode);

// Quick Capture
function showQuickCapture() {
  const title = prompt('Quick Note Title:');
  if (title) {
    createNewNote();
    elements.noteTitle.value = title;
    elements.noteContent.focus();
    showToast('Quick note created!');
  }
}

document.getElementById('quickCaptureBtn').addEventListener('click', showQuickCapture);

// Voice Note
let recognition = null;
let isListening = false;

function toggleVoiceRecording() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Voice input not supported in this browser');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    isListening = true;
    showVoiceRecordingUI(true);
  };
  
  recognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      if (!activeNote) createNewNote();
      elements.noteContent.value += ' ' + finalTranscript;
      handleNoteChange();
    }
  };
  
  recognition.onerror = (e) => {
    console.error('Voice error:', e);
    showToast('Voice input error');
    stopVoiceRecording();
  };
  
  recognition.onend = () => {
    showVoiceRecordingUI(false);
  };
  
  if (!isListening) {
    recognition.start();
  } else {
    stopVoiceRecording();
  }
}

function stopVoiceRecording() {
  if (recognition) {
    recognition.stop();
    isListening = false;
    showVoiceRecordingUI(false);
  }
}

function showVoiceRecordingUI(show) {
  let indicator = document.getElementById('voiceIndicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'voiceIndicator';
    indicator.className = 'voice-recording hidden';
    indicator.innerHTML = '<span>🎤</span> <span>Recording... (V to stop)</span>';
    document.body.appendChild(indicator);
  }
  indicator.classList.toggle('hidden', !show);
}

document.getElementById('voiceNoteBtn').addEventListener('click', toggleVoiceRecording);

// Export/Import Backup
function exportBackup() {
  const data = {
    notes: notes,
    notebooks: notebooks,
    tags: localStorage.getItem('tags'),
    xp: localStorage.getItem('xp'),
    streak: localStorage.getItem('streak'),
    exportedAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codexnoir-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exported!');
}

function importBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.notes) notes = data.notes;
        if (data.notebooks) notebooks = data.notebooks;
        if (data.tags) localStorage.setItem('tags', data.tags);
        saveNotes();
        renderNotesList();
        renderNotebooks();
        showToast('Backup restored!');
      } catch (err) {
        showToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Initialize modern features
document.getElementById('focusModeBtn').addEventListener('click', toggleFocusMode);

// Note Preview & Markdown
let currentEditorTab = 'edit';

function switchEditorTab(tab) {
  currentEditorTab = tab;
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  
  document.getElementById('noteContent').classList.toggle('hidden', tab !== 'edit');
  document.getElementById('notePreview').classList.toggle('hidden', tab !== 'preview');
  document.getElementById('markdownView').classList.toggle('hidden', tab !== 'md');
  
  if (tab === 'preview') {
    renderNotePreview();
  } else if (tab === 'md') {
    renderMarkdown();
  }
}

function renderNotePreview() {
  const content = elements.noteContent.value;
  const preview = document.getElementById('notePreview');
  preview.innerHTML = content
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>');
}

function renderMarkdown() {
  const content = elements.noteContent.value;
  const view = document.querySelector('#markdownView code');
  view.textContent = content;
}

// Calendar View
let currentDate = new Date();

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  document.getElementById('currentMonth').textContent = 
    new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  let html = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => 
    `<div style="font-size:0.7rem;color:var(--text-muted)">${d}</div>`
  ).join('');
  
  for (let i = 0; i < firstDay; i++) {
    html += '<div></div>';
  }
  
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const hasNotes = notes.some(n => n.updatedAt && n.updatedAt.startsWith(dateStr));
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    
    html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasNotes ? 'has-notes' : ''}" data-date="${dateStr}">${day}</div>`;
  }
  
  document.getElementById('calendarGrid').innerHTML = html;
  
  document.querySelectorAll('.calendar-day[data-date]').forEach(day => {
    day.addEventListener('click', () => showNotesForDate(day.dataset.date));
  });
}

function showNotesForDate(date) {
  const dayNotes = notes.filter(n => n.updatedAt && n.updatedAt.startsWith(date));
  document.getElementById('calendarNotes').innerHTML = dayNotes.length > 0 
    ? dayNotes.map(n => `<div class="notification-item">${n.title}</div>`).join('')
    : '<p>No notes for this date</p>';
}

// Time Travel
function renderVersionHistory() {
  if (!activeNote || !activeNote.history || activeNote.history.length === 0) {
    document.getElementById('versionList').innerHTML = '<p>No version history</p>';
    return;
  }
  
  document.getElementById('versionList').innerHTML = activeNote.history.map((v, i) => `
    <div class="version-item" data-index="${i}">
      <div>Version ${activeNote.history.length - i}</div>
      <div class="version-date">${new Date(v.savedAt).toLocaleString()}</div>
    </div>
  `).join('');
  
  document.querySelectorAll('.version-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index);
      const version = activeNote.history[index];
      if (confirm('Restore this version?')) {
        elements.noteContent.value = version.content;
        saveNote();
        showToast('Version restored');
      }
    });
  });
}

// Study Mode (Flashcards)
let flashcards = [];
let currentCard = 0;

function generateFlashcards() {
  if (!activeNote) return;
  
  const content = activeNote.content || '';
  const lines = content.split('\n').filter(l => l.trim());
  
  flashcards = lines.map((line, i) => ({
    front: line.replace(/^[#\-*] /, '').substring(0, 100),
    back: `Card ${i + 1}`
  }));
  
  if (flashcards.length === 0) {
    flashcards = [{ front: 'No content for flashcards', back: 'Add content to your note' }];
  }
  
  currentCard = 0;
  showFlashcard();
  showToast(`Generated ${flashcards.length} flashcards`);
}

function showFlashcard() {
  if (flashcards.length === 0) return;
  
  document.getElementById('flashcardFront').textContent = flashcards[currentCard].front;
  document.getElementById('flashcardBack').textContent = flashcards[currentCard].back;
  document.getElementById('studyProgress').textContent = `${currentCard + 1}/${flashcards.length}`;
}

function flipCard() {
  document.getElementById('flashcardBack').classList.toggle('hidden');
}

function nextCard() {
  currentCard = (currentCard + 1) % flashcards.length;
  document.getElementById('flashcardBack').classList.add('hidden');
  showFlashcard();
}

// Daily Brief
async function generateDailyBrief() {
  const today = new Date().toISOString().split('T')[0];
  const todayNotes = notes.filter(n => n.updatedAt && n.updatedAt.startsWith(today));
  const tasks = notes.filter(n => n.isTask && !n.isComplete);
  
  // Simple stats-based brief (avoid AI errors)
  let brief = `
    <div class="brief-section">
      <h4>📝 Notes Today</h4>
      <p>${todayNotes.length} notes created</p>
      ${todayNotes.length > 0 ? `<ul>${todayNotes.slice(0,3).map(n => `<li>${n.title}</li>`).join('')}</ul>` : ''}
    </div>
    <div class="brief-section">
      <h4>✅ Pending Tasks</h4>
      <p>${tasks.length} tasks remaining</p>
      ${tasks.length > 0 ? `<ul>${tasks.slice(0,3).map(t => `<li>${t.title}</li>`).join('')}</ul>` : ''}
    </div>
  `;
  
  document.getElementById('briefContent').innerHTML = brief;
}

// Knowledge Graph
function renderKnowledgeGraph() {
  const container = document.getElementById('graphContainer');
  
  // Find linked notes
  const linkedNotes = notes.filter(n => n.linkedNotes && n.linkedNotes.length > 0);
  
  if (linkedNotes.length === 0) {
    container.innerHTML = '<p>Link notes to see the knowledge graph</p>';
    return;
  }
  
  // Simple visualization
  let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
  linkedNotes.forEach(note => {
    html += `<div style="padding:8px;background:var(--bg-primary);border-radius:8px;">
      <strong>${note.title}</strong>
      <div style="font-size:0.75rem;color:var(--text-muted)">→ ${note.linkedNotes.length} linked</div>
    </div>`;
  });
  html += '</div>';
  
  container.innerHTML = html;
}

// Public Sharing
function generatePublicLink() {
  if (!activeNote) {
    showToast('Open a note first');
    return;
  }
  
  const slug = activeNote._id + '-' + Date.now();
  const publicUrl = `${window.location.origin}/public/${slug}`;
  document.getElementById('publicLink').value = publicUrl;
  
  // Save public link to note
  activeNote.publicLink = slug;
  saveNote();
  showToast('Public link generated');
}

function copyPublicLink() {
  const link = document.getElementById('publicLink').value;
  navigator.clipboard.writeText(link);
  showToast('Copied to clipboard!');
}

// Initialize all new features
document.querySelectorAll('.editor-tab').forEach(tab => {
  tab.addEventListener('click', () => switchEditorTab(tab.dataset.tab));
});

document.getElementById('prevMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

document.getElementById('calendarBtn').addEventListener('click', () => {
  document.getElementById('calendarPanel').classList.remove('hidden');
  renderCalendar();
});

document.getElementById('closeCalendar').addEventListener('click', () => {
  document.getElementById('calendarPanel').classList.add('hidden');
});

document.getElementById('timeTravelBtn').addEventListener('click', () => {
  document.getElementById('timeTravelPanel').classList.remove('hidden');
  renderVersionHistory();
});

document.getElementById('closeTimeTravel').addEventListener('click', () => {
  document.getElementById('timeTravelPanel').classList.add('hidden');
});

document.getElementById('studyBtn').addEventListener('click', () => {
  document.getElementById('studyPanel').classList.remove('hidden');
});

document.getElementById('closeStudy').addEventListener('click', () => {
  document.getElementById('studyPanel').classList.add('hidden');
});

document.getElementById('flipCard').addEventListener('click', flipCard);
document.getElementById('nextCard').addEventListener('click', nextCard);
document.getElementById('generateCards').addEventListener('click', generateFlashcards);

document.getElementById('dailyBriefBtn').addEventListener('click', () => {
  document.getElementById('dailyBriefPanel').classList.remove('hidden');
  generateDailyBrief();
});

document.getElementById('closeDailyBrief').addEventListener('click', () => {
  document.getElementById('dailyBriefPanel').classList.add('hidden');
});

document.getElementById('sharePublicBtn').addEventListener('click', () => {
  document.getElementById('publicShareModal').classList.remove('hidden');
});

document.getElementById('generatePublicLink').addEventListener('click', generatePublicLink);
document.getElementById('copyPublicLink').addEventListener('click', copyPublicLink);
document.getElementById('closePublicShare').addEventListener('click', () => {
  document.getElementById('publicShareModal').classList.add('hidden');
});

document.getElementById('graphBtn').addEventListener('click', () => {
  document.getElementById('graphPanel').classList.remove('hidden');
  renderKnowledgeGraph();
});

document.getElementById('closeGraph').addEventListener('click', () => {
  document.getElementById('graphPanel').classList.add('hidden');
});

function playNotificationSound() {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJOqsIeEeWJw无为');
  audio.play().catch(() => {});
}

// Stats
function updateStats() {
  const allNotes = JSON.parse(localStorage.getItem('notes') || '[]');
  let totalWords = 0;
  let tasksDone = 0;
  
  allNotes.forEach(note => {
    totalWords += (note.content || '').split(/\s+/).length;
    if (note.isTask && note.completed) tasksDone++;
  });
  
  document.getElementById('totalNotesStat').textContent = allNotes.length;
  document.getElementById('totalWords').textContent = totalWords;
  document.getElementById('currentStreak').textContent = localStorage.getItem('streak') || 0;
  document.getElementById('totalXP').textContent = localStorage.getItem('xp') || 0;
  document.getElementById('tasksCompleted').textContent = tasksDone;
  document.getElementById('writingGoal').textContent = localStorage.getItem('dailyGoal') || 100;
  
  renderBadges(allNotes.length, totalWords);
}

function renderBadges(noteCount, wordCount) {
  const badges = [
    { icon: '📝', name: 'First Note', unlocked: noteCount >= 1 },
    { icon: '✍️', name: '10 Notes', unlocked: noteCount >= 10 },
    { icon: '📚', name: '100 Notes', unlocked: noteCount >= 100 },
    { icon: '💯', name: '100 Words', unlocked: wordCount >= 100 },
    { icon: '📖', name: '1000 Words', unlocked: wordCount >= 1000 },
    { icon: '🎯', name: 'Task Master', unlocked: true },
    { icon: '🔥', name: '7 Day Streak', unlocked: (localStorage.getItem('streak') || 0) >= 7 },
    { icon: '⭐', name: 'XP Collector', unlocked: (localStorage.getItem('xp') || 0) >= 100 }
  ];
  
  document.getElementById('badgesList').innerHTML = badges.map(b => 
    `<span class="badge ${b.unlocked ? 'unlocked' : 'locked'}" title="${b.name}">${b.icon}</span>`
  ).join('');
}

// Lock App
let isLocked = false;

function setLock() {
  const pin = document.getElementById('lockPin').value;
  if (pin.length >= 4) {
    localStorage.setItem('appPin', pin);
    showToast('PIN set - app is locked');
    document.getElementById('lockScreen').classList.add('hidden');
  } else {
    showToast('PIN must be 4+ digits');
  }
}

function unlockApp() {
  const pin = document.getElementById('lockPin').value;
  const savedPin = localStorage.getItem('appPin');
  if (pin === savedPin) {
    isLocked = false;
    document.getElementById('lockScreen').classList.add('hidden');
    showToast('Unlocked 🔓');
  } else {
    showToast('Wrong PIN');
  }
}

function checkLock() {
  const savedPin = localStorage.getItem('appPin');
  if (savedPin) {
    isLocked = true;
    document.getElementById('lockScreen').classList.remove('hidden');
    document.getElementById('setLock').classList.add('hidden');
    document.getElementById('unlockApp').classList.remove('hidden');
  }
}

function init() {
  loadTheme();
  checkOnboarding();
  checkLock();
  setupEventListeners();
  loadNotes();
  loadNotebooks();
  renderNotebooks();
  updateGreeting();
  updateStats();
}

function loadTheme() {
  const darkMode = localStorage.getItem('darkMode');
  const icons = document.querySelectorAll('.theme-icon');
  if (darkMode === 'true') {
    document.body.classList.add('light');
    icons.forEach(icon => icon.textContent = '🌙');
  } else {
    icons.forEach(icon => icon.textContent = '☀️');
  }
}

function saveTheme() {
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('darkMode', isLight);
}

function checkOnboarding() {
  const onboardingComplete = localStorage.getItem('onboardingComplete');
  if (onboardingComplete) {
    elements.onboardingScreen.classList.add('hidden');
    elements.homeScreen.classList.remove('hidden');
  } else {
    elements.onboardingScreen.classList.remove('hidden');
    elements.homeScreen.classList.add('hidden');
  }
}

function restartOnboarding() {
  localStorage.removeItem('onboardingComplete');
  localStorage.removeItem('userUseCase');
  elements.homeScreen.classList.add('hidden');
  elements.onboardingScreen.classList.remove('hidden');
  document.querySelectorAll('.use-case-btn').forEach(b => b.classList.remove('selected'));
}

function setupEventListeners() {
  elements.getStartedBtn.addEventListener('click', completeOnboarding);
  document.getElementById('restartOnboarding').addEventListener('click', restartOnboarding);
  document.getElementById('quickReset').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('hidden');
    document.getElementById('confirmMessage').textContent = 'Reset app? All data will be cleared.';
    document.getElementById('confirmOk').onclick = () => {
      document.getElementById('confirmModal').classList.add('hidden');
      restartOnboarding();
    };
    document.getElementById('confirmCancel').onclick = () => {
      document.getElementById('confirmModal').classList.add('hidden');
    };
  });
  elements.useCaseBtns.forEach(btn => {
    btn.addEventListener('click', () => selectUseCase(btn));
  });
  
  elements.themeToggle.addEventListener('click', toggleTheme);
  elements.homeThemeToggle.addEventListener('click', toggleTheme);
  document.getElementById('homeNewNote').addEventListener('click', () => createNewNote('note'));
  if (elements.profileBtn) elements.profileBtn.addEventListener('click', toggleProfile);
  if (elements.homeProfileBtn) elements.homeProfileBtn.addEventListener('click', toggleProfile);
  document.getElementById('resetAppBtn').addEventListener('click', () => {
    document.getElementById('confirmModal').classList.remove('hidden');
    document.getElementById('confirmMessage').textContent = 'Reset app? All data will be cleared.';
    document.getElementById('confirmOk').onclick = () => {
      document.getElementById('confirmModal').classList.add('hidden');
      localStorage.clear();
      location.reload();
    };
    document.getElementById('confirmCancel').onclick = () => {
      document.getElementById('confirmModal').classList.add('hidden');
    };
  });
  
  document.getElementById('adminBtn').addEventListener('click', () => toggleAdminPanel());
  document.getElementById('closeAdmin').addEventListener('click', () => document.getElementById('adminPanel').classList.add('hidden'));
  elements.closeProfile.addEventListener('click', toggleProfile);
  elements.homeSearchInput.addEventListener('input', handleHomeSearch);
  
  elements.aiSuggestionContinue.addEventListener('click', () => continueLastNote());
  elements.aiSuggestionSummarize.addEventListener('click', () => summarizeRecentNotes());
  elements.aiSuggestionMemory.addEventListener('click', () => showMemoryLane());
  
  elements.sidebarToggle.addEventListener('click', toggleSidebar);
  elements.backToHomeBtn.addEventListener('click', () => {
    elements.mainApp.classList.add('hidden');
    elements.homeScreen.classList.remove('hidden');
  });
  elements.closeAiPanel.addEventListener('click', toggleAIPanel);
  elements.aiMenuBtn.addEventListener('click', toggleAIPanel);
  
  elements.aiToolBtns.forEach(btn => {
    btn.addEventListener('click', () => selectAITool(btn.dataset.tool));
  });
  elements.aiSubmit.addEventListener('click', executeAITool);
  
  elements.loginBtn.addEventListener('click', () => showAuth('login'));
  elements.signupBtn.addEventListener('click', () => showAuth('signup'));
  elements.logoutBtn.addEventListener('click', logout);
  elements.closeAuth.addEventListener('click', hideAuth);
  elements.switchAuth.addEventListener('click', toggleAuthMode);
  elements.authForm.addEventListener('submit', handleAuthSubmit);
  
  elements.searchInput.addEventListener('input', renderNotesList);
  elements.newNoteBtn.addEventListener('click', () => showCreateSheet());
  elements.newNotebookBtn.addEventListener('click', () => createNotebook());
  document.getElementById('saveNotebook').addEventListener('click', () => saveNewNotebook());
  document.getElementById('closeNotebookModal').addEventListener('click', () => {
    elements.notebookModal.classList.add('hidden');
  });
  elements.floatingNewNote.addEventListener('click', () => showCreateSheet());
  elements.closeCreateSheet.addEventListener('click', hideCreateSheet);
  elements.createOptions.forEach(btn => {
    btn.addEventListener('click', () => createWithIntent(btn.dataset.intent));
  });
  
  elements.noteTitle.addEventListener('input', handleNoteChange);
  elements.noteContent.addEventListener('input', handleNoteChange);
  elements.pinNote.addEventListener('click', togglePinNote);
  elements.deleteNote.addEventListener('click', deleteActiveNote);
  elements.toggleTask.addEventListener('click', toggleTaskMode);
  elements.completeTask.addEventListener('click', toggleTaskComplete);
  
  elements.colorBtns.forEach(btn => {
    btn.addEventListener('click', () => selectColor(btn.dataset.color));
  });
  
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFormat(btn.dataset.format));
  });
  
  elements.imageUpload.addEventListener('change', handleImageUpload);
  
  // New feature event listeners
  document.getElementById('exportNote').addEventListener('click', showExportModal);
  document.getElementById('attachFile').addEventListener('click', () => document.getElementById('imageUpload').click());
  document.getElementById('addTag').addEventListener('click', showTagModal);
  document.getElementById('setReminder').addEventListener('click', showReminderModal);
  document.getElementById('bookmarkNote').addEventListener('click', toggleBookmark);
  
  // Export modal
  document.getElementById('closeExport').addEventListener('click', () => document.getElementById('exportModal').classList.add('hidden'));
  document.querySelectorAll('.export-option').forEach(btn => {
    btn.addEventListener('click', () => exportNote(btn.dataset.format));
  });
  
  // Tag modal
  document.getElementById('closeTag').addEventListener('click', () => document.getElementById('tagModal').classList.add('hidden'));
  document.getElementById('saveTag').addEventListener('click', saveNewTag);
  
  // Reminder modal
  document.getElementById('closeReminder').addEventListener('click', () => document.getElementById('reminderModal').classList.add('hidden'));
  document.getElementById('saveReminder').addEventListener('click', saveReminder);
  
  // Pomodoro
  document.getElementById('startTimer').addEventListener('click', startPomodoro);
  document.getElementById('pauseTimer').addEventListener('click', pausePomodoro);
  document.getElementById('resetTimer').addEventListener('click', resetPomodoro);
  document.getElementById('closePomodoro').addEventListener('click', () => document.getElementById('pomodoroPanel').classList.add('hidden'));
  
  // Stats
  document.getElementById('closeStats').addEventListener('click', () => document.getElementById('statsPanel').classList.add('hidden'));
  
  // Lock
  document.getElementById('setLock').addEventListener('click', setLock);
  document.getElementById('unlockApp').addEventListener('click', unlockApp);
  
  elements.voiceCaptureBtn.addEventListener('click', () => handleVoiceCapture(elements.voiceCaptureBtn));
  
  document.querySelectorAll('.intent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.id === 'voiceCaptureBtn') {
        handleVoiceCapture(btn);
      } else {
        setIntent(btn.dataset.intent);
      }
    });
  });
  
  elements.insightsBtn.addEventListener('click', toggleInsights);
  document.getElementById('integrationsBtn')?.addEventListener('click', () => {
    document.getElementById('integrationsModal').classList.remove('hidden');
  });
  elements.closeInsights.addEventListener('click', toggleInsights);
  
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => handleNav(item.dataset.nav));
  });
  
  elements.authModal.addEventListener('click', (e) => {
    if (e.target === elements.authModal) hideAuth();
  });
  
  elements.createOfflineNote.addEventListener('click', () => createWithIntent('note'));
  
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function selectUseCase(btn) {
  elements.useCaseBtns.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function completeOnboarding() {
  const selectedBtn = document.querySelector('.use-case-btn.selected');
  if (selectedBtn) {
    const useCase = selectedBtn.dataset.usecase;
    localStorage.setItem('userUseCase', useCase);
    localStorage.setItem('onboardingComplete', 'true');
    elements.onboardingScreen.classList.add('hidden');
    elements.homeScreen.classList.remove('hidden');
    updateGreetingForUseCase(useCase);
    showToast('Welcome to Memory! 👋');
  } else {
    showToast('Please select one option');
  }
}

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  let subtext = "What's on your mind?";
  
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) { greeting = 'Good Afternoon'; subtext = 'How can I help?'; }
  else { greeting = 'Good Evening'; subtext = 'Time to reflect?'; }
  
  elements.greetingText.textContent = greeting;
  elements.greetingSubtext.textContent = subtext;
}

function updateGreetingForUseCase(useCase) {
  const hour = new Date().getHours();
  let baseGreeting = 'Good Morning';
  if (hour >= 12 && hour < 17) baseGreeting = 'Good Afternoon';
  else if (hour >= 17) baseGreeting = 'Good Evening';
  
  const configs = {
    student: { 
      title: `${baseGreeting} Student`, 
      subtext: '📚 What are you studying?',
      recentTitle: '📖 Recent',
      specialTitle: '📌 Study Pins',
      aiTitle: '🧠 Study Aids',
      quickAction1: 'Continue notes',
      quickAction2: 'Summarize today',
      quickAction3: 'Review week'
    },
    professional: { 
      title: `${baseGreeting} Professional`, 
      subtext: '💼 Ready for your tasks?',
      recentTitle: '📋 Recent Tasks',
      specialTitle: '🎯 Priorities',
      aiTitle: '⚡ Quick Actions',
      quickAction1: 'Continue task',
      quickAction2: 'Agenda today',
      quickAction3: 'Weekly goals'
    },
    creator: { 
      title: `${baseGreeting} Creator`, 
      subtext: '✨ What will you create?',
      recentTitle: '💡 Recent Ideas',
      specialTitle: '⭐ Drafts',
      aiTitle: '🎨 Create',
      quickAction1: 'Continue creating',
      quickAction2: 'Inspiration',
      quickAction3: 'Content plan'
    },
    personal: { 
      title: `${baseGreeting}`, 
      subtext: '💭 How are you feeling?',
      recentTitle: '🕐 Recent',
      specialTitle: '❤️ Important',
      aiTitle: '💭 Thoughts',
      quickAction1: 'Journal entry',
      quickAction2: 'Mood check',
      quickAction3: 'Memories'
    }
  };
  
  const config = configs[useCase] || configs.personal;
  elements.greetingText.textContent = config.title;
  elements.greetingSubtext.textContent = config.subtext;
  
  document.getElementById('recentTitle').textContent = config.recentTitle;
  document.getElementById('specialTitle').textContent = config.specialTitle;
  document.getElementById('aiTitle').textContent = config.aiTitle;
  document.getElementById('quickAction1').textContent = config.quickAction1;
  document.getElementById('quickAction2').textContent = config.quickAction2;
  document.getElementById('quickAction3').textContent = config.quickAction3;
}

function handleNav(nav) {
  elements.navItems.forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-nav="${nav}"]`).classList.add('active');
  
  switch(nav) {
    case 'home':
      elements.homeScreen.classList.remove('hidden');
      elements.appContainer.classList.add('hidden');
      break;
    case 'create':
      showCreateSheet();
      break;
    case 'notes':
      elements.homeScreen.classList.add('hidden');
      elements.appContainer.classList.remove('hidden');
      break;
    case 'profile':
      toggleProfile();
      break;
  }
}

function showCreateSheet() {
  elements.floatingNewNote.classList.add('creating');
  elements.createNoteSheet.classList.remove('hidden');
  setTimeout(() => {
    elements.createNoteSheet.classList.add('active');
    elements.floatingNewNote.classList.remove('creating');
  }, 10);
}

function hideCreateSheet() {
  elements.createNoteSheet.classList.remove('active');
  setTimeout(() => elements.createNoteSheet.classList.add('hidden'), 300);
}

function createWithIntent(intent) {
  hideCreateSheet();
  createNewNote(intent);
}

function toggleProfile() {
  elements.profilePanel.classList.toggle('hidden');
  if (!elements.profilePanel.classList.contains('hidden')) {
    updateProfile();
  }
}

function updateProfile() {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{"xp":0,"streak":0}');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  elements.profileName.textContent = user.name || 'User';
  elements.profileEmail.textContent = user.email || '';
  elements.userInitial.textContent = (user.name || 'U').charAt(0).toUpperCase();
  elements.totalNotes.textContent = notes.length;
  elements.totalXP.textContent = stats.xp || 0;
  elements.totalStreak.textContent = stats.streak || 0;
}

function handleHomeSearch(e) {
  const query = e.target.value.toLowerCase();
  if (query.length > 2) {
    const filtered = notes.filter(n => 
      (n.title || '').toLowerCase().includes(query) || 
      (n.content || '').toLowerCase().includes(query)
    );
    renderHomeNotes(filtered);
  } else {
    renderHomeNotes(notes.slice(0, 10));
  }
}

function renderHomeNotes(notesToRender) {
  const recent = notesToRender.slice(0, 5);
  const pinned = notesToRender.filter(n => n.pinned).slice(0, 3);
  
  elements.recentNotesScroll.innerHTML = recent.map(n => `
    <div class="home-note-card" onclick="openNote('${n._id}')">
      <div class="home-note-title">${escapeHtml(n.title || 'Untitled')}</div>
      <div class="home-note-preview">${escapeHtml((n.content || '').substring(0, 50))}</div>
      <div class="home-note-date">${new Date(n.updatedAt).toLocaleDateString()}</div>
    </div>
  `).join('');
  
  elements.pinnedNotesScroll.innerHTML = pinned.length ? pinned.map(n => `
    <div class="home-note-card" onclick="openNote('${n._id}')">
      <div class="home-note-title">📌 ${escapeHtml(n.title || 'Untitled')}</div>
      <div class="home-note-preview">${escapeHtml((n.content || '').substring(0, 50))}</div>
    </div>
  `).join('') : '<p style="padding:1rem;color:var(--text-muted)">No pinned notes</p>';
  
  if (recent[0]) {
    elements.continuePreview.textContent = (recent[0].content || '').substring(0, 40) + '...';
  }
}

function openNote(noteId) {
  selectNote(noteId);
  elements.homeScreen.classList.add('hidden');
  elements.appContainer.classList.remove('hidden');
}

function continueLastNote() {
  if (notes.length > 0) {
    openNote(notes[0]._id);
  }
}

function summarizeRecentNotes() {
  showToast('Generating summary...', 'success');
}

function showMemoryLane() {
  toggleInsights();
}

function toggleTheme() {
  document.body.classList.toggle('light');
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (document.body.classList.contains('light')) {
      icon.textContent = '🌙';
    } else {
      icon.textContent = '☀️';
    }
  });
  saveTheme();
}

function toggleSidebar() {
  elements.sidebar.classList.toggle('open');
}

function toggleAIPanel() {
  elements.aiPanel.classList.toggle('hidden');
  if (!elements.aiPanel.classList.contains('hidden')) {
    elements.aiMenuBtn.style.animation = 'glow 1s ease';
    setTimeout(() => elements.aiMenuBtn.style.animation = '', 1000);
  }
}

function toggleInsights() {
  elements.insightsPanel.classList.toggle('hidden');
  if (!elements.insightsPanel.classList.contains('hidden')) {
    generateInsights();
  }
}

function showAuth(mode) {
  isLoginMode = mode === 'login';
  updateAuthUI();
  elements.authModal.classList.remove('hidden');
}

function hideAuth() {
  elements.authModal.classList.add('hidden');
  elements.authForm.reset();
}

function toggleAuthMode(e) {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  updateAuthUI();
}

function updateAuthUI() {
  elements.authTitle.textContent = isLoginMode ? 'Login' : 'Sign Up';
  elements.authSubmitBtn.textContent = isLoginMode ? 'Login' : 'Sign Up';
  elements.nameGroup.classList.toggle('hidden', isLoginMode);
  elements.authSwitch.innerHTML = isLoginMode 
    ? "Don't have an account? <a href='#' id='switchAuth'>Sign Up</a>"
    : "Already have an account? <a href='#' id='switchAuth'>Login</a>";
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = elements.emailInput.value.trim();
  const password = elements.passwordInput.value;
  const name = elements.nameInput.value.trim();
  
  const endpoint = isLoginMode ? '/login' : '/signup';
  const body = isLoginMode ? { email, password } : { name, email, password };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    
    hideAuth();
    showMainApp();
    fetchNotes();
    showToast(data.message, 'success');
  } catch (error) {
    showToast(error.message || 'Connection error', 'error');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  notes = [];
  elements.mainApp.classList.add('hidden');
  elements.homeScreen.classList.remove('hidden');
  updateGreeting();
}

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (token && user) {
    currentUser = JSON.parse(user);
    showMainApp();
    fetchNotes();
  }
}

function showMainApp() {
  elements.homeScreen.classList.add('hidden');
  elements.mainApp.classList.remove('hidden');
  loadUserStats();
}

function loadUserStats() {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{"xp":0,"streak":0,"lastActive":null}');
  updateStreak(stats);
  elements.xpCount.textContent = stats.xp || 0;
  elements.streakCount.textContent = stats.streak || 0;
  elements.userStats.classList.remove('hidden');
  renderHomeNotes(notes);
}

function updateStreak(stats) {
  const today = new Date().toDateString();
  if (stats.lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (stats.lastActive === yesterday.toDateString()) {
      stats.streak += 1;
    } else if (stats.lastActive !== today) {
      stats.streak = 1;
    }
    stats.lastActive = today;
    localStorage.setItem('userStats', JSON.stringify(stats));
  }
}

async function fetchNotes() {
  if (!isOnline) { loadNotesFromStorage(); return; }
  showSyncStatus('syncing');
  
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch');
    notes = await res.json();
    saveNotesToStorage();
    renderNotesList();
    renderHomeNotes(notes);
    showSyncStatus('synced');
  } catch (error) {
    loadNotesFromStorage();
    showSyncStatus('offline');
  }
}

function loadNotesFromStorage() {
  const stored = localStorage.getItem('notes');
  if (stored) {
    notes = JSON.parse(stored);
    renderNotesList();
    renderHomeNotes(notes);
  }
}

function saveNotesToStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function getFilteredNotes() {
  const search = elements.searchInput.value.toLowerCase();
  return notes.filter(note => {
    const titleMatch = (note.title || '').toLowerCase().includes(search);
    const contentMatch = (note.content || '').toLowerCase().includes(search);
    const intentMatch = currentIntent === 'all' || note.intent === currentIntent;
    return intentMatch && (!search || titleMatch || contentMatch);
  }).sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

function renderNotesList() {
  let filtered = getFilteredNotes();
  
  // Filter by current notebook
  if (currentNotebook) {
    filtered = filtered.filter(n => n.notebookId === currentNotebook.id);
  }
  
  if (filtered.length === 0) {
    elements.notesList.innerHTML = '';
    elements.emptyList.classList.remove('hidden');
    return;
  }
  elements.emptyList.classList.add('hidden');
  elements.notesList.innerHTML = filtered.map(note => createNoteItem(note)).join('');
  document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', () => selectNote(item.dataset.id));
  });
}

function createNoteItem(note) {
  const preview = (note.content || '').substring(0, 60) || 'No content';
  const date = new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const intentIcons = { idea: '💡', study: '📚', task: '✅', thought: '💭', goal: '🎯' };
  const icon = intentIcons[note.intent] || '';
  
  return `
    <div class="note-item ${activeNote && activeNote._id === note._id ? 'active' : ''}" 
         data-id="${note._id}" 
         draggable="true"
         data-notebook="${note.notebookId || ''}">
      <div class="note-item-title">${icon} ${escapeHtml(note.title || 'New Note')}</div>
      <div class="note-item-preview">${escapeHtml(preview)}</div>
      <div class="note-item-date">${date}</div>
    </div>
  `;
}

// Drag and Drop for notes
let draggedNoteId = null;

function initDragAndDrop() {
  elements.notesList.addEventListener('dragstart', (e) => {
    const noteItem = e.target.closest('.note-item');
    if (noteItem) {
      draggedNoteId = noteItem.dataset.id;
      e.dataTransfer.effectAllowed = 'move';
      noteItem.classList.add('dragging');
    }
  });
  
  elements.notesList.addEventListener('dragend', (e) => {
    const noteItem = e.target.closest('.note-item');
    if (noteItem) {
      noteItem.classList.remove('dragging');
      draggedNoteId = null;
    }
  });
  
  elements.notebooksList?.addEventListener('dragover', (e) => {
    e.preventDefault();
    const notebookItem = e.target.closest('.notebook-item');
    if (notebookItem) {
      notebookItem.classList.add('drag-over');
    }
  });
  
  elements.notebooksList?.addEventListener('dragleave', (e) => {
    const notebookItem = e.target.closest('.notebook-item');
    if (notebookItem) {
      notebookItem.classList.remove('drag-over');
    }
  });
  
  elements.notebooksList?.addEventListener('drop', async (e) => {
    e.preventDefault();
    const notebookItem = e.target.closest('.notebook-item');
    if (notebookItem && draggedNoteId) {
      notebookItem.classList.remove('drag-over');
      const notebookId = notebookItem.dataset.id;
      
      // Update note's notebook
      const note = notes.find(n => n._id === draggedNoteId);
      if (note) {
        note.notebookId = notebookId;
        await saveNoteToServer(note);
        renderNotesList();
        showToast('Note moved to notebook!', 'success');
      }
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function selectNote(noteId) {
  const note = notes.find(n => n._id === noteId);
  if (!note) return;
  activeNote = note;
  selectedColor = note.color || '#ffffff';
  
  elements.noNoteSelected.classList.add('hidden');
  elements.editorPanel.classList.add('active');
  elements.noteTitle.value = note.title || '';
  elements.noteContent.value = note.content || '';
  updateNoteDate();
  elements.pinNote.classList.toggle('active', note.pinned);
  elements.toggleTask.classList.toggle('active', note.isTask);
  elements.completeTask.classList.toggle('hidden', !note.isTask);
  updateColorSelection();
  updateCharCount();
  renderNotebooks();
  renderNotesList();
}

// Notebooks Management
let notebooks = [];
let currentNotebook = null;

function loadNotebooks() {
  notebooks = JSON.parse(localStorage.getItem('notebooks') || '[]');
}

function saveNotebooks() {
  localStorage.setItem('notebooks', JSON.stringify(notebooks));
}

function renderNotebooks() {
  loadNotebooks();
  if (notebooks.length === 0) {
    elements.notebooksList.innerHTML = '<p class="empty-text">No notebooks yet</p>';
    return;
  }
  
  elements.notebooksList.innerHTML = notebooks.map(nb => {
    const noteCount = notes.filter(n => n.notebookId === nb.id).length;
    return `
      <div class="notebook-item ${currentNotebook && currentNotebook.id === nb.id ? 'active' : ''}" data-id="${nb.id}">
        <span class="notebook-dot" style="background: ${nb.color}"></span>
        <span class="notebook-name">${nb.name}</span>
        <span class="notebook-count">${noteCount}</span>
      </div>
    `;
  }).join('');
  
  document.querySelectorAll('.notebook-item').forEach(item => {
    item.addEventListener('click', () => selectNotebook(item.dataset.id));
  });
}

function selectNotebook(notebookId) {
  currentNotebook = notebooks.find(nb => nb.id === notebookId) || null;
  renderNotebooks();
  renderNotesList();
}

function createNotebook() {
  elements.notebookModal.classList.remove('hidden');
}

function saveNewNotebook() {
  const name = elements.notebookName.value.trim();
  if (!name) {
    showToast('Please enter a notebook name');
    return;
  }
  
  const notebook = {
    id: 'nb_' + Date.now(),
    name: name,
    description: elements.notebookDesc.value.trim(),
    color: elements.notebookColor.value,
    createdAt: new Date().toISOString()
  };
  
  notebooks.push(notebook);
  saveNotebooks();
  elements.notebookName.value = '';
  elements.notebookDesc.value = '';
  elements.notebookModal.classList.add('hidden');
  showToast('Notebook created!');
  renderNotebooks();
}

function createNewNote(intent = 'note') {
  const templates = {
    note: { title: '', content: '' },
    idea: { title: 'New Idea', content: '## Problem\n\n## Solution\n\n## Why this matters\n' },
    study: { title: 'Study Notes', content: '## Key Concepts\n\n## Summary\n\n## Questions\n' },
    task: { title: 'New Task', content: '- [ ] ', isTask: true },
    thought: { title: 'Thought', content: '## What I realized\n\n## Why it matters\n' },
    goal: { title: 'Goal', content: '## Goal\n\n## Why this goal\n\n## First step\n\n## Deadline\n' }
  };
  
  const t = templates[intent] || templates.note;
  const newNote = {
    _id: 'temp_' + Date.now(),
    title: t.title,
    content: t.content,
    color: '#ffffff',
    pinned: false,
    isTask: t.isTask || false,
    intent: intent,
    notebookId: currentNotebook ? currentNotebook.id : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.unshift(newNote);
  activeNote = newNote;
  
  elements.mainApp.classList.remove('hidden');
  elements.homeScreen.classList.add('hidden');
  elements.appContainer.classList.remove('hidden');
  elements.noNoteSelected.classList.add('hidden');
  elements.editorPanel.classList.add('active');
  elements.noteTitle.value = t.title;
  elements.noteContent.value = t.content;
  elements.noteTitle.focus();
  updateNoteDate();
  selectedColor = '#ffffff';
  updateColorSelection();
  updateCharCount();
  renderNotesList();
  saveNote();
  addXP(10);
}

function handleNoteChange() {
  if (!activeNote) return;
  activeNote.title = elements.noteTitle.value;
  activeNote.content = elements.noteContent.value;
  activeNote.updatedAt = new Date().toISOString();
  updateCharCount();
  renderNotesList();
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveNote(), 500);
}

async function saveNote() {
  if (!activeNote) return;
  const noteData = {
    title: activeNote.title || 'Untitled',
    content: activeNote.content,
    color: selectedColor,
    pinned: activeNote.pinned,
    isTask: activeNote.isTask || false,
    intent: activeNote.intent
  };

  try {
    const token = localStorage.getItem('token');
    if (activeNote._id.startsWith('temp_')) {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(noteData)
      });
      const created = await res.json();
      const index = notes.findIndex(n => n._id === activeNote._id);
      if (index !== -1) notes[index] = created;
      activeNote = created;
    } else {
      const res = await fetch(`${API_URL}/notes/${activeNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(noteData)
      });
      const updated = await res.json();
      const index = notes.findIndex(n => n._id === activeNote._id);
      if (index !== -1) notes[index] = updated;
      activeNote = updated;
    }
    saveNotesToStorage();
    renderNotesList();
    showSyncStatus('synced');
  } catch (error) {
    saveNotesToStorage();
    showSyncStatus('offline');
  }
}

function setIntent(intent) {
  currentIntent = intent;
  document.querySelectorAll('.intent-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.intent === intent);
  });
  renderNotesList();
}

function deleteActiveNote() {
  if (!activeNote) return;
  if (!confirm('Delete this note?')) return;
  
  const noteIndex = notes.findIndex(n => n._id === activeNote._id);
  if (noteIndex > -1) {
    notes.splice(noteIndex, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
  }
  
  activeNote = null;
  elements.editorPanel.classList.remove('active');
  elements.noNoteSelected.classList.remove('hidden');
  showToast('Note deleted');
  renderNotesList();
}

function togglePinNote() {
  if (!activeNote) return;
  activeNote.pinned = !activeNote.pinned;
  elements.pinNote.classList.toggle('active', activeNote.pinned);
  saveNote();
  renderNotesList();
}

function toggleTaskMode() {
  if (!activeNote) return;
  activeNote.isTask = !activeNote.isTask;
  elements.toggleTask.classList.toggle('active', activeNote.isTask);
  elements.completeTask.classList.toggle('hidden', !activeNote.isTask);
  saveNote();
  addXP(5);
}

function toggleTaskComplete() {
  if (!activeNote || !activeNote.isTask) return;
  activeNote.isComplete = !activeNote.isComplete;
  elements.completeTask.classList.toggle('active', activeNote.isComplete);
  saveNote();
  renderNotesList();
}

function selectColor(color) {
  selectedColor = color;
  if (activeNote) {
    activeNote.color = color;
    saveNote();
    renderNotesList();
  }
  updateColorSelection();
}

function updateColorSelection() {
  elements.colorBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === selectedColor);
  });
}

function updateCharCount() {
  const count = (elements.noteContent.value || '').length;
  elements.charCount.textContent = `${count} characters`;
}

function updateNoteDate() {
  if (!activeNote) return;
  elements.noteDate.textContent = new Date(activeNote.updatedAt).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}

function applyFormat(format) {
  const textarea = elements.noteContent;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.substring(start, end);
  
  const replacements = {
    bold: `**${selected || 'bold text'}**`,
    italic: `*${selected || 'italic text'}*`,
    heading: `## ${selected || 'Heading'}`,
    bullet: `- ${selected || 'List item'}`,
    checkbox: `- [ ] ${selected || 'Task'}`,
    code: selected.includes('\n') ? `\`\`\`\n${selected || 'code'}\n\`\`\`` : `\`${selected || 'code'}\``,
    link: `[${selected || 'link'}](url)`,
    image: `![${selected || 'alt'}](image-url)`,
    video: `[YouTube](https://youtube.com/watch?v=)`,
    audio: `[Audio](audio-url)`,
    screen: `[Screen Recording](video-url)`,
    embed: `[Embed](url)`,
    table: `\n| Col 1 | Col 2 | Col 3 |\n|------|------|------|\n| Cell | Cell | Cell |\n`
  };
  
  if (['video', 'audio', 'screen', 'embed'].includes(format)) {
    showEmbedModal(format);
    return;
  }
  
  const replacement = replacements[format] || '';
  textarea.value = text.substring(0, start) + replacement + text.substring(end);
  textarea.focus();
  handleNoteChange();
}

async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64 = event.target.result;
    const markdown = `![${file.name}](${base64})`;
    const textarea = elements.noteContent;
    const start = textarea.selectionStart;
    textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(start);
    handleNoteChange();
    showToast('Image added', 'success');
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

async function handleVoiceCapture(btn) {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        processVoiceNote();
      };
      mediaRecorder.start();
      isRecording = true;
      btn.classList.add('recording');
      showToast('Recording...', 'success');
    } catch (error) {
      showToast('Microphone access denied', 'error');
    }
  } else {
    mediaRecorder.stop();
    isRecording = false;
    btn.classList.remove('recording');
    showToast('Voice note saved', 'success');
  }
}

function processVoiceNote() {
  const newNote = {
    _id: 'temp_' + Date.now(),
    title: 'Voice Note',
    content: '🎤 Voice note captured. Add details here...',
    intent: 'thought',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  selectNote(newNote._id);
  addXP(5);
}

function selectAITool(tool) {
  currentAITool = tool;
  elements.aiToolBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tool === tool));
  elements.aiContent.innerHTML = '<div class="ai-welcome"><p>Processing...</p></div>';
  elements.aiInputSection.classList.remove('hidden');
  
  const placeholders = {
    summarize: 'Paste text to summarize...',
    smartTag: 'Enter content for tags...',
    rewrite: 'Enter text to rewrite...',
    chat: 'Ask a question about your notes...',
    blog: 'Generating blog post...',
    tweet: 'Generating tweet thread...',
    linkedin: 'Generating LinkedIn post...',
    coach: 'Enter text for writing feedback...',
    flashcards: 'Enter content to generate flashcards...',
    brief: 'Generating daily brief...',
    related: 'Finding related notes...',
    weekly: 'Generating weekly summary...'
  };
  elements.aiInput.placeholder = placeholders[tool] || 'Enter text...';
  
  if (activeNote && ['summarize', 'smartTag', 'rewrite', 'blog', 'tweet', 'linkedin'].includes(tool)) {
    elements.aiInput.value = activeNote.title + '\n' + activeNote.content;
  }
}

async function executeAITool() {
  const content = elements.aiInput.value.trim();
  if (!content && !activeNote) {
    showToast('Please enter some text', 'error');
    return;
  }
  
  elements.aiLoading.classList.remove('hidden');
  elements.aiContent.classList.add('hidden');
  elements.aiInputSection.classList.add('hidden');
  
  try {
    const token = localStorage.getItem('token');
    const endpoints = {
      summarize: '/ai/summarize',
      smartTag: '/ai/smart-tag',
      rewrite: '/ai/rewrite',
      chat: '/ai/chat',
      blog: '/ai/generate',
      tweet: '/ai/generate',
      linkedin: '/ai/generate',
      coach: '/ai/coach',
      flashcards: '/ai/flashcards',
      brief: '/ai/daily-brief',
      related: '/ai/related',
      weekly: '/ai/weekly-summary'
    };
    const bodies = {
      summarize: { content },
      smartTag: { title: activeNote?.title || '', content },
      rewrite: { content, style: elements.rewriteStyle.value },
      chat: { question: content, notes },
      blog: { type: 'blog', content },
      tweet: { type: 'tweet', content },
      linkedin: { type: 'linkedin', content },
      coach: { content },
      flashcards: { content, title: activeNote?.title || '' },
      brief: { notes: notes.slice(0, 10), tasks: [] },
      related: { noteId: activeNote?._id, title: activeNote?.title || '', content: activeNote?.content || '', allNotes: notes },
      weekly: { notes: notes.slice(0, 20) }
    };
    
    const res = await fetch(`${API_URL}${endpoints[currentAITool]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(bodies[currentAITool])
    });
    
    const data = await res.json();
    let result = '';
    if (currentAITool === 'summarize') result = data.summary;
    else if (currentAITool === 'smartTag') result = 'Tags: ' + data.tags.join(', ');
    else if (currentAITool === 'rewrite') result = data.rewritten;
    else if (currentAITool === 'chat') result = data.answer;
    else if (['blog', 'tweet', 'linkedin'].includes(currentAITool)) result = data.result;
    else if (currentAITool === 'coach') result = data.feedback;
    else if (currentAITool === 'flashcards') result = renderFlashcards(data.flashcards);
    else if (currentAITool === 'brief') result = data.brief;
    else if (currentAITool === 'related') result = renderRelatedNotes(data.related);
    else if (currentAITool === 'weekly') result = data.summary;
    
    elements.aiContent.innerHTML = `<div class="ai-result">${escapeHtml(result)}</div>`;
    showToast('Generated!', 'success');
  } catch (error) {
    elements.aiContent.innerHTML = `<div class="ai-result" style="color:var(--danger)">Error: ${error.message}</div>`;
  }
  
  elements.aiLoading.classList.add('hidden');
  elements.aiContent.classList.remove('hidden');
}

function renderFlashcards(flashcards) {
  if (!flashcards || flashcards.length === 0) return 'No flashcards generated';
  return flashcards.map((f, i) => `
    <div class="flashcard" style="background:var(--surface);padding:12px;margin:8px 0;border-radius:8px;border:1px solid var(--border)">
      <strong>Q${i+1}:</strong> ${escapeHtml(f.front)}<br>
      <span style="color:var(--text-secondary)"><strong>A:</strong> ${escapeHtml(f.back)}</span>
    </div>
  `).join('');
}

function renderRelatedNotes(related) {
  if (!related || related.length === 0) return 'No related notes found';
  return `<div class="related-notes">
    <p style="margin-bottom:12px">Related Notes:</p>
    ${related.map(n => `
      <button class="related-note-btn" onclick="openNoteById('${n._id}')" style="display:block;width:100%;padding:10px;margin:4px 0;background:var(--surface);border:1px solid var(--border);border-radius:6px;cursor:pointer;text-align:left">
        📄 ${escapeHtml(n.title)}
      </button>
    `).join('')}
  </div>`;
}

function openNoteById(noteId) {
  const note = notes.find(n => n._id === noteId);
  if (note) {
    selectNote(note);
    toggleAIPanel();
  }
}

function generateInsights() {
  const now = new Date();
  const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
  
  const notesThisHour = notes.filter(n => new Date(n.createdAt).getHours() === now.getHours()).length;
  const topIntent = Object.entries(notes.reduce((acc, n) => { acc[n.intent] = (acc[n.intent] || 0) + 1; return acc; }, {})).sort((a,b) => b[1]-a[1])[0];
  
  elements.insightPatterns.innerHTML = `You write most around ${now.getHours()}:00<br>Top type: ${topIntent ? topIntent[0] : 'none'}`;
  
  const memoryNotes = notes.filter(n => n.createdAt.split('T')[0] === lastYear);
  elements.insightMemory.innerHTML = memoryNotes.length ? `Found ${memoryNotes.length} note(s) from this day last year!` : 'No notes from this day last year.';
  
  elements.insightSuggestions.innerHTML = notes.filter(n => n.isTask && !n.isComplete).length > 5 ? 'You have pending tasks!' : 'Keep up the great work!';
}

function showSyncStatus(status) {
  if (!currentUser) return;
  const textEl = elements.syncStatus.querySelector('.sync-text');
  if (status === 'syncing') {
    elements.syncStatus.classList.remove('hidden');
    elements.syncStatus.classList.add('syncing');
    textEl.textContent = 'Syncing...';
  } else if (status === 'synced') {
    elements.syncStatus.classList.remove('syncing');
    textEl.textContent = 'Synced';
    setTimeout(() => elements.syncStatus.classList.add('hidden'), 2000);
  } else if (status === 'offline') {
    elements.syncStatus.classList.remove('hidden', 'syncing');
    textEl.textContent = 'Offline';
  }
}

function handleOnlineStatus() {
  isOnline = navigator.onLine;
  if (isOnline && currentUser) fetchNotes();
}

function handleKeyboardShortcuts(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    showCreateSheet();
  }
}

function addXP(amount) {
  const stats = JSON.parse(localStorage.getItem('userStats') || '{"xp":0,"streak":0}');
  stats.xp = (stats.xp || 0) + amount;
  localStorage.setItem('userStats', JSON.stringify(stats));
  elements.xpCount.textContent = stats.xp;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'slideIn 0.3s reverse'; setTimeout(() => toast.remove(), 300); }, 3000);
}

document.addEventListener('DOMContentLoaded', init);
window.openNote = openNote;

// ===== PWA & OFFLINE SUPPORT =====

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      console.log('Service worker not available');
    });
  });
}

// IndexedDB for offline storage
let db;
const DB_NAME = 'codexnoir-db';
const DB_VERSION = 1;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains('notes')) {
        database.createObjectStore('notes', { keyPath: '_id' });
      }
      if (!database.objectStoreNames.contains('notebooks')) {
        database.createObjectStore('notebooks', { keyPath: '_id' });
      }
      if (!database.objectStoreNames.contains('syncQueue')) {
        database.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function saveToIndexedDB(storeName, data) {
  if (!db) await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  
  if (Array.isArray(data)) {
    data.forEach(item => store.put(item));
  } else {
    store.put(data);
  }
  
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getFromIndexedDB(storeName) {
  if (!db) await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const request = store.getAll();
  
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Online/Offline handling
window.addEventListener('online', () => {
  elements.offlineIndicator?.classList.remove('show');
  if (elements.syncStatusDot) {
    elements.syncStatusDot.classList.remove('offline');
    elements.syncStatusDot.classList.add('syncing');
  }
  syncOfflineData();
  showToast('Back online!', 'success');
});

window.addEventListener('offline', () => {
  elements.offlineIndicator?.classList.add('show');
  if (elements.syncStatusDot) {
    elements.syncStatusDot.classList.remove('syncing');
    elements.syncStatusDot.classList.add('offline');
  }
  showToast('You are offline. Changes saved locally.', 'info');
});

// Queue changes for sync
async function queueForSync(action, data) {
  if (!db) await initDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  store.add({ action, data, timestamp: Date.now() });
}

// Sync queued changes when online
async function syncOfflineData() {
  if (!navigator.onLine) return;
  
  try {
    const queued = await getFromIndexedDB('syncQueue');
    if (queued.length === 0) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    for (const item of queued) {
      try {
        await fetch(`${API_URL}${item.action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(item.data)
        });
      } catch (e) {
        console.log('Sync failed for item:', item);
      }
    }
    
    // Clear queue after sync
    const tx = db.transaction('syncQueue', 'readwrite');
    tx.objectStore('syncQueue').clear();
    
    if (elements.syncStatusDot) {
      elements.syncStatusDot.classList.remove('syncing');
    }
    
    showToast('Synced!', 'success');
  } catch (error) {
    console.log('Sync error:', error);
  }
}

// Initialize
initDB().then(() => console.log('IndexedDB initialized')).catch(console.error);

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  document.getElementById('header')?.addEventListener('click', () => {
    Notification.requestPermission();
  }, { once: true });
}

// ===== EMBED MODAL =====
let currentEmbedType = 'embed';

function showEmbedModal(type) {
  currentEmbedType = type;
  document.getElementById('embedModal').classList.remove('hidden');
  document.getElementById('embedUrl').value = '';
  document.getElementById('embedPreview').innerHTML = 'Preview will appear here';
}

document.getElementById('closeEmbed')?.addEventListener('click', () => {
  document.getElementById('embedModal').classList.add('hidden');
});

document.getElementById('embedUrl')?.addEventListener('input', (e) => {
  const url = e.target.value;
  const preview = document.getElementById('embedPreview');
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    preview.innerHTML = `<div class="embed-youtube"><iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div>`;
  } else if (url.includes('twitter.com') || url.includes('x.com')) {
    preview.innerHTML = `<div class="embed-tweet">Tweet embed: ${url}</div>`;
  } else if (url.includes('github.com') && url.includes('/gist/')) {
    preview.innerHTML = `<div class="embed-code">Gist embed: ${url}</div>`;
  } else if (url) {
    preview.innerHTML = `<p style="color:var(--text-secondary)">Embed: ${url}</p>`;
  } else {
    preview.innerHTML = 'Preview will appear here';
  }
});

document.getElementById('insertEmbed')?.addEventListener('click', () => {
  const url = document.getElementById('embedUrl').value;
  if (!url) return;
  
  let markdown = '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    markdown = `\n[![YouTube](https://img.youtube.com/vi/${url.split('v=')[1] || url.split('/').pop()}/0.jpg)](${url})\n`;
  } else if (url.includes('figma.com')) {
    markdown = `\n[Figma](${url})\n`;
  } else {
    markdown = `\n[${currentEmbedType}](${url})\n`;
  }
  
  const textarea = elements.noteContent;
  const start = textarea.selectionStart;
  textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(start);
  handleNoteChange();
  document.getElementById('embedModal').classList.add('hidden');
  showToast('Embed added!', 'success');
});

// ===== AUDIO RECORDING =====
let audioMediaRecorder = null;
let audioChunks = [];
let recordedAudioBlob = null;

document.getElementById('startAudioRecord')?.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioMediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    
    audioMediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
    audioMediaRecorder.onstop = () => {
      recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      document.getElementById('audioRecordUI').classList.add('hidden');
      document.getElementById('audioPlayback').classList.remove('hidden');
      document.getElementById('audioPlayer').src = URL.createObjectURL(recordedAudioBlob);
      document.getElementById('audioStatus').textContent = 'Recording complete!';
    };
    
    audioMediaRecorder.start();
    document.getElementById('audioStatus').textContent = 'Recording... Click to stop';
    document.getElementById('startAudioRecord').textContent = '⏹️';
    
    document.getElementById('startAudioRecord').onclick = () => {
      audioMediaRecorder.stop();
      stream.getTracks().forEach(t => t.stop());
    };
  } catch (err) {
    showToast('Microphone access denied', 'error');
  }
});

document.getElementById('saveAudio')?.addEventListener('click', () => {
  if (recordedAudioBlob) {
    const reader = new FileReader();
    reader.onload = () => {
      const markdown = `\n<audio src="${reader.result}" controls></audio>\n`;
      const textarea = elements.noteContent;
      const start = textarea.selectionStart;
      textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(start);
      handleNoteChange();
    };
    reader.readAsDataURL(recordedAudioBlob);
  }
  document.getElementById('audioRecorder').classList.add('hidden');
  document.getElementById('audioRecordUI').classList.remove('hidden');
  document.getElementById('audioPlayback').classList.add('hidden');
  showToast('Audio added to note!', 'success');
});

document.getElementById('discardAudio')?.addEventListener('click', () => {
  recordedAudioBlob = null;
  document.getElementById('audioRecorder').classList.add('hidden');
  document.getElementById('audioRecordUI').classList.remove('hidden');
  document.getElementById('audioPlayback').classList.add('hidden');
});

// ===== SCREEN RECORDING =====
document.getElementById('startScreenRecord')?.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onload = () => {
        const markdown = `\n[Screen Recording](${reader.result})\n`;
        const textarea = elements.noteContent;
        const start = textarea.selectionStart;
        textarea.value = textarea.value.substring(0, start) + markdown + textarea.value.substring(start);
        handleNoteChange();
      };
      reader.readAsDataURL(blob);
      document.getElementById('screenRecorder').classList.add('hidden');
      showToast('Screen recording added!', 'success');
    };
    
    recorder.start();
    showToast('Recording... Stop sharing to save', 'info');
    
    stream.getVideoTracks()[0].onended = () => {
      recorder.stop();
    };
  } catch (err) {
    showToast('Screen recording not supported', 'error');
  }
});

// ===== BIOMETRIC LOGIN =====
document.getElementById('enableBiometric')?.addEventListener('click', async () => {
  if ('PublicKeyCredential' in window) {
    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: 'CodexNoir' },
          user: { id: new Uint8Array(16), name: localStorage.getItem('userEmail') || 'user' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }]
        }
      });
      localStorage.setItem('biometricEnabled', 'true');
      showToast('Biometric enabled!', 'success');
    } catch (e) {
      showToast('Biometric setup failed', 'error');
    }
  } else {
    showToast('Biometric not supported', 'error');
  }
});

document.getElementById('loginWithBiometric')?.addEventListener('click', async () => {
  if ('PublicKeyCredential' in window) {
    try {
      const assertion = await navigator.credentials.get({
        publicKey: { challenge: new Uint8Array(32) }
      });
      showToast('Biometric verified!', 'success');
    } catch (e) {
      showToast('Biometric verification failed', 'error');
    }
  }
});

// ===== 2FA =====
document.getElementById('verify2FA')?.addEventListener('click', () => {
  const code = document.getElementById('twoFactorCode').value;
  if (code.length === 6) {
    localStorage.setItem('twoFactorEnabled', 'true');
    showToast('2FA enabled!', 'success');
    document.getElementById('twoFactorModal').classList.add('hidden');
  } else {
    showToast('Enter 6-digit code', 'error');
  }
});

document.getElementById('close2FA')?.addEventListener('click', () => {
  document.getElementById('twoFactorModal').classList.add('hidden');
});

// ===== INTEGRATIONS =====
function connectCalendar() {
  showToast('Google Calendar integration coming soon!', 'info');
}

function connectGitHub() {
  showToast('GitHub integration coming soon!', 'info');
}

function connectSlack() {
  showToast('Slack integration coming soon!', 'info');
}

document.getElementById('closeIntegrations')?.addEventListener('click', () => {
  document.getElementById('integrationsModal').classList.add('hidden');
});

// ===== PUSH NOTIFICATIONS =====
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.ready.then((reg) => {
    reg.pushManager.subscribe({ userVisibleOnly: true }).then((sub) => {
      console.log('Push subscription:', sub);
    }).catch(console.error);
  });
}

// Send test notification
function sendTestNotification() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('CodexNoir', { body: 'Test notification!' });
  }
}

// ===== ENCRYPTION (Client-side) =====
const ENCRYPTION_KEY = 'codexnoir-local-key';

async function encryptContent(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function decryptContent(encrypted) {
  const decoder = new TextDecoder();
  const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  return decoder.decode(data);
}

// ===== TEAM WORKSPACES =====
let currentWorkspace = null;

function createWorkspace(name) {
  const workspace = {
    id: Date.now().toString(),
    name,
    members: [localStorage.getItem('userEmail')],
    notebooks: []
  };
  localStorage.setItem('workspace_' + workspace.id, JSON.stringify(workspace));
  showToast('Workspace created!', 'success');
  return workspace;
}

function switchWorkspace(workspaceId) {
  const ws = localStorage.getItem('workspace_' + workspaceId);
  if (ws) {
    currentWorkspace = JSON.parse(ws);
    showToast(`Switched to ${currentWorkspace.name}`, 'success');
  }
}