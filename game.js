  (() => {
  const $ = id => document.getElementById(id);
  const heroes = [
    {id:'blade',name:'Juggernaut',role:'Мастер клинка',emoji:'⚔️',hp:125,mana:80,atk:17,def:4,skill:'Blade Fury',color:'violet'},
    {id:'iron',name:'Pudge',role:'Мясник из Квоута',emoji:'🪝',hp:165,mana:65,atk:13,def:7,skill:'Meat Hook',color:'blue'},
    {id:'mage',name:'Crystal Maiden',role:'Ледяная волшебница',emoji:'❄️',hp:105,mana:135,atk:12,def:3,skill:'Freezing Field',color:'purple'},
    {id:'shade',name:'Phantom Assassin',role:'Смертоносная убийца',emoji:'🗡️',hp:112,mana:95,atk:20,def:3,skill:'Coup de Grace',color:'red'}
  ];
  const enemies = [
    {id:'creep',name:'Axe',sub:'Берсерк Красной Туманности',emoji:'🪓',hp:48,atk:7,armor:1,gold:18,xp:20,min:1},
    {id:'archer',name:'Sniper',sub:'Меткий стрелок Кинфола',emoji:'🎯',hp:66,atk:10,armor:2,gold:28,xp:30,min:2},
    {id:'golem',name:'Tiny',sub:'Каменный великан',emoji:'🗿',hp:105,atk:14,armor:4,gold:45,xp:45,min:3},
    {id:'roshan',name:'Roshan',sub:'Главный босс арены',emoji:'🐉',hp:165,atk:18,armor:5,gold:100,xp:80,min:4}
  ];
  const defaults = {
  heroId: null,
  heroHp: 0,
  mana: 0,
  gold: 35,
  xp: 0,
  level: 1,
  weapon: 0,
  armor: 0,
  potions: 1,
  manaPotions: 0,
  wins: 0,
  enemyId: null,
  enemyHp: 0
};
  let state = {...defaults, ...(safeLoad() || {})};
  let toastTimer;
  function safeLoad(){try{return JSON.parse(localStorage.getItem('daquest-save')||'null')}catch{return null}}
  function save(){localStorage.setItem('daquest-save',JSON.stringify(state))}
  const hero = () => heroes.find(h=>h.id===state.heroId);
  const enemy = () => enemies.find(e=>e.id===state.enemyId);
  const maxHp = () => hero() ? hero().hp + Math.max(0,state.level-1)*15 : 0;
  const maxMana = () => hero() ? hero().mana + Math.max(0,state.level-1)*10 : 0;
  const attackPower = () => hero() ? hero().atk + state.weapon + Math.max(0,state.level-1)*2 : 0;
  const defensePower = () => hero() ? hero().def + state.armor : 0;
  function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
  function showView(view){document.querySelectorAll('.view').forEach(el=>el.classList.add('hidden'));$('view-'+view).classList.remove('hidden');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));if(view==='arena')renderEnemies();if(view==='shop')renderShop();if(view==='profile')renderProfile();if(view==='heroes')renderHeroes();if(view==='battle')renderBattle();window.scrollTo({top:0,behavior:'smooth'})}
  
