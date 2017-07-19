
var drawer = require('./drawer');
var game = require('./game');

// $(document).ready()
$(function () {
    game.initializeGame();
    setInterval(update, 1000/25); // 25 frames per second => update every 40 ms
})

update = function(){

    drawer.drawGame();
}


/* TODO Goals
* DONE (9.7.2017) 1. Mouse interaction (player can select own units and structures)
* DONE (9.7.2017) 2. If player selects own unit, that can attack, and then clicks enemy unit, attack action is triggered
* DONE (10.7.2017) 3. When object's hp becomes <= 0, remove it from battlefield and from unit list
* KINDA DONE (needs the design + change some functions when object creation is implemented) (11.7.2017) 4. Simple user interface (Buttons on active panel change depending on player mode and selected object)
* DONE (13.7.2017) 4.5. Add tooltips to buttons if hovered (at least button name should be displayed, as buttons will most likely have icons instead of actual text)
* DONE (15.7.2017) 4.7. When selecting ally (not own) unit/structure, don't show action buttons, but just unit's portrait and stats.
*   This also applies to selecting enemy units/structures during Default player mode (when nothing own is selected).
*   Also this should apply to all units/structures when its not Player's turn.
* DONE (16.7.2017) 5. Implement turns (+ add 'change turn' button to top panel)
* IN PROGRESS (19.7.2017) 6. Implement object creation (without using the grid, player can create object wherever he wants on his side of the battlefield)
* 7. Add game object property 'hasAction', which indicates whether or not object can act this turn (all of player's objects need
*   to have this property reset to true at the start of the turn). Somewhat of hasAction indicator also needs to be added to UI.
* 8. Implement scrolling the battlefield (player can press mouse/touch the screen and drag the camera) (HOW TO e.g. we can track
*   the mouse movement and
* 9. Implement player's money system (constructing buildings and units using money, adding money every turn depending on the number of farms etc).
*   Show current amount of each player's money on the top of the canvas.
* 10. Add some game content (units, buildings, another race)
*
* TODO Not order-specifield goals:
* DONE (15.7.2017) ???. Create github repo
* ???. Add an update method to entities and call it every frame --- This actually needs to be done soon (when the first necessity occurs)
*   Also add 'update' to Player and call updateUI() in it (so that we don't need to call it every time we change smth. Also, we will need to keep the track
*   of selected buttons, as sometimes UI is changed outside of Player class (e.g. from Entity.js))
* ???. Finish player mode processing
* ???. Show selected object's portrait and hp in bottom UI panel
* ???. Change Player.js exports (module.exports = Player ===> exports.Player = Player; exports.ModeEnum = ModeEnum)
* ???. Rework object selection and object selection drawing, as there may be multiple players, who will select the same object. (? this is for multiplayer)
* ???. In buttonFunctions.js, make loadButtons function load buttons depending on players' races (e.g. if there is only human and orc players in the game, don't load other races' buttons)
*   Also, in multiplayer may just load your race functions on client.
* ???. Add animations
*
* TODO Long-term goals
* ???. Make game multiplayer (add back-end). Use socket.io
*
* TODO Problems
* SOLVED (15.7.2017) 1. If enemy unit is selected, it can attack itself
* SOLVED (16.7.2017) 2. 'onclick' of UI buttons loads slowly (maybe should handle it in another way, not adding onclick every time we select an object.
*   E.g. We could append all onclicks when the page loads and never append it on selecting object (https://stackoverflow.com/questions/17664154/jquery-directly-at-onclick-and-effect-ui-slow))
*   3. During object creation, check for objects around is not working correctly (still creates object on another object (/screenshots/problem0.png))
*
* */