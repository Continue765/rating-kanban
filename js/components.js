export function createCard(player) {
  const card = document.createElement('div');
  card.className = 'player-card';
  // Store data for search
  card.dataset.name = player.name.toLowerCase();
  card.dataset.id = player.id.toLowerCase();
  
  // Codeforces Badge
  const cfBadge = player.codeforces.badge ? 
    `<a href="${player.codeforces.url}" target="_blank" class="badge-link">
       <img src="${player.codeforces.badge}" alt="CF Rating" loading="lazy">
     </a>` : '';

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
      ${cfBadge}
      ${acBadge}
    </div>
  `;
  
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
