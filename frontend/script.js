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
  aiSuggestionMemory: document.getElementById('aiSuggestionMemory')
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
    <div class="note-item ${activeNote && activeNote._id === note._id ? 'active' : ''}" data-id="${note._id}">
      <div class="note-item-title">${icon} ${escapeHtml(note.title || 'New Note')}</div>
      <div class="note-item-preview">${escapeHtml(preview)}</div>
      <div class="note-item-date">${date}</div>
    </div>
  `;
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
    table: `\n| Col 1 | Col 2 | Col 3 |\n|------|------|------|\n| Cell | Cell | Cell |\n`
  };
  
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
    linkedin: 'Generating LinkedIn post...'
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
      linkedin: '/ai/generate'
    };
    const bodies = {
      summarize: { content },
      smartTag: { title: activeNote?.title || '', content },
      rewrite: { content, style: elements.rewriteStyle.value },
      chat: { question: content, notes },
      blog: { type: 'blog', content },
      tweet: { type: 'tweet', content },
      linkedin: { type: 'linkedin', content }
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
    
    elements.aiContent.innerHTML = `<div class="ai-result">${escapeHtml(result)}</div>`;
    showToast('Generated!', 'success');
  } catch (error) {
    elements.aiContent.innerHTML = `<div class="ai-result" style="color:var(--danger)">Error: ${error.message}</div>`;
  }
  
  elements.aiLoading.classList.add('hidden');
  elements.aiContent.classList.remove('hidden');
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