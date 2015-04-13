/**
 * Copyright 2014-2015 Krisztián Nagy
 * @file 
 * @author Krisztián Nagy [nkrisztian89@gmail.com]
 * @licence GNU GPLv3 <http://www.gnu.org/licenses/>
 * @version 1.0
 */

/*jslint nomen: true, white: true */
/*global define, require, location, document, JSON */

define([
    "modules/application"
], function (application) {
    "use strict";

    // first set up the general properties provided by application.js

    application.setFolders({
        screen: "screens/",
        component: "components/",
        css: "css/",
        model: "models/",
        shader: "shaders/",
        texture: "textures/",
        config: "config/",
        level: "levels/",
        environment: "levels/"
    });
    application.setLogVerbosity(2);

    application.setVersion("0.1.0:106+refactoring-12 (2015.04.13.)");

    // add private variables specific to Interstellar Armada

    var
          /**
           * Manages the texture, cubemap, shader and model resources of the game.
           * @type ResourceManager
           */
          _resourceManager = null,
          /**
           * Manages the HTML screens of the game (such as menu, battle, database...)
           * @type ScreenManager
           */
          _screenManager = null,
          /**
           * The graphics context of the game, that can be used to access and 
           * manipulate graphical resources.
           * @type GraphicsContext
           */
          _graphicsContext = null,
          /**
           * The logic context of the game, containing the domain specific model (e.g.
           * what classes of spaceships are there)
           * @type LogicContext
           */
          _logicContext = null,
          /**
           * The control context of the game, that can be used to bind input controls
           * to in-game actions.
           * @type ControlContext
           */
          _controlContext = null;

    // -------------------------------------------------------------------------
    // Private methods

    /**
     * Sends an asynchronous request to get the XML file describing the game
     * settings and sets the callback function to set them.
     * @param {String} settingsFileURL
     */
    application.requestSettingsLoad = function (settingsFileURL) {
        application.requestXMLFile("config", settingsFileURL, function (settingsXML) {
            application.log("Loading game settings...", 1);
            _graphicsContext.loadFromXMLTag(settingsXML.getElementsByTagName("graphics")[0]);
            _graphicsContext.loadFromLocalStorage();
            _logicContext.loadFromXML(settingsXML.getElementsByTagName("logic")[0]);
            _controlContext.loadFromXML(settingsXML.getElementsByTagName("control")[0]);
            _controlContext.loadFromLocalStorage();
        });
    };

    application.requestConfigLoad = function (resourceManager) {
        application.requestTextFile("config", "config.json", function (configText) {
            var configJSON = JSON.parse(configText);
            application.log("Loading game configuration...", 1);
            _resourceManager.requestConfigLoad(configJSON.configFileURLs.resources, {
                "textures": resourceManager.TextureResource,
                "cubemaps": resourceManager.CubemapResource,
                "shaders": resourceManager.ShaderResource,
                "models": resourceManager.ModelResource
            });
            _logicContext.setClassesSourceFileName(configJSON.configFileURLs.classes);
            _logicContext.setEnvironmentsSourceFileName(configJSON.configFileURLs.environments);
            application.requestSettingsLoad(configJSON.configFileURLs.settings);
        });
    };

    application.buildScreens = function () {
        require(["modules/screens", "armada/screens"], function (screens, armadaScreens) {
            _screenManager.addScreen(new screens.MenuScreen("mainMenu", "menu.html", [{
                    caption: "New game",
                    action: function () {
                        _screenManager.setCurrentScreen("battle");
                        _screenManager.getCurrentScreen().startNewBattle("level.xml");
                    }
                }, {
                    caption: "Database",
                    action: function () {
                        _screenManager.setCurrentScreen("database");
                    }
                }, {
                    caption: "Settings",
                    action: function () {
                        _screenManager.setCurrentScreen("settings");
                    }
                }, {
                    caption: "About",
                    action: function () {
                        _screenManager.setCurrentScreen("about");
                    }
                }], "menuContainer"));
            _screenManager.addScreen(new armadaScreens.BattleScreen("battle", "battle.html"));
            _screenManager.addScreen(new armadaScreens.DatabaseScreen("database", "database.html"));
            _screenManager.addScreen(new screens.MenuScreen("settings", "menu.html", [{
                    caption: "Graphics settings",
                    action: function () {
                        _screenManager.setCurrentScreen("graphics");
                    }
                }, {
                    caption: "Control settings",
                    action: function () {
                        _screenManager.setCurrentScreen("controls");
                    }
                }, {
                    caption: "Back",
                    action: function () {
                        _screenManager.setCurrentScreen("mainMenu");
                    }
                }], "menuContainer"));
            _screenManager.addScreen(new armadaScreens.GraphicsScreen("graphics", "graphics.html"));
            _screenManager.addScreen(new armadaScreens.ControlsScreen("controls", "controls.html"));
            _screenManager.addScreen(new armadaScreens.AboutScreen("about", "about.html"));
            _screenManager.addScreen(new screens.MenuScreen("ingameMenu", "ingame-menu.html", [{
                    caption: "Resume game",
                    action: function () {
                        _screenManager.closeSuperimposedScreen();
                        _screenManager.getCurrentScreen().resumeBattle();
                    }
                }, {
                    caption: "Controls",
                    action: function () {
                        _screenManager.setCurrentScreen("controls", true, [64, 64, 64], 0.5);
                    }
                }, {
                    caption: "Quit to main menu",
                    action: function () {
                        _screenManager.setCurrentScreen("mainMenu");
                    }
                }], "menuContainer"));

            // hide the splash screen
            document.body.firstElementChild.style.display = "none";
            _screenManager.setCurrentScreen("mainMenu");
        });
    };

    // -------------------------------------------------------------------------
    // Public methods
    /**
     * Displays information about an error that has occured in relation with WebGL,
     * adding some basic WebGL support info for easier troubleshooting.
     * @param {String} message A brief error message to show.
     * @param {String} [severity] The severity level of the error. Possible
     * values: "critical", "severe", "minor".
     * @param {String} [details] Additional details to show about the error,
     * with possible explanations or tips how to correct this error.
     * @param {WebGLRenderingContext} gl The WebGL context the error happened in
     * relation with.
     */
    application.showGraphicsError = function (message, severity, details, gl) {
        if (!gl) {
            application.showError(message, severity, details + "\n\nThis is a graphics related error. There is " +
                  "no information available about your graphics support.");
        } else {
            application.showError(message, severity, details + "\n\nThis is a graphics related error.\n" +
                  "Information about your graphics support:\n" +
                  "WebGL version: " + gl.getParameter(gl.VERSION) + "\n" +
                  "Shading language version: " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION) + "\n" +
                  "WebGL vendor: " + gl.getParameter(gl.VENDOR) + "\n" +
                  "WebGL renderer: " + gl.getParameter(gl.RENDERER));
        }
    };
    /** 
     * Initializes the game: builds up the screens, loads settings and displays the main menu.
     */
    application.initialize = function () {
        application.log("Initializing Interstellar Armada (version: " + application.getVersion() + ")...", 1);
        if (location.protocol === "file:") {
            this.showError("Trying to run the game from the local filesystem!", "critical",
                  "This application can only be run through a web server. " +
                  "If you wish to run it from your own computer, you have to install, set up " +
                  "and start a web server first. You have to put the folder containing the files of this game " +
                  "(assume it is called 'armada') to the HTML serving folder of the web server, then " +
                  "you can start the game by entering 'localhost/armada' in your browser's address bar.");
            return;
        }
        require([
            "modules/resource-manager",
            "modules/screen-manager",
            "armada/graphics",
            "armada/logic",
            "armada/control"
        ], function (resourceManager, screenManager, graphics, logic, control) {
            _resourceManager = new resourceManager.ResourceManager();
            _screenManager = new screenManager.ScreenManager();
            _graphicsContext = new graphics.GraphicsContext();
            _logicContext = new logic.LogicContext();
            _controlContext = new control.ControlContext();

            application.requestConfigLoad(resourceManager);

            application.buildScreens();
        });
    };
    // Shortcuts
    /**
     * A shortcut to the graphics context of the game.
     * @returns {GraphicsContext}
     */
    application.graphics = function () {
        return _graphicsContext;
    };
    /**
     * A shortcut to the graphics resource manager of the game.
     * @returns {ResourceManager}
     */
    application.resources = function () {
        return _resourceManager();
    };
    /**
     * A shortcut to the control context of the game.
     * @returns {ControlContext}
     */
    application.control = function () {
        return _controlContext;
    };
    /**
     * A shortcut to the logic context of the game.
     * @returns {LogicContext}
     */
    application.logic = function () {
        return _logicContext;
    };
    // globally available functions
    /**
     * Returns the current screen of the game or the screen with the given name.
     * @param {String} [screenName] If specified, the function will return the
     * screen having this name. If omitted the function returns the current screen.
     * @returns {screens.GameScreen}
     */
    application.getScreen = function (screenName) {
        return screenName ?
              _screenManager.getScreen(screenName) :
              _screenManager.getCurrentScreen();
    };
    /**
     * Switches to the given screen.
     * @param {String} screenName The name of the screen to activate.
     * @param {Boolean} [superimpose=false] Whether to superimpose the screen 
     * on top of the current screen(s), or just switch over to it.
     * @param {Number[3]} [backgroundColor] When superimposing, this color
     * will be used for the background. Format: [red, green, blue], where 
     * each component has to be a value between 0 and 255.
     * @param {Number} [backgroundOpacity] When superimposing, this opacity
     * will be used for the background. A real number, 0.0 is completely
     * transparent, 1.0 is completely opaque.
     */
    application.setScreen = function (screenName, superimpose, backgroundColor, backgroundOpacity) {
        _screenManager.setCurrentScreen(screenName, superimpose, backgroundColor, backgroundOpacity);
    };

    return application;
});