// Translations
const translations = {
    fr: {
        title: "Secret Santa",
        subtitle: "Organisez votre échange de cadeaux",
        participants: "Participants",
        participantPlaceholder: "Nom du participant",
        addButton: "Ajouter",
        couples: "Couples",
        couplesHelp: "Les couples ne pourront pas se tirer entre eux",
        person1: "Personne 1",
        person2: "Personne 2",
        addCouple: "Ajouter couple",
        startDraw: "Commencer le tirage",
        drawInProgress: "Tirage en cours",
        nextDraw: "Tirer le suivant",
        restart: "Recommencer",
        drawComplete: "✨ Tirage terminé !",
        newDraw: "Nouveau tirage",
        footer: "🎄 Joyeuses fêtes ! 🎁",
        remove: "Retirer",
        choose: "Choisir...",
        firstDraw: "🎲 Premier tirage :",
        givesTo: "🎁 Offre un cadeau à :",
        next: "👉",
        resultsTitle: "Résumé des attributions :",
        seeResults: "Voir les résultats",
        minParticipants: "Il faut au moins 2 participants !",
        invalidDraw: "Impossible de faire un tirage valide avec ces contraintes. Veuillez vérifier les couples.",
        confirmRestart: "Voulez-vous recommencer le tirage ?",
        confirmNewDraw: "Voulez-vous faire un nouveau tirage avec les mêmes participants ?",
        language: "Langue"
    },
    en: {
        title: "Secret Santa",
        subtitle: "Organize your gift exchange",
        participants: "Participants",
        participantPlaceholder: "Participant name",
        addButton: "Add",
        couples: "Couples",
        couplesHelp: "Couples won't be matched with each other",
        person1: "Person 1",
        person2: "Person 2",
        addCouple: "Add couple",
        startDraw: "Start draw",
        drawInProgress: "Draw in progress",
        nextDraw: "Draw next",
        restart: "Restart",
        drawComplete: "✨ Draw complete!",
        newDraw: "New draw",
        footer: "🎄 Happy Holidays! 🎁",
        remove: "Remove",
        choose: "Choose...",
        firstDraw: "🎲 First draw:",
        givesTo: "🎁 Gives a gift to:",
        next: "👉",
        resultsTitle: "Summary of assignments:",
        seeResults: "See results",
        minParticipants: "At least 2 participants are required!",
        invalidDraw: "Unable to create a valid draw with these constraints. Please check the couples.",
        confirmRestart: "Do you want to restart the draw?",
        confirmNewDraw: "Do you want to make a new draw with the same participants?",
        language: "Language"
    }
};

// Secret Santa Application
class SecretSantaApp {
    constructor() {
        this.participants = [];
        this.couples = [];
        this.drawResults = [];
        this.currentDrawIndex = 0;
        this.currentLanguage = localStorage.getItem('secretSantaLang') || 'fr';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLanguage();
        this.updateUI();
        this.registerServiceWorker();
    }

    t(key) {
        return translations[this.currentLanguage][key] || key;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('secretSantaLang', lang);
        document.documentElement.lang = lang;
        this.updateLanguage();
        this.updateUI();
    }

    updateLanguage() {
        // Update static text elements
        document.querySelector('header h1').textContent = `🎅 ${this.t('title')}`;
        document.querySelector('.subtitle').textContent = this.t('subtitle');
        document.querySelector('#setup-section h2').textContent = this.t('participants');
        document.querySelector('#participant-name').placeholder = this.t('participantPlaceholder');
        document.querySelector('#add-participant').textContent = this.t('addButton');
        document.querySelector('.couples-section h3').textContent = this.t('couples');
        document.querySelector('.help-text').textContent = this.t('couplesHelp');
        document.querySelector('#add-couple').textContent = this.t('addCouple');
        document.querySelector('#start-draw').textContent = this.t('startDraw');
        document.querySelector('#draw-section h2').textContent = this.t('drawInProgress');
        document.querySelector('#next-draw').textContent = this.t('nextDraw');
        document.querySelector('#restart-draw').textContent = this.t('restart');
        document.querySelector('#results-section h2').textContent = this.t('drawComplete');
        document.querySelector('#new-draw').textContent = this.t('newDraw');
        document.querySelector('footer p').textContent = this.t('footer');

        // Update language selector
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = this.currentLanguage;
        }

