const codeforcesRankColors = {
  newbie: '#666',
  pupil: '#008000',
  specialist: '#087762',
  expert: '#0000ff',
  'candidate master': '#a000a0',
  master: '#9a4d00',
  'international master': '#9a4d00',
  grandmaster: '#b01427',
  'international grandmaster': '#b01427',
  'legendary grandmaster': '#b01427'
};

function createCodeforcesBadge(player) {
  const { handle, displayHandle, url, rank } = player.codeforces;
  const link = document.createElement('a');
  link.className = 'badge-link cf-badge';
  link.href = url;
  link.target = '_blank';

  const label = document.createElement('span');
  label.textContent = `CF ${displayHandle ?? handle}`;
  const value = document.createElement('span');
  const rankLabel = rank ?? 'N/A';
  value.textContent = Number.isFinite(player.rating) ? `${rankLabel} ${player.rating}` : rankLabel;
  value.style.backgroundColor = codeforcesRankColors[rank] ?? '#666';
  link.setAttribute('aria-label', `CF Rating: ${displayHandle ?? handle}, ${value.textContent}`);
  link.append(label, value);
  return link;
}

export function createCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card';
  // Store data for search
  card.dataset.name = player.name.toLowerCase();
  card.dataset.id = player.id.toLowerCase();
  
  // AtCoder Badge
  const acBadge = player.atcoder.badge ? 
    `<a href="${player.atcoder.url}" target="_blank" class="badge-link">
       <img src="${player.atcoder.badge}" alt="AC Rating" loading="lazy">
     </a>` : '';

  card.innerHTML = `
    <div class="card-header">
      <h3 class="player-name">${player.name}</h3>
    </div>
    <div class="card-badges">
      ${acBadge}
    </div>
  `;

  if (player.codeforces.handle && player.codeforces.url) {
    card.querySelector('.card-badges').prepend(createCodeforcesBadge(player));
  }
  
  return card;
}

export function createTeamGroup(group) {
  const groupEl = document.createElement('div');
  groupEl.className = 'team-group';
  
  const title = document.createElement('h4');
  title.className = 'group-title';
  title.textContent = group.name;
  groupEl.appendChild(title);
  
  const membersContainer = document.createElement('div');
  membersContainer.className = 'group-members';
  
  group.members.forEach(player => {
    if (player) {
      membersContainer.appendChild(createCard(player));
    }
  });
  
  groupEl.appendChild(membersContainer);
  return groupEl;
}

export function createColumn(config) {
  const column = document.createElement('div');
  column.className = 'kanban-column';
  
  const header = document.createElement('div');
  header.className = 'column-header';
  header.innerHTML = `<h2>${config.title}</h2>`;
  column.appendChild(header);
  
  const content = document.createElement('div');
  content.className = 'column-content';
  
  if (config.groups) {
    // Render groups (Teams)
    config.groups.forEach(group => {
      content.appendChild(createTeamGroup(group));
    });
  } else if (config.members) {
    // Render flat list (Pool)
    const grid = document.createElement('div');
    grid.className = config.type === 'grid' ? 'player-grid' : 'player-list';
    
    config.members.forEach(player => {
      if (player) {
        grid.appendChild(createCard(player));
      }
    });
    content.appendChild(grid);
  }
  
  column.appendChild(content);
  return column;
}
