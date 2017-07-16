/**
 * Created by Nikolay on 7/11/2017.
 */
var BUTTON_BLOCK_TEMPLATE = '<div class="button-block"></div>';
var BUTTON_TEMPLATE = '<button id="uselessBtn">Btn</button>';
var BUTTON_BOTTOM_TEXT_TEMPLATE = '<p class="button-bottom-text">Useless button name</p>';

var BOTTOM_BUTTON_PANEL = $('.bottom-button-panel');
var TOP_BUTTON_PANEL = $('.top-button-panel');

var buttonFunctions = require('./buttonFunctions');
// add button to panel according to buttonData
/*
* buttonData is an object, containing such fields:
* @ panel - what panel the button should be assigned to. Can take values 'top' or 'bottom';
* @ name - button name. Will be displayed in the tooltip (?).
*   Also, its lowercase variant will be in HTML id (e.g. name is 'Attack' => id is 'attackBtn') (?);
* @ icon - image, which will be shown on button; NOT IMPLEMENTED YET
*
* Optional fields:
* @ bottomText - String, containing text which will be displayed below the button.
*   If there is none, no text will be displayed below.
* @ tooltipText - String, which will be added to tooltip below button name.
*   E.g., it can be the description of an ability.
*
 */
addButton = function(buttonData){
    // change button id, add text to tooltip,
    var button = $(BUTTON_TEMPLATE);
    button.prop('id', buttonData.name.toLowerCase() + 'Btn');
    button.text(buttonData.name); // this will be added to the tooltip instead
    button.attr('data-tooltip', buttonData.name);

    var node = $(BUTTON_BLOCK_TEMPLATE).append(button);

    // if bottom text exists, append it
    if(buttonData.bottomText){
        var bText = $(BUTTON_BOTTOM_TEXT_TEMPLATE);
        bText.text(buttonData.bottomText);

        node.append(bText);
    }

    if(buttonData.panel === 'top'){
        TOP_BUTTON_PANEL.append(node);
    }
    else if(buttonData.panel === 'bottom'){
        BOTTOM_BUTTON_PANEL.append(node);
    }
}

// deletes current bottom everything
flushBottomPanel = function () {
    $(BOTTOM_BUTTON_PANEL.children()).remove();
};

// deletes current top everything
flushTopPanel = function () {
    $(TOP_BUTTON_PANEL.children()).remove();
};

// updates bottom panel according to incoming data
/*
* objData is an object, containing such fields:
* @ name - String, containing gameObject name; NOT IMPLEMENTED YET
* @ portrait - gameObject's portrait to display; NOT IMPLEMENTED YET
* @ stats - Object, containing hp, maxHp, atk, cost of gameObject; NOT IMPLEMENTED YET
* @ buttonDataList - array, containing buttonDatas
*
 */
updateBottomPanel = function (objData) {
    flushBottomPanel();
    if(objData){
        objData.buttonDataList.forEach((buttonData) => {
            addButton(buttonData);
        });
    }
}

updateTopPanel = function(){
    flushTopPanel();
    addButton({
        panel: 'top',
        name: 'Turn'
    })
}

initialize = function () {
    buttonFunctions.loadButtons();
    updateTopPanel();
}

exports.flushBottomPanel = flushBottomPanel;
exports.addButton = addButton;
exports.updateBottomPanel = updateBottomPanel;
exports.initialize = initialize;