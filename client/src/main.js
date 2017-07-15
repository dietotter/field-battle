
var drawer = require('./drawer');
var game = require('./game');

game.initializeGame();

update = function(){

    drawer.drawGame();
}

setInterval(update, 1000/25); // 25 frames per second => update every 40 ms

/* TODO Goals
* DONE (9.7.2017) 1. Mouse interaction (player can select own units and structures)
* DONE (9.7.2017) 2. If player selects own unit, that can attack, and then clicks enemy unit, attack action is triggered
* DONE (10.7.2017) 3. When object's hp becomes <= 0, remove it from battlefield and from unit list
* KINDA DONE (needs the design + change some functions when object creation is implemented) (11.7.2017) 4. Simple user interface (Buttons on active panel change depending on player mode and selected object)
* DONE (13.7.2017) 4.5. Add tooltips to buttons if hovered (at least button name should be displayed, as buttons will most likely have icons instead of actual text)
* 4.7. When selecting ally (not own) unit/structure, don't show action buttons, but just unit's portrait and stats.
*   This also applies to selecting enemy units/structures during Default player mode (when nothing own is selected).
*   Also this should apply to all units/structures when its not Player's turn.
*   Basically, I just need a new player mode (e.g. ModeEnum.NOT_OWN_SELECTED) and handle it properly.
* 5. Implement turns
* 6. Implement object creation (without using the grid, player can create object wherever he wants on his side of the battlefield)
* 7. Add game object property 'hasAction', which indicates whether or not object can act this turn (all of player's objects need
*   to have this property reset to true at the start of the turn). Somewhat of hasAction indicator also needs to be added to UI.
* 8. Implement scrolling the battlefield (player can press mouse/touch the screen and drag the camera) (HOW TO e.g. we can track
*   the mouse movement and
* 9. Implement player's money system (constructing buildings and units using money, adding money every turn depending on the number of farms etc).
*   Show current amount of each player's money on the top of the canvas.
*
* TODO Not order-specifield goals:
* ???. Add an update method to entities and call it every frame --- This actually needs to be done soon (when the first necessity occurs)
* ???. Create github repo
* ???. Finish player mode processing
* ???. Show selected object's portrait and hp in bottom UI panel
*
* TODO Long-term goals
* ???. Make game multiplayer (add back-end). Use socket.io
* */