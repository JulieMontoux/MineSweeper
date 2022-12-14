var MineSweeper = {
    name: 'MineSweeper',

    difficulties: {
        easy: {
            lines: 9,
            columns: 9,
            mines: 10,
        },
        normal: {
            lines: 16,
            columns: 16,
            mines: 40,
        },
        hard: {
            lines: 22,
            columns: 22,
            mines: 100,
        },
        extreme: {
            lines: 30,
            columns: 30,
            mines: 250,
        },
    },

    settings: {
    },

    game: {
        status: 0,
        field: new Array(),
    },
    // initialisation du jeu sur le mode easy
    initialise: function() {
        this.startGame('easy');
    },

    startGame: function(difficulty) {
        this.settings = this.difficulties[difficulty];
        this.drawGameBoard();
        this.resetGame();
    },

    drawGameBoard: function() {

        board = document.getElementById('plateau');
        board.innerHTML = '';

        document.getElementById('result').innerHTML = '';

        border = document.createElement('table');
        border.setAttribute('oncontextmenu', 'return false;');
        field = document.createElement('tbody');
        border.appendChild(field);
        border.className = 'field';

        board.appendChild(border);

        for (i = 1; i <= this.settings['lines']; i++) {
            line = document.createElement('tr');

            for (j = 1; j <= this.settings['columns']; j++) {
                cell = document.createElement('td');
                cell.id = 'cell-'+i+'-'+j;
                cell.className = 'cell';
                cell.setAttribute('onclick', this.name+'.checkPosition('+i+', '+j+', true);');
                cell.setAttribute('oncontextmenu', this.name+'.markPosition('+i+', '+j+'); return false;');
                line.appendChild(cell);
            }
            field.appendChild(line);
        }
    },

    resetGame: function() {

        /* Creons le champ, vide */
        this.game.field = new Array();
        for (i = 1; i <= this.settings['lines']; i++) {
            this.game.field[i] = new Array();
            for (j = 1; j <= this.settings['columns']; j++) {
                this.game.field[i][j] = 0;
            }
        }

        /* Ajoutons les mines */
        for (i = 1; i <= this.settings['mines']; i++) {
            /* On place la mine de facon aleatoire */
            x = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
            y = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
            while (this.game.field[x][y] == -1) {
                x = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
                y = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
            }
            this.game.field[x][y] = -1;

            /* On met a jour les donnees des cellules adjacentes */
            for (j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['columns'] + 1))
                    continue;
                for (k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['lines'] + 1))
                        continue;
                    if (this.game.field[j][k] != -1)
                        this.game.field[j][k] ++;
                }
            }
        }

        /* On definit le status au mode jeu */
        this.game.status = 1;
    },

    checkPosition: function(x, y, check) {

        /* Verifie si le jeu est en fonctionnement */
        if (this.game.status != 1)
            return;

        /* Verifie si la cellule a deja ete visitee */
        if (this.game.field[x][y] == -2) {
            return;
        }

        /* Verifie si la cellule est marquee */
        if (this.game.field[x][y] < -90) {
            return;
        }

        /* Verifie si la cellule est un mine */
        if (this.game.field[x][y] == -1) {
            document.getElementById('cell-'+x+'-'+y).className = 'cell bomb';
            this.displayLose();
            return;
        }

        /* Marque la cellule comme verifiee */
        document.getElementById('cell-'+x+'-'+y).className = 'cell clear';
        if (this.game.field[x][y] > 0) {
            /* On marque le nombre de mine des cases adjacentes */
            document.getElementById('cell-'+x+'-'+y).innerHTML = this.game.field[x][y];

            /* On marque la case comme visitee */
            this.game.field[x][y] = -2;
        } else if (this.game.field[x][y] == 0) {
            /* On marque la case comme visitee */
            this.game.field[x][y] = -2;

            /* On devoile les cases adjacentes */
            for (var j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['columns'] + 1))
                    continue;
                for (var k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['lines'] + 1))
                        continue;
                    if (this.game.field[j][k] > -1) {
                        this.checkPosition(j, k, false);
                    }
                }
            }
        }

        /* Lance la verification de la victoire si necessaire */
        if (check !== false)
            this.checkWin();
    },

    markPosition: function(x, y) {

        /* Verifie si le jeu est en fonctionnement */
        if (this.game.status != 1)
            return;

        /* Verifie si la cellule a deja ete visitee */
        if (this.game.field[x][y] == -2)
            return;

        if (this.game.field[x][y] < -90) {
            /* Retire le marquage */
            document.getElementById('cell-'+x+'-'+y).className = 'cell';
            document.getElementById('cell-'+x+'-'+y).innerHTML = '';
            this.game.field[x][y] += 100;

        } else {
            /* Applique le marquage */
            document.getElementById('cell-'+x+'-'+y).className = 'cell marked';
            document.getElementById('cell-'+x+'-'+y).innerHTML = '?';
            this.game.field[x][y] -= 100;
        }
    },

    checkWin: function() {
        /* On verifie toutes les cases */
        for (var i = 1; i <= this.settings['lines']; i++) {
            for (var j = 1; j <= this.settings['columns']; j++) {
                v = this.game.field[i][j];
                if (v != -1 && v != -2 && v != -101)
                    return;
            }
        }

        //  Affiche la victoire 
        this.displayWin();
    },

    displayWin: function() {
        // Affiche le resultat en alerte
        alert("Bravo vous avez gagn??!");
        // Etat de la partie : termin??
        this.game.status = 0;
    },

    displayLose: function() {
    //  Affiche le resultat en alerte
        alert("Vous avez perdu, LOOSER!");
        

        // Etat de la partie : termin??
        this.game.status = 0;
    },

} 