        // Update draw display if in progress
        if (this.drawResults.length > 0 && document.getElementById('draw-section').style.display !== 'none') {
            this.updateDrawDisplay();
        }

        // Update results if shown
        if (document.getElementById('results-section').style.display !== 'none') {
            this.showResults();
        }
    }

    setupEventListeners() {
        // Language selector
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.addEventListener('change', (e) => this.setLanguage(e.target.value));
        }

        // Participant management
        document.getElementById('add-participant').addEventListener('click', () => this.addParticipant());
        document.getElementById('participant-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addParticipant();
        });

        // Couples management
        document.getElementById('add-couple').addEventListener('click', () => this.addCouple());

        // Draw management
        document.getElementById('start-draw').addEventListener('click', () => this.startDraw());
        document.getElementById('next-draw').addEventListener('click', () => this.nextDraw());
        document.getElementById('restart-draw').addEventListener('click', () => this.restartDraw());
        document.getElementById('new-draw').addEventListener('click', () => this.newDraw());
    }

    addParticipant() {
        const input = document.getElementById('participant-name');
        const name = input.value.trim();

        if (name && !this.participants.includes(name)) {
            this.participants.push(name);
            input.value = '';
            this.updateUI();
        }
    }

    removeParticipant(name) {
        this.participants = this.participants.filter(p => p !== name);
        // Remove couples involving this participant
        this.couples = this.couples.filter(c => !c.includes(name));
        this.updateUI();
    }

    addCouple() {
        const person1 = document.getElementById('couple-person1').value;
        const person2 = document.getElementById('couple-person2').value;

        if (person1 && person2 && person1 !== person2) {
            // Check if couple already exists
            const coupleExists = this.couples.some(c => 
                (c[0] === person1 && c[1] === person2) || 
                (c[0] === person2 && c[1] === person1)
            );

            if (!coupleExists) {
                this.couples.push([person1, person2]);
                this.updateUI();
            }
        }
    }

    removeCouple(index) {
        this.couples.splice(index, 1);
        this.updateUI();
    }

    areCouple(person1, person2) {
        return this.couples.some(c => 
            (c[0] === person1 && c[1] === person2) || 
            (c[0] === person2 && c[1] === person1)
        );
    }

    startDraw() {
        if (this.participants.length < 2) {
            alert(this.t('minParticipants'));
            return;
        }

        // Initialize draw
        this.drawResults = [];
        this.currentDrawIndex = 0;

        // Perform the complete draw to ensure it's valid
        if (!this.performCompleteDraw()) {
            alert(this.t('invalidDraw'));
            return;
        }

        // Show draw section
        document.getElementById('setup-section').style.display = 'none';
        document.getElementById('draw-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';

        // Show first draw
        this.updateDrawDisplay();
    }

    performCompleteDraw() {
        const maxAttempts = 1000;
        let attempt = 0;

        while (attempt < maxAttempts) {
            attempt++;
            const result = this.tryDraw();
            if (result) {
                this.drawResults = result;
                return true;
            }
        }

        return false;
    }

    tryDraw() {
        const result = [];
        
        // Shuffle to get random starting person
        const shuffled = this.shuffle([...this.participants]);
        
        for (let i = 0; i < shuffled.length; i++) {
            const giver = shuffled[i];
            const receiver = shuffled[(i + 1) % shuffled.length];
            
            // Check if giver and receiver are a couple
            if (this.areCouple(giver, receiver)) {
                return null; // Invalid draw
            }
            
            result.push({ giver, receiver });
        }

        return result;
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    nextDraw() {
        this.currentDrawIndex++;
        
        if (this.currentDrawIndex >= this.drawResults.length) {
            this.showResults();
        } else {
            this.updateDrawDisplay(true);
        }
    }

    updateDrawDisplay(withAnimation = false) {
        const drawInfo = document.getElementById('draw-info');
        drawInfo.innerHTML = '';

        // Show all draws up to current
        for (let i = 0; i <= this.currentDrawIndex && i < this.drawResults.length; i++) {
            const draw = this.drawResults[i];
            const stepDiv = document.createElement('div');
            const isCurrent = i === this.currentDrawIndex;
            stepDiv.className = 'draw-step' + (isCurrent ? ' current' : '');
            
            // For the current draw with animation, show suspense first
            const receiverContent = (isCurrent && withAnimation) 
                ? '<span class="receiver revealing">???</span>'
                : `<span class="receiver">${draw.receiver}</span>`;
            
            if (i === 0) {
                stepDiv.innerHTML = `
                    <div>${this.t('firstDraw')} <span class="giver">${draw.giver}</span></div>
                    <div>${this.t('givesTo')} ${receiverContent}</div>
                `;
            } else {
                stepDiv.innerHTML = `
                    <div>${this.t('next')} <span class="giver">${draw.giver}</span></div>
                    <div>${this.t('givesTo')} ${receiverContent}</div>
                `;
            }
            
            drawInfo.appendChild(stepDiv);
            
            // If this is the current draw with animation, reveal after delay
            if (isCurrent && withAnimation) {
                const receiverSpan = stepDiv.querySelector('.receiver');
                // Disable the button during animation
                const nextBtn = document.getElementById('next-draw');
                nextBtn.disabled = true;
                
                // After suspense, reveal the name
                setTimeout(() => {
                    receiverSpan.classList.remove('revealing');
                    receiverSpan.classList.add('revealed');
                    receiverSpan.textContent = draw.receiver;
                    nextBtn.disabled = false;
                }, 2000); // 2 seconds of suspense
            }
        }

        // Update button text
        const nextBtn = document.getElementById('next-draw');
        if (this.currentDrawIndex < this.drawResults.length - 1) {
            nextBtn.textContent = this.t('nextDraw');
        } else {
            nextBtn.textContent = this.t('seeResults');
        }
    }

    showResults() {
        document.getElementById('draw-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = `<h3>${this.t('resultsTitle')}</h3>`;

        this.drawResults.forEach((draw, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            resultDiv.innerHTML = `
                <strong>${draw.giver}</strong> 🎁 <strong>${draw.receiver}</strong>
            `;
            resultsList.appendChild(resultDiv);
        });
    }

    restartDraw() {
        if (confirm(this.t('confirmRestart'))) {
            this.currentDrawIndex = 0;
            this.drawResults = [];
            
            // Go back to setup
            document.getElementById('setup-section').style.display = 'block';
            document.getElementById('draw-section').style.display = 'none';
            document.getElementById('results-section').style.display = 'none';
        }
    }

    newDraw() {
        if (confirm(this.t('confirmNewDraw'))) {
            this.startDraw();
        }
    }

    updateUI() {
        this.updateParticipantsList();
        this.updateCouplesSelects();
        this.updateCouplesList();
        this.updateStartButton();
    }

    updateParticipantsList() {
        const list = document.getElementById('participants-list');
        list.innerHTML = '';

        this.participants.forEach(name => {
            const item = document.createElement('div');
            item.className = 'participant-item';
            item.innerHTML = `
                <span class="participant-name">${name}</span>
                <button class="remove-btn" title="${this.t('remove')}">×</button>
            `;
            item.querySelector('.remove-btn').addEventListener('click', () => this.removeParticipant(name));
            list.appendChild(item);
        });
    }

    updateCouplesSelects() {
        const select1 = document.getElementById('couple-person1');
        const select2 = document.getElementById('couple-person2');

        [select1, select2].forEach(select => {
            const currentValue = select.value;
            select.innerHTML = `<option value="">${this.t('choose')}</option>`;
            
            this.participants.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });

            if (this.participants.includes(currentValue)) {
                select.value = currentValue;
            }
        });
    }

    updateCouplesList() {
        const list = document.getElementById('couples-list');
        list.innerHTML = '';

        this.couples.forEach((couple, index) => {
            const item = document.createElement('div');
            item.className = 'couple-item';
            item.innerHTML = `
                <span class="couple-text">💑 ${couple[0]} ↔️ ${couple[1]}</span>
                <button class="remove-btn" title="${this.t('remove')}">×</button>
            `;
            item.querySelector('.remove-btn').addEventListener('click', () => this.removeCouple(index));
            list.appendChild(item);
        });
    }

    updateStartButton() {
        const button = document.getElementById('start-draw');
        button.disabled = this.participants.length < 2;
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service Worker registered'))
                .catch(error => console.log('Service Worker registration failed:', error));
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecretSantaApp();
});
