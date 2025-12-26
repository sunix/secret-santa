// Secret Santa Application
class SecretSantaApp {
    constructor() {
        this.participants = [];
        this.couples = [];
        this.drawResults = [];
        this.currentDrawIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.registerServiceWorker();
    }

    setupEventListeners() {
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
            alert('Il faut au moins 2 participants !');
            return;
        }

        // Initialize draw
        this.drawResults = [];
        this.currentDrawIndex = 0;

        // Perform the complete draw to ensure it's valid
        if (!this.performCompleteDraw()) {
            alert('Impossible de faire un tirage valide avec ces contraintes. Veuillez vérifier les couples.');
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
            this.updateDrawDisplay();
        }
    }

    updateDrawDisplay() {
        const drawInfo = document.getElementById('draw-info');
        drawInfo.innerHTML = '';

        // Show all draws up to current
        for (let i = 0; i <= this.currentDrawIndex && i < this.drawResults.length; i++) {
            const draw = this.drawResults[i];
            const stepDiv = document.createElement('div');
            stepDiv.className = 'draw-step' + (i === this.currentDrawIndex ? ' current' : '');
            
            if (i === 0) {
                stepDiv.innerHTML = `
                    <div>🎲 Premier tirage : <span class="giver">${draw.giver}</span></div>
                    <div>🎁 Offre un cadeau à : <span class="receiver">${draw.receiver}</span></div>
                `;
            } else {
                stepDiv.innerHTML = `
                    <div>👉 <span class="giver">${draw.giver}</span></div>
                    <div>🎁 Offre un cadeau à : <span class="receiver">${draw.receiver}</span></div>
                `;
            }
            
            drawInfo.appendChild(stepDiv);
        }

        // Update button text
        const nextBtn = document.getElementById('next-draw');
        if (this.currentDrawIndex < this.drawResults.length - 1) {
            nextBtn.textContent = 'Tirer le suivant';
        } else {
            nextBtn.textContent = 'Voir les résultats';
        }
    }

    showResults() {
        document.getElementById('draw-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';

        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '<h3>Résumé des attributions :</h3>';

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
        if (confirm('Voulez-vous recommencer le tirage ?')) {
            this.currentDrawIndex = 0;
            this.drawResults = [];
            
            // Go back to setup
            document.getElementById('setup-section').style.display = 'block';
            document.getElementById('draw-section').style.display = 'none';
            document.getElementById('results-section').style.display = 'none';
        }
    }

    newDraw() {
        if (confirm('Voulez-vous faire un nouveau tirage avec les mêmes participants ?')) {
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
                <button class="remove-btn" title="Retirer">×</button>
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
            select.innerHTML = '<option value="">Choisir...</option>';
            
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
                <button class="remove-btn" title="Retirer">×</button>
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