function updateStatus(){
  const h = hero();
  $('gold').textContent = state.gold;
  $('level').textContent = state.level;
  $('xp').textContent = `${state.xp}/${state.level*60}`;

  if(!h){
    $('heroAvatar').textContent = '🗡️';
    $('heroName').textContent = 'Выбери героя';
    $('heroRole').textContent = 'Твоя легенда начинается здесь';
    $('hpText').textContent = '—';
    $('manaText').textContent = '—';
    $('hpBar').style.width = '0%';
    $('manaBar').style.width = '0%';
    $('attack').textContent = '—';
    $('defense').textContent = '—';
    return;
  }

  const portraits = {
    blade: 'juggernaut.jpg',
    iron: 'pudge.jpg',
    mage: 'crystal_maiden.jpg',
    shade: 'phantom_assassin.jpg'
  };

  $('heroAvatar').innerHTML = `
    <img
      src="portraits/${portraits[h.id]}"
      alt="${h.name}"
      onerror="this.style.display='none';this.parentElement.textContent='${h.emoji}'"
    >
  `;

  $('heroName').textContent = h.name;
  $('heroRole').textContent = h.role;
  $('hpText').textContent = `${Math.max(0,state.heroHp)} / ${maxHp()}`;
  $('manaText').textContent = `${state.mana} / ${maxMana()}`;
  $('hpBar').style.width = `${Math.max(0,Math.min(100,state.heroHp/maxHp()*100))}%`;
  $('manaBar').style.width = `${Math.max(0,Math.min(100,state.mana/maxMana()*100))}%`;
  $('attack').textContent = attackPower();
  $('defense').textContent = defensePower();
}

  
  
    
function renderHeroes(){
  const portraits = {
    blade: 'juggernaut.jpg',
    iron: 'pudge.jpg',
    mage: 'crystal_maiden.jpg',
    shade: 'phantom_assassin.jpg'
  };

  $('heroGrid').innerHTML = heroes.map(h => `
    <article class="hero-card">
      <div class="character-art">
        <img
          src="portraits/${portraits[h.id]}"
          alt="${h.name}"
          onerror="this.style.display='none';this.parentElement.textContent='${h.emoji}'"
        >
      </div>
      <div class="hero-card-content">
        <h3>${h.name}</h3>
        <p>${h.role}</p>
        <div class="stats-chips">
          <span>❤️ ${h.hp}</span>
          <span>✨ ${h.mana}</span>
          <span>⚔ ${h.atk}</span>
          <span>🛡 ${h.def}</span>
        </div>
      </div>
      <button class="pick-btn" data-hero="${h.id}">
        ${state.heroId===h.id?'ВЫБРАН':'ВЫБРАТЬ'}
      </button>
    </article>
  `).join('');

  $('heroGrid').querySelectorAll('[data-hero]').forEach(
    b => b.onclick = () => selectHero(b.dataset.hero)
  );
}

   

  function selectHero(id){
    const h=heroes.find(x=>x.id===id);state={...defaults,heroId:id,heroHp:h.hp,mana:h.mana};save();updateStatus();renderHeroes();showView('arena');toast(`${h.name} готов к бою!`);
  }
  
function renderEnemies(){
  const portraits = {
    creep: 'axe.jpg',
    archer: 'sniper.jpg',
    golem: 'tiny.jpg',
    roshan: 'roshan.jpg'
  };

  $('stageTitle').textContent = state.wins
    ? `Арена · Побед ${state.wins}`
    : 'Выбери противника';

  $('enemyList').innerHTML = enemies.map(e => {
    const locked = state.level < e.min;

    return `
      <article class="enemy-card ${locked ? 'locked' : ''}">
        <div class="enemy-art-small">
          <img
            src="portraits/${portraits[e.id]}"
            alt="${e.name}"
            onerror="this.style.display='none';this.parentElement.textContent='${e.emoji}'"
          >
        </div>
        <div class="enemy-content">
          <h3>${e.name} ${locked ? '🔒' : ''}</h3>
          <p>${e.sub}</p>
          <div class="stats-chips">
            <span>❤️ ${e.hp}</span>
            <span>⚔ ${e.atk}</span>
            <span>🛡 ${e.armor}</span>
          </div>
          <p class="reward">🪙 +${e.gold} · ✨ +${e.xp} опыта</p>
        </div>
        <button class="pick-btn" data-enemy="${e.id}" ${locked ? 'disabled' : ''}>
          ${locked ? 'УР. ' + e.min : 'В БОЙ'}
        </button>
      </article>
    `;
  }).join('');

  $('enemyList').querySelectorAll('[data-enemy]').forEach(
    b => b.onclick = () => startBattle(b.dataset.enemy)
  );
}

  function startBattle(id){if(!hero()){showView('heroes');toast('Сначала выбери героя');return}const e=enemies.find(x=>x.id===id);if(state.level<e.min)return;state.enemyId=id;state.enemyHp=e.hp;save();$('combatLog').textContent=`${e.name} выходит на арену! Твой ход.`;showView('battle')}
  
