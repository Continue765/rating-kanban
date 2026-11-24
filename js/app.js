import { boardConfig } from './config.js?v=2026-pool';
import { createColumn } from './components.js?v=badge-images';
import { players } from './db.js?v=2026-pool';

const currentCodeforcesHandles = {
  riobluss: 'Zihim',
  bjgf: 'Hone7'
};

document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const searchInput = document.getElementById('search-input');
  
  // Render Board
  function renderBoard() {
    board.innerHTML = '';
    boardConfig.forEach(columnConfig => {
      board.appendChild(createColumn(columnConfig));
    });
  }

  // Fetch and Sort Ratings
  async function fetchAndSortRatings() {
    const handles = [];
    const playerMap = new Map();

    // Collect all handles
    Object.values(players).forEach(player => {
      if (player.codeforces && player.codeforces.handle) {
        const storedHandle = player.codeforces.handle;
        const handle = Object.hasOwn(currentCodeforcesHandles, storedHandle.toLowerCase())
          ? currentCodeforcesHandles[storedHandle.toLowerCase()]
          : storedHandle;
        handles.push(handle);
        playerMap.set(handle.toLowerCase(), player);
      }
    });

    if (handles.length === 0) {
      renderBoard();
      return;
    }

    try {
      // Batch request (CF API allows multiple handles separated by semicolon)
      const response = await fetch(`https://codeforces.com/api/user.info?handles=${handles.join(';')}`);
      const data = await response.json();

      if (data.status === 'OK') {
        data.result.forEach(userInfo => {
          const player = playerMap.get(userInfo.handle.toLowerCase());
          if (player) {
            player.rating = userInfo.rating || 0;
          }
        });

        // Sort Board Config
        boardConfig.forEach(column => {
          // Sort Groups (Teams)
          if (column.groups) {
            column.groups.forEach(group => {
              group.members.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            });
          }
          // Sort Direct Members (Pool)
          if (column.members) {
            column.members.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          }
        });

        console.log('Board sorted by rating');
      }
    } catch (error) {
      console.error('Failed to fetch CF ratings:', error);
    }

    // Re-render after sort (or initial render if fetch fails)
    renderBoard();
  }
  
  // Initial render with sorting
  fetchAndSortRatings();
  
  // Search Functionality
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.player-card');
    
    cards.forEach(card => {
      const name = card.dataset.name;
      const id = card.dataset.id;
      
      if (name.includes(term) || id.includes(term)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