function renderBattle() {
  const e = enemy();

  if (!e) {
    showView('arena');
    return;
  }

  $('enemyArt').textContent = e.emoji;
  $('enemyName').textContent = e.name;
  $('enemySubtitle').textContent = e.sub;

  $('enemyHpText').textContent =
    `${Math.max(0, state.enemyHp)} / ${e.hp}`;

  $('enemyHpBar').style.width =
    `${Math.max(0, Math.min(100, state.enemyHp / e.hp * 100))}%`;

  $('skillCost').textContent =
    `25 маны · ${hero()?.skill || 'Навык'}`;

  $('potionCount').textContent =
    `Осталось: ${state.potions}`;

  $('manaPotionCount').textContent =
    `Осталось: ${state.manaPotions}`;

  $('skillBtn').disabled = state.mana < 25;
  $('potionBtn').disabled =
    state.potions < 1 || state.heroHp >= maxHp();

  $('manaPotionBtn').disabled =
    state.manaPotions < 1 || state.mana >= maxMana();
}

  function animateEnemy(){const el=$('enemyArt');el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
  function takeTurn(damage,action,cost=0){
    const e=enemy();if(!e)return;
    state.mana=Math.max(0,state.mana-cost);state.enemyHp=Math.max(0,state.enemyHp-damage);animateEnemy();
    if(state.enemyHp<=0){state.gold+=e.gold;state.xp+=e.xp;state.wins++;let leveled=false;while(state.xp>=state.level*60){state.xp-=state.level*60;state.level++;leveled=true}if(leveled){state.heroHp=Math.min(maxHp(),state.heroHp+25);state.mana=Math.min(maxMana(),state.mana+10)}state.enemyId=null;state.enemyHp=0;save();updateStatus();$('combatLog').textContent=`🏆 Победа! ${action} нанёс ${damage} урона. +${e.gold} золота, +${e.xp} опыта.${leveled?' Новый уровень!':''} Выбирай следующего врага.`;showView('arena');toast('Победа! Выбери следующего врага');return}
    const incoming=Math.max(1,e.atk-defensePower());state.heroHp=Math.max(0,state.heroHp-incoming);save();updateStatus();renderBattle();
    $('combatLog').textContent=`${action}: −${damage} HP врагу. Ответный удар: −${incoming} HP тебе.`;
    if(state.heroHp<=0){state.gold=Math.floor(state.gold/2);state.heroHp=maxHp();state.mana=maxMana();state.enemyId=null;state.enemyHp=0;save();updateStatus();showView('arena');toast('Герой восстановился. Потеряна половина золота.')}
  }
  function usePotion(){if(state.potions<1||state.heroHp>=maxHp())return;const healed=Math.min(30,maxHp()-state.heroHp);state.heroHp+=healed;state.potions--;const e=enemy();const incoming=e?Math.max(1,e.atk-defensePower()):0;state.heroHp=Math.max(0,state.heroHp-incoming);save();updateStatus();renderBattle();$('combatLog').textContent=`Зелье восстановило ${healed} HP. Враг нанёс ${incoming} урона.`;if(state.heroHp<=0){state.gold=Math.floor(state.gold/2);state.heroHp=maxHp();state.mana=maxMana();state.enemyId=null;state.enemyHp=0;save();updateStatus();showView('arena');toast('Герой восстановился. Потеряна половина золота.')}}
 
function useManaPotion() {
  if (state.manaPotions < 1 || state.mana >= maxMana()) {
    return;
  }

  const restored = Math.min(40, maxMana() - state.mana);

  state.mana += restored;
  state.manaPotions--;

  const e = enemy();
  const incoming = e
    ? Math.max(1, e.atk - defensePower())
    : 0;

  state.heroHp = Math.max(0, state.heroHp - incoming);

  save();
  updateStatus();
  renderBattle();

  $('combatLog').textContent =
    `Зелье маны восстановило ${restored} маны.\n` +
    `Враг нанёс ${incoming} урона.`;

  if (state.heroHp <= 0) {
    state.gold = Math.floor(state.gold / 2);
    state.heroHp = maxHp();
    state.mana = maxMana();
    state.enemyId = null;
    state.enemyHp = 0;

    save();
    updateStatus();
    showView('arena');
    toast('Герой восстановился. Потеряна половина золота.');
  }
}


function renderShop() {
  const items = [
    {
      id: 'potion',
      name: 'Зелье лечения',
      icon: '🧪',
      desc: 'Восстанавливает до 30 HP во время боя.',
      price: 20,
      owned: `В наличии: ${state.potions}`
    },
    {
      id: 'manaPotion',
      name: 'Зелье маны',
      icon: '🔮',
      desc: 'Восстанавливает до 40 маны во время боя.',
      price: 20,
      owned: `В наличии: ${state.manaPotions}`
    },
    {
      id: 'sword',
      name: 'Рунический клинок',
      icon: '⚔️',
      desc: 'Постоянно повышает силу атаки на 3.',
      price: 50,
      owned: `Бонус атаки: +${state.weapon}`
    },
    {
      id: 'armor',
      name: 'Броня стража',
      icon: '🛡️',
      desc: 'Уменьшает входящий урон на 2.',
      price: 45,
      owned: `Бонус защиты: +${state.armor}`
    }
  ];

  $('shopItems').innerHTML = items.map(i => `
    <article class="shop-card">
      <div class="shop-icon">${i.icon}</div>
      <div class="shop-content">
        <h3>${i.name}</h3>
        <p>${i.desc}</p>
        <div class="price">
          🪙 ${i.price} золота · ${i.owned}
        </div>
      </div>
      <button class="buy-btn" data-buy="${i.id}">
        КУПИТЬ
      </button>
    </article>
  `).join('');

  $('shopItems').querySelectorAll('[data-buy]').forEach(
    b => b.onclick = () => buy(b.dataset.buy)
  );
}

function buy(id) {
  const prices = {
    potion: 20,
    manaPotion: 20,
    sword: 50,
    armor: 45
  };

  if (state.gold < prices[id]) {
    toast('Не хватает золота');
    return;
  }

  state.gold -= prices[id];

  if (id === 'potion') state.potions++;
  if (id === 'manaPotion') state.manaPotions++;
  if (id === 'sword') state.weapon += 3;
  if (id === 'armor') state.armor += 2;

  save();
  updateStatus();
  renderShop();
  toast('Покупка успешна!');
}

  
  function renderProfile(){const h=hero();$('profileAvatar').textContent=h?.emoji||'🗡️';$('profileName').textContent=h?.name||'Не выбран';$('profileRole').textContent=h?.role||'Выбери героя, чтобы начать';$('profileLevel').textContent=state.level;$('wins').textContent=state.wins;$('profileGold').textContent=state.gold;$('profilePotions').textContent=state.potions}
  $('attackBtn').onclick=()=>{if(!enemy())return;takeTurn(Math.max(3,attackPower()-enemy().armor),'Обычная атака')};
  $('skillBtn').onclick=()=>{if(!enemy()||state.mana<25){toast('Недостаточно маны');return}takeTurn(Math.max(4,attackPower()*2-enemy().armor),hero().skill,25)};
  $('potionBtn').onclick=usePotion;
    $('manaPotionBtn').onclick = useManaPotion;
  $('manaPotionBtn').onclick = useManaPotion;
  $('retreatBtn').onclick=()=>{state.enemyId=null;state.enemyHp=0;save();showView('arena')};
  $('backArenaBtn').onclick=()=>showView('arena');
  $('changeHeroBtn').onclick=()=>{if(confirm('Сбросить весь прогресс и выбрать героя заново?')){state={...defaults};save();updateStatus();showView('heroes')}};
  document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>{if(!hero()&&b.dataset.view!=='heroes'){toast('Сначала выбери героя');showView('heroes');return}showView(b.dataset.view)});
  if(window.Telegram?.WebApp){const tg=window.Telegram.WebApp;tg.ready();tg.expand();try{tg.setHeaderColor('#111522');tg.setBackgroundColor('#0b0f19')}catch{}}
  updateStatus();if(hero()){showView('arena')}else{showView('heroes')}
})();
