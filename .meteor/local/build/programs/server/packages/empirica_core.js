(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Collection2 = Package['aldeed:collection2'].Collection2;
var enableDebugLogging = Package['reywood:publish-composite'].enableDebugLogging;
var publishComposite = Package['reywood:publish-composite'].publishComposite;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var ValidatedMethod = Package['mdg:validated-method'].ValidatedMethod;
var Random = Package.random.Random;
var _ = Package.underscore._;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;
var Accounts = Package['accounts-base'].Accounts;
var Autoupdate = Package.autoupdate.Autoupdate;

/* Package-scope variables */
var player, $set, findAndModify;

var require = meteorInstall({"node_modules":{"meteor":{"empirica:core":{"server.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/server.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  config: () => config
});
module.link("./startup/server/index.js");
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let playerIdForConn;
module.link("./startup/server/connections.js", {
  playerIdForConn(v) {
    playerIdForConn = v;
  }

}, 1);
let callOnChange;
module.link("./api/server/onchange.js", {
  callOnChange(v) {
    callOnChange = v;
  }

}, 2);
let callOnSubmit;
module.link("./api/server/onsubmit.js", {
  callOnSubmit(v) {
    callOnSubmit = v;
  }

}, 3);
let earlyExitGame;
module.link("./api/games/methods.js", {
  earlyExitGame(v) {
    earlyExitGame = v;
  }

}, 4);
let shared;
module.link("./shared", {
  default(v) {
    shared = v;
  }

}, 5);
let getFunctionParameters;
module.link("./lib/utils", {
  getFunctionParameters(v) {
    getFunctionParameters = v;
  }

}, 6);
let Games;
module.link("./api/games/games.js", {
  Games(v) {
    Games = v;
  }

}, 7);
SimpleSchema.debug = true;

const safeCallback = function (name, func, arguments) {
  try {
    switch (name) {
      case "onGameStart":
      case "onRoundStart":
      case "onStageStart":
      case "onStageEnd":
      case "onRoundEnd":
      case "onGameEnd":
        handleCallbackFuncParameters(func);
        break;

      default:
        break;
    }

    const game = Games.findOne(arguments[0]._id);

    if (game.finishedAt) {
      console.log("safeCallback: game already ended.");
      return;
    }

    return func.apply(this, arguments);
  } catch (err) {
    console.error("Fatal error encounter calling Empirica.".concat(name, ":"));
    console.error(err);
    const game = arguments[0];
    earlyExitGame.call({
      gameId: game._id,
      endReason: "Failed on ".concat(name, " callback"),
      status: "failed"
    });
  }
};

const handleCallbackFuncParameters = func => {
  const parameters = getFunctionParameters(func);
  const handler = {
    getOwnPropertyDescriptor(target, keyIndex) {
      const key = keyIndex.split("__-__")[0];
      const index = parseInt(keyIndex.split("__-__")[1]);

      if (key === "game" && index === 0 || key === "round" && index === 1 || key === "stage" && index === 2) {
        return;
      } else if (key === "players") {
        throw new Error("the \"players\" argument has been deprecated, use \"game.players\" instead");
      } else {
        throw new Error("\"".concat(key, "\" property is not allowed on this callback"));
      }
    }

  };
  const proxy = new Proxy({}, handler);
  parameters.forEach((key, index) => {
    const keyIndex = key + "__-__" + index;
    Object.getOwnPropertyDescriptor(proxy, keyIndex);
  });
}; // Maybe could do better...


const config = {
  bots: {}
};
const Empirica = {
  // New name for init: gameInit
  gameInit(func) {
    config.gameInit = func;
  },

  bot(name, obj) {
    if (config.bots[name]) {
      throw "Bot \"".concat(name, "\" was declared twice!");
    }

    config.bots[name] = obj;
  },

  onGameStart(func) {
    config.onGameStart = function () {
      return safeCallback("onGameStart", func, arguments);
    };
  },

  onRoundStart(func) {
    config.onRoundStart = function () {
      return safeCallback("onRoundStart", func, arguments);
    };
  },

  onStageStart(func) {
    config.onStageStart = function () {
      return safeCallback("onStageStart", func, arguments);
    };
  },

  onStageEnd(func) {
    config.onStageEnd = function () {
      return safeCallback("onStageEnd", func, arguments);
    };
  },

  onRoundEnd(func) {
    config.onRoundEnd = function () {
      return safeCallback("onRoundEnd", func, arguments);
    };
  },

  onGameEnd(func) {
    config.onGameEnd = function () {
      return safeCallback("onGameEnd", func, arguments);
    };
  },

  onSet(func) {
    config.onSet = function () {
      return safeCallback("onSet", func, arguments);
    };
  },

  onAppend(func) {
    config.onAppend = function () {
      return safeCallback("onAppend", func, arguments);
    };
  },

  onChange(func) {
    config.onChange = function () {
      return safeCallback("onChange", func, arguments);
    };
  },

  onSubmit(func) {
    config.onSubmit = function () {
      return safeCallback("onSubmit", func, arguments);
    };
  }

};
module.exportDefault(Empirica);
// Help access to server only modules from shared modules
shared.playerIdForConn = playerIdForConn;
shared.callOnChange = callOnChange;
shared.callOnSubmit = callOnSubmit;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"gameLobby-lock.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/gameLobby-lock.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
const gameLobbyLock = {};
module.exportDefault(gameLobbyLock);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"shared.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/shared.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// sharedNamespace is used for being able to loading files on client or server
// exclusively, from files which are themselves shared.
const sharedNamespace = {};
module.exportDefault(sharedNamespace);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"collections.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/collections.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  collections: () => collections
});
let Batches;
module.link("./batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 0);
let Factors;
module.link("./factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 1);
let GameLobbies;
module.link("./game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 2);
let Games;
module.link("./games/games.js", {
  Games(v) {
    Games = v;
  }

}, 3);
let LobbyConfigs;
module.link("./lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 4);
let PlayerInputs;
module.link("./player-inputs/player-inputs.js", {
  PlayerInputs(v) {
    PlayerInputs = v;
  }

}, 5);
let PlayerRounds;
module.link("./player-rounds/player-rounds.js", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 6);
let PlayerStages;
module.link("./player-stages/player-stages.js", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 7);
let Players;
module.link("./players/players.js", {
  Players(v) {
    Players = v;
  }

}, 8);
let Rounds;
module.link("./rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 9);
let Stages;
module.link("./stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 10);
let Treatments;
module.link("./treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 11);
const collections = [Batches, Factors, GameLobbies, Games, LobbyConfigs, PlayerInputs, PlayerRounds, PlayerStages, Players, Rounds, Stages, Treatments];
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"default-schemas.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/default-schemas.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  IdSchema: () => IdSchema,
  ArchivedSchema: () => ArchivedSchema,
  DebugModeSchema: () => DebugModeSchema,
  TimestampSchema: () => TimestampSchema,
  CreatorSchema: () => CreatorSchema,
  UserDataSchema: () => UserDataSchema,
  PolymorphicSchema: () => PolymorphicSchema,
  HasManyByRef: () => HasManyByRef,
  BelongsTo: () => BelongsTo
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let inflection;
module.link("inflection", {
  default(v) {
    inflection = v;
  }

}, 1);
const IdSchema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id
  }
});
const ArchivedSchema = new SimpleSchema({
  archivedById: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,

    autoValue() {
      if (this.field("archivedAt").isSet) {
        return this.userId;
      }

      return undefined;
    }

  },
  archivedAt: {
    type: Date,
    label: "Archived at",
    optional: true
  }
});
const DebugModeSchema = new SimpleSchema({
  debugMode: {
    type: Boolean,
    defaultValue: false
  }
});
const TimestampSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    label: "Created at",
    // denyUpdate: true,
    index: true,

    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }

  },
  updatedAt: {
    type: Date,
    label: "Last updated at",
    optional: true,
    // denyInsert: true,
    index: true,

    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    }

  }
});
const CreatorSchema = new SimpleSchema({
  createdById: {
    type: String,
    label: "Created by",
    // denyUpdate: true,
    regEx: SimpleSchema.RegEx.Id,

    autoValue() {
      if (this.isInsert) {
        return this.isSet && this.isFromTrustedCode ? undefined : this.userId;
      }

      return undefined;
    },

    index: true
  },
  updatedById: {
    type: String,
    label: "Last updated by",
    optional: true,
    regEx: SimpleSchema.RegEx.Id,

    autoValue() {
      if (this.isUpdate) {
        return this.userId;
      }
    },

    index: true
  }
});
const UserDataSchema = new SimpleSchema({
  data: {
    type: Object,
    blackbox: true,
    defaultValue: {}
  }
});

const PolymorphicSchema = function (collTypes) {
  return new SimpleSchema({
    objectType: {
      type: String,
      allowedValues: collTypes,
      // denyUpdate: true,
      index: true
    },
    objectId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      // denyUpdate: true,
      index: true
    }
  });
};

const HasManyByRef = function (coll) {
  const camel = inflection.camelize(inflection.singularize(coll), true);
  const label = inflection.titleize(coll);
  const fieldName = "".concat(camel, "Ids");
  return new SimpleSchema({
    [fieldName]: {
      type: Array,
      defaultValue: [],
      label,
      index: true
    },
    ["".concat(fieldName, ".$")]: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "".concat(label, " Item")
    }
  });
};

const BelongsTo = function (coll) {
  let required = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const singular = inflection.singularize(coll);
  const camel = inflection.camelize(singular, true);
  const label = inflection.titleize(singular);
  const fieldName = "".concat(camel, "Id");
  return new SimpleSchema({
    [fieldName]: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label,
      // denyUpdate,
      index: true,
      optional: !required
    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"indexes.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/indexes.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let inflection;
module.link("inflection", {
  default(v) {
    inflection = v;
  }

}, 0);
let log;
module.link("../lib/log.js", {
  default(v) {
    log = v;
  }

}, 1);
let collections;
module.link("./collections.js", {
  collections(v) {
    collections = v;
  }

}, 2);
Meteor.startup(() => {
  // Add manual indexes here. Example:
  //
  // Batches.rawCollection().createIndex({
  //   "fieldname": 1
  // }, { unique: true })
  //
  // The following loop will try to add indexes marked in the Schemas
  //
  Meteor.setTimeout(() => {
    collections.forEach(coll => {
      if (!coll.schema) {
        return;
      }

      try {
        const name = inflection.titleize(coll._name);
        log.debug("Adding indexes to", name);

        for (const key in coll.schema._schema) {
          if (coll.schema._schema.hasOwnProperty(key)) {
            const def = coll.schema._schema[key];
            const desc = "\"".concat(name, "\" \u2013 { ").concat(key, ": { index: ").concat(def.index, " } }"); // No index wanted

            if (def.index === undefined) {
              continue;
            } // Wanting index to be removed, not supported


            if (def.index === false) {
              log.warn("{ index: false } not supported on ".concat(desc));
              continue;
            } // Only 1, -1 and true values supported


            if (!(def.index === true || def.index === 1 || def.index === -1)) {
              log.warn("unknown index value on ".concat(desc));
              continue;
            } // Add opts supported by SimpleSchema:index


            const opts = {};

            if (def.sparse === true) {
              options.sparse = true;
            }

            if (def.unique === true) {
              opts.unique = true;
            }

            let index = {};

            switch (def.index) {
              case 1:
              case true:
                index = {
                  [key]: 1
                };
                break;

              case -1:
                index = {
                  [key]: -1
                };
                break;
            }

            log.debug("  - createIndex(".concat(JSON.stringify(index), ", ").concat(JSON.stringify(opts), ")"));
            coll.rawCollection().createIndex(index, opts, (err, res) => {
              if (err && err.codeName !== "IndexOptionsConflict") {
                log.error("can't create index: ".concat(name, "/").concat(JSON.stringify(index), ". ").concat(err));
              }
            });
          }
        }
      } catch (error) {}
    });
  }, 1000);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"schema-helpers.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/schema-helpers.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Collection2;
module.link("meteor/aldeed:collection2", {
  default(v) {
    Collection2 = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
// Must be unique scoped by other field (for given value of passed field,
// The current field should be unique). For ex:
//   Name: {
//     Type: String,
//     ScopedUnique: "orgId"
//   }
// Name must be unique for document with equal orgId.
// Documents with different orgId can have same name.
SimpleSchema.extendOptions(["scopedUnique"]);
Collection2.on("schema.attached", (collection, ss) => {
  if (ss.version >= 2) {
    ss.messageBox.messages({
      scopedUnique: "Already exists"
    });
  }

  ss.addValidator(function () {
    if (!this.isSet) {
      return;
    }

    const def = this.definition;
    const uniqueFieldScope = def.scopedUnique;

    if (!uniqueFieldScope) {
      return;
    }

    const val = this.field(uniqueFieldScope).value;
    const key = this.key;

    if (collection.find({
      [uniqueFieldScope]: val,
      [key]: this.value
    }).count() > 0) {
      return "uniqueScoped";
    }
  });
}); // Extend the schema options allowed by SimpleSchema

SimpleSchema.extendOptions(["denyInsert", "denyUpdate"]);
Collection2.on("schema.attached", (collection, ss) => {
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === "function") {
    ss.messageBox.messages({
      en: {
        insertNotAllowed: "{{label}} cannot be set during an insert",
        updateNotAllowed: "{{label}} cannot be set during an update"
      }
    });
  }

  ss.addValidator(function schemaDenyValidator() {
    if (!this.isSet) return;
    const def = this.definition;
    if (def.denyInsert && this.isInsert) return "insertNotAllowed";
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return "updateNotAllowed";
  });
}); // Extend the schema options allowed by SimpleSchema

SimpleSchema.extendOptions(["index", // one of Number, String, Boolean
"unique", // Boolean
"sparse" // Boolean
]);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"admin":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/admin/methods.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
let yaml;
module.link("js-yaml", {
  default(v) {
    yaml = v;
  }

}, 0);
let Treatments;
module.link("../../api/treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 1);
let Factors;
module.link("../../api/factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 2);
let FactorTypes;
module.link("../../api/factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 3);
let LobbyConfigs;
module.link("../../api/lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 4);
let bootstrap;
module.link("../../startup/server/bootstrap.js", {
  bootstrap(v) {
    bootstrap = v;
  }

}, 5);
let log;
module.link("../../lib/log.js", {
  default(v) {
    log = v;
  }

}, 6);
const userColls = ["meteor_accounts_loginServiceConfiguration", "users"];
const keepPartial = ["treatments", "factors", "factor_types", "lobby_configs"];
const deleteColls = ["game_lobbies", "player_inputs", "batches", "rounds", "counters", "games", "player_rounds", "players", "player_stages", "player_logs", "stages"].concat(keepPartial);

const localTypeForImported = data => {
  return factorTypeId => {
    const importedType = data.factorTypes.find(t => t._id === factorTypeId);

    if (!importedType) {
      log.warn("could not find corresponding factorTypeId", factorTypeId);
      return;
    }

    const type = FactorTypes.findOne({
      name: importedType.name
    });

    if (!type) {
      log.warn("could not import factor type, no correponding type");
      return;
    }

    return type._id;
  };
};

const localFactorForImported = data => {
  return factorId => {
    const importedFactor = data.factors.find(t => t._id === factorId);

    if (!importedFactor) {
      log.warn("could not import factor, no correponding imported factor");
      return;
    }

    const {
      value,
      factorTypeId: importedFactorTypeId
    } = importedFactor;
    const factorTypeId = localTypeForImported(data)(importedFactorTypeId);

    if (!factorTypeId) {
      log.warn("could not convert factor types");
      return;
    }

    const factor = Factors.findOne({
      value,
      factorTypeId
    });

    if (!factor) {
      log.warn("could not import factor, no correponding factor");
      return;
    }

    return factor._id;
  };
};

const archivedUpdate = (archivedAt, existingArchivedAt) => !!archivedAt === !!existingArchivedAt ? null : archivedAt ? {
  $set: {
    archivedAt: new Date()
  }
} : {
  $unset: {
    archivedAt: true,
    archivedById: true
  }
};

Meteor.methods({
  adminImportConfiguration(_ref) {
    let {
      text
    } = _ref;
    log.debug("Import starting.");
    const data = yaml.safeLoad(text);
    const convertFactorTypeId = localTypeForImported(data);
    const convertFactorId = localFactorForImported(data);
    (data.factorTypes || []).forEach(f => {
      const {
        archivedAt,
        name
      } = f;
      const exists = FactorTypes.findOne({
        name
      });

      if (exists) {
        log.debug("exists FactorTypes");
        const query = archivedUpdate(archivedAt, exists.archivedAt);

        if (query) {
          FactorTypes.update(exists._id, query);
        }

        return;
      }

      log.debug("new FactorTypes");
      FactorTypes.insert(f);
    });
    (data.factors || []).forEach(f => {
      const {
        factorTypeId: importedFactorTypeId,
        value
      } = f;
      const factorTypeId = convertFactorTypeId(importedFactorTypeId);

      if (!factorTypeId) {
        log.debug("could not convert factorTypeIds");
        return;
      }

      const exists = Factors.findOne({
        factorTypeId,
        value
      });

      if (exists) {
        log.debug("exists Factors");
        return;
      }

      const params = _objectSpread({}, f, {
        factorTypeId
      });

      log.debug("new Factors", params);
      Factors.insert(params);
    });
    (data.treatments || []).forEach(t => {
      const {
        archivedAt,
        factorIds: importedFactorIds
      } = t;
      const factorIds = importedFactorIds.map(convertFactorId);

      if (_.compact(factorIds).length !== importedFactorIds.length) {
        log.debug("could not convert factorIds");
        return;
      }

      const exists = Treatments.findOne({
        factorIds
      });

      if (exists) {
        log.debug("exists Treatments");
        const query = archivedUpdate(archivedAt, exists.archivedAt);

        if (query) {
          Treatments.update(exists._id, query);
        }

        return;
      }

      const params = _objectSpread({}, t, {
        factorIds
      });

      log.debug("new Treatments", params);
      Treatments.insert(params);
    });
    (data.lobbyConfigs || []).forEach(l => {
      const query = _.pick(l, "timeoutType", "timeoutInSeconds", "timeoutStrategy", "timeoutBots", "extendCount");

      const exists = LobbyConfigs.findOne(query);

      if (exists) {
        log.debug("exists LobbyConfigs");
        const query = archivedUpdate(l.archivedAt, exists.archivedAt);

        if (query) {
          LobbyConfigs.update(exists._id, query);
        }

        return;
      }

      log.debug("new LobbyConfigs");
      LobbyConfigs.insert(l);
    });
    log.debug("Import done.");
  },

  adminExportConfiguration() {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const out = {
      treatments: [],
      factorTypes: [],
      factors: [],
      lobbyConfigs: []
    };
    const treatments = Treatments.find().fetch();
    treatments.forEach(t => out.treatments.push(_.pick(t, "name", "factorIds", "archivedAt")));
    const factorTypes = FactorTypes.find().fetch();
    factorTypes.forEach(t => out.factorTypes.push(_.pick(t, "_id", "name", "description", "required", "type", "min", "max", "archivedAt")));
    const factors = Factors.find().fetch();
    factors.forEach(f => out.factors.push(_.pick(f, "_id", "name", "value", "factorTypeId", "archivedAt")));
    const lobbyConfigs = LobbyConfigs.find().fetch();
    lobbyConfigs.forEach(l => out.lobbyConfigs.push(_.pick(l, "name", "timeoutType", "timeoutInSeconds", "timeoutStrategy", "timeoutBots", "extendCount", "bacthIds", "gameLobbyIds", "archivedAt")));
    return yaml.safeDump(out);
  }

});

if (Meteor.isDevelopment || Meteor.settings.public.debug_resetDatabase) {
  Meteor.methods({
    adminResetDB(partial) {
      if (!this.userId) {
        throw new Error("unauthorized");
      }

      if (Meteor.isClient) {
        return;
      }

      const driver = MongoInternals.defaultRemoteCollectionDriver();
      const db = driver.mongo.db;
      db.listCollections().toArray(Meteor.bindEnvironment((err, colls) => {
        if (err) {
          console.error(err);
          return;
        }

        colls = _.sortBy(colls, c => c.name === "players" ? 0 : 1);
        colls.forEach(collection => {
          if (!deleteColls.includes(collection.name)) {
            return;
          }

          if (partial && keepPartial.includes(collection.name)) {
            return;
          }

          const coll = driver.open(collection.name);
          coll.rawCollection().drop();
        });
        db.listCollections().toArray(Meteor.bindEnvironment((err, colls) => {
          if (err) {
            console.error(err);
            return;
          }

          log.debug("Keeping:");
          colls.forEach(collection => {
            let extra = "";

            if (userColls.includes(collection.name)) {
              extra = "(used by admin login system)";
            }

            log.debug(" - " + collection.name, extra);
          });
          log.debug("Cleared DB");
          bootstrap();
        }));
      }));
    }

  });
}

Meteor.startup(() => {});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"batches":{"batches.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/batches/batches.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Batches: () => Batches,
  maxGamesCount: () => maxGamesCount,
  assignmentTypes: () => assignmentTypes
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let statusSchema;
module.link("./status-schema", {
  statusSchema(v) {
    statusSchema = v;
  }

}, 1);
let ArchivedSchema, TimestampSchema, HasManyByRef, DebugModeSchema;
module.link("../default-schemas", {
  ArchivedSchema(v) {
    ArchivedSchema = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  },

  HasManyByRef(v) {
    HasManyByRef = v;
  },

  DebugModeSchema(v) {
    DebugModeSchema = v;
  }

}, 2);
let Treatments;
module.link("../treatments/treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 3);
let Counter;
module.link("../../lib/counters", {
  Counter(v) {
    Counter = v;
  }

}, 4);

class BatchesCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.index = Counter.inc("batches");
    return super.insert(doc, callback);
  }

}

const Batches = new BatchesCollection("batches");
Batches.helpers({
  gameCount() {
    return this.assignment === "simple" ? this.simpleConfig.count : this.completeGameCount();
  },

  completeGameCount() {
    return _.reduce(this.completeConfig.treatments, (sum, t) => sum + t.count, 0);
  },

  duplicate() {
    const {
      assignment,
      simpleConfig,
      completeConfig
    } = this;
    Batches.insert({
      assignment,
      simpleConfig,
      completeConfig,
      status: "init"
    });
  }

});
const maxGamesCount = 10000000;
const assignmentTypes = {
  simple: "Simple",
  complete: "Complete"
};
Batches.schema = new SimpleSchema({
  // Auto-incremented number assigned to batches as they are created
  index: {
    type: SimpleSchema.Integer
  },
  assignment: {
    type: String,
    // "custom" not yet supported
    allowedValues: ["simple", "complete", "custom"]
  },
  full: {
    label: "Batch is full, all games are running",
    type: Boolean,
    defaultValue: false
  },
  runningAt: {
    label: "Time when batch started running",
    type: Date,
    optional: true
  },
  finishedAt: {
    label: "Time when batch finished running",
    type: Date,
    optional: true
  },
  // Simple configuration at init
  simpleConfig: {
    type: Object,
    optional: true,

    custom() {
      if (!this.value && this.field("assignment").value === "simple") {
        return "required";
      }
    }

  },
  "simpleConfig.count": {
    type: SimpleSchema.Integer,
    min: 1,
    max: maxGamesCount
  },
  "simpleConfig.treatments": {
    type: Array,
    minCount: 1,

    maxCount() {
      return Treatments.find().count();
    }

  },
  "simpleConfig.treatments.$": {
    type: Object
  },
  "simpleConfig.treatments.$._id": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "simpleConfig.treatments.$.lobbyConfigId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  // Complete configuration at init
  completeConfig: {
    type: Object,
    optional: true,

    custom() {
      if (!this.value && this.field("assignment").value === "complete") {
        return "required";
      }
    }

  },
  "completeConfig.treatments": {
    type: Array,
    minCount: 1,

    maxCount() {
      return Treatments.find().count();
    }

  },
  "completeConfig.treatments.$": {
    type: Object
  },
  "completeConfig.treatments.$._id": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "completeConfig.treatments.$.count": {
    type: SimpleSchema.Integer,
    minCount: 1,
    maxCount: maxGamesCount
  },
  "completeConfig.treatments.$.lobbyConfigId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  Batches.schema.extend(DebugModeSchema);
}

Batches.schema.extend(statusSchema);
Batches.schema.extend(TimestampSchema);
Batches.schema.extend(ArchivedSchema);
Batches.schema.extend(HasManyByRef("Games"));
Batches.schema.extend(HasManyByRef("GameLobbies"));
Batches.attachSchema(Batches.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/batches/hooks.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let config;
module.link("../../server", {
  config(v) {
    config = v;
  }

}, 0);
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 1);
let sendPlayersToNextBatches;
module.link("../games/create", {
  sendPlayersToNextBatches(v) {
    sendPlayersToNextBatches = v;
  }

}, 2);
let Games;
module.link("../games/games", {
  Games(v) {
    Games = v;
  }

}, 3);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 4);
let Treatments;
module.link("../treatments/treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 5);
let Batches;
module.link("./batches", {
  Batches(v) {
    Batches = v;
  }

}, 6);
// Create GameLobbies
Batches.after.insert(function (userId, batch) {
  let gameLobbies = [];

  switch (batch.assignment) {
    case "simple":
      _.times(batch.simpleConfig.count, index => {
        const treatment = Random.choice(batch.simpleConfig.treatments);
        const {
          _id: treatmentId,
          lobbyConfigId
        } = treatment;
        gameLobbies.push({
          treatmentId,
          lobbyConfigId,
          index
        });
      });

      break;

    case "complete":
      batch.completeConfig.treatments.forEach((_ref) => {
        let {
          count,
          _id,
          lobbyConfigId
        } = _ref;

        _.times(count, () => {
          gameLobbies.push({
            treatmentId: _id,
            lobbyConfigId
          });
        });
      });
      gameLobbies = _.shuffle(gameLobbies);
      gameLobbies.forEach((l, index) => {
        l.index = index;
      });
      break;

    default:
      console.error("Batches.after: unknown assignment: " + batch.assignment);
      break;
  }

  const gameLobbyIds = gameLobbies.map(l => {
    l._id = Random.id();
    l.status = batch.status;
    l.batchId = batch._id; // This is trully horrific. Sorry.
    // The debug mode is assigned asynchronously onto the batch, which might happen
    // just as this on insert hook is called. Sorry.

    const batchUpdated = Batches.findOne(batch._id);
    l.debugMode = batchUpdated.debugMode;
    const treatment = Treatments.findOne(l.treatmentId);
    l.availableCount = treatment.factor("playerCount").value;
    const botsCountCond = treatment.factor("botsCount");

    if (botsCountCond) {
      const botsCount = botsCountCond.value;

      if (botsCount > l.availableCount) {
        throw "Trying to create a game with more bots than players";
      }

      if (botsCount === l.availableCount) {
        //throw "Creating a game with only bots...";
        //Would be good to display a message "Are you sure you want to create a game with only bots?"
        console.log("Warning: Creating a game with only bots!");
      }

      const botNames = config.bots && _.keys(config.bots);

      if (!config.bots || botNames.length === 0) {
        throw "Trying to create a game with bots, but no bots defined";
      }

      l.playerIds = [];

      _.times(botsCount, () => {
        const params = {
          id: Random.id(),
          gameLobbyId: l._id,
          readyAt: new Date(),
          bot: _.shuffle(botNames)[0]
        };
        console.info("Creating bot:", params);
        const playerId = Players.insert(params);
        l.playerIds.push(playerId);
      });

      l.queuedPlayerIds = l.playerIds;
    }

    return GameLobbies.insert(l);
  });
  Batches.update(batch._id, {
    $set: {
      gameLobbyIds
    }
  });
}); // Update status on Games and GameLobbies

Batches.after.update(function (userId, _ref2, fieldNames, modifier, options) {
  let {
    _id: batchId,
    status
  } = _ref2;

  if (!fieldNames.includes("status")) {
    return;
  }

  [Games, GameLobbies].forEach(coll => {
    coll.update({
      batchId,
      status: {
        $nin: ["finished", "cancelled", "failed", "custom"]
      }
    }, {
      $set: {
        status
      }
    }, {
      multi: true
    });
  });

  if (status !== "cancelled") {
    return;
  }

  const games = Games.find({
    batchId
  }).fetch();

  const gplayerIds = _.flatten(_.pluck(games, "playerIds"));

  Players.update({
    _id: {
      $in: gplayerIds
    },
    exitAt: {
      $exists: false
    }
  }, {
    $set: {
      exitStatus: "gameCancelled",
      exitAt: new Date()
    }
  }, {
    multi: true
  });
  const gameLobbies = GameLobbies.find({
    batchId,
    gameId: {
      $exists: false
    }
  }).fetch();

  if (gameLobbies.length === 0) {
    return;
  }

  const glplayerIds = _.flatten(_.pluck(gameLobbies, "queuedPlayerIds"));

  const players = Players.find({
    _id: {
      $in: glplayerIds
    },
    exitAt: {
      $exists: false
    }
  }).fetch();

  const playerIds = _.pluck(players, "_id");

  sendPlayersToNextBatches(playerIds, batchId, gameLobbies[0]);
}, {
  fetchPrevious: false
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/batches/methods.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createBatch: () => createBatch,
  duplicateBatch: () => duplicateBatch,
  updateBatch: () => updateBatch,
  updateBatchStatus: () => updateBatchStatus
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let Batches;
module.link("./batches", {
  Batches(v) {
    Batches = v;
  }

}, 2);
let GameLobbies;
module.link("../game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 3);
let Games;
module.link("../games/games.js", {
  Games(v) {
    Games = v;
  }

}, 4);
let IdSchema;
module.link("../default-schemas", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 5);
const createBatch = new ValidatedMethod({
  name: "Batches.methods.create",
  validate: Batches.schema.omit("gameIds", "gameLobbyIds", "status", "createdAt", "updatedAt", "debugMode", "full", "index").validator(),

  run(batch) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    Batches.insert(batch, {
      autoConvert: false,
      filter: false,
      validate: false
    });
  }

});
const duplicateBatch = new ValidatedMethod({
  name: "Batches.methods.duplicate",
  validate: IdSchema.validator(),

  run(_ref) {
    let {
      _id
    } = _ref;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);
    batch.duplicate();
  }

});
const updateBatch = new ValidatedMethod({
  name: "Batches.methods.updateBatch",
  validate: new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  }).extend(IdSchema).validator(),

  run(_ref2) {
    let {
      _id,
      archived
    } = _ref2;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);

    if (!batch) {
      throw new Error("not found");
    }

    const $set = {},
          $unset = {};

    if (archived !== undefined) {
      if (archived) {
        if (batch.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!batch.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};

    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }

    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }

    if (Object.keys(modifier).length === 0) {
      return;
    }

    Batches.update(_id, modifier);
  }

});
const updateBatchStatus = new ValidatedMethod({
  name: "Batches.methods.updateStatus",
  validate: Batches.schema.pick("status").extend(IdSchema).validator(),

  run(_ref3) {
    let {
      _id,
      status
    } = _ref3;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const batch = Batches.findOne(_id);

    if (!batch) {
      throw new Error("not found");
    }

    if (status === "init") {
      throw new Error("invalid");
    }

    const $set = {
      status
    };

    if (status === "running") {
      $set.runningAt = new Date();
      GameLobbies.update({
        batchId: _id
      }, {
        $set: {
          status: "running"
        }
      }, {
        multi: true
      });
    }

    Batches.update(_id, {
      $set
    });
  }

});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  module.export({
    setBatchInDebugMode: () => setBatchInDebugMode
  });
  const setBatchInDebugMode = new ValidatedMethod({
    name: "Batches.methods.debugMode",
    validate: IdSchema.validator(),

    run(_ref4) {
      let {
        _id
      } = _ref4;

      if (!this.userId) {
        throw new Error("unauthorized");
      }

      const batch = Batches.findOne(_id);

      if (!batch) {
        throw new Error("not found");
      }

      Batches.update(_id, {
        $set: {
          debugMode: true
        }
      });
      GameLobbies.update({
        batchId: _id
      }, {
        $set: {
          debugMode: true
        }
      });
      Games.update({
        batchId: _id
      }, {
        $set: {
          debugMode: true
        }
      });
    }

  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"status-schema.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/batches/status-schema.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  statusSchema: () => statusSchema
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
const statusSchema = new SimpleSchema({
  status: {
    type: String,
    allowedValues: ["init", // Batch created, not running yet
    "running", // Batch is running
    // NOTE(np): paused: for now, we don't support paused because we need to do something about timers
    // "paused", // Batch has been pause, ongoing games keep on going but no more new players are accepted. Can be restarted.
    "finished", // Batch has finished and cannot be restarted
    // NOTE(np): cancelled might break a game if it's running at the moment, gotta be careful
    "cancelled", // Batch was cancelled and cannot be restarted
    "failed", "custom" // used for game.end("custom reason")
    ],
    defaultValue: "init",
    index: 1
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/batches/server/publications.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let GameLobbies;
module.link("../../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 0);
let Games;
module.link("../../games/games", {
  Games(v) {
    Games = v;
  }

}, 1);
let Rounds;
module.link("../../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 2);
let Stages;
module.link("../../stages/stages", {
  Stages(v) {
    Stages = v;
  }

}, 3);
let Batches;
module.link("../batches", {
  Batches(v) {
    Batches = v;
  }

}, 4);
Meteor.publish("admin-batches", function (props) {
  if (!this.userId) {
    return null;
  }

  if (!props || props.archived === undefined) {
    return Batches.find();
  }

  return Batches.find({
    archivedAt: {
      $exists: Boolean(props.archived)
    }
  });
});
Meteor.publish("admin-batch", function (_ref) {
  let {
    batchId
  } = _ref;

  if (!this.userId) {
    return null;
  }

  if (!batchId) {
    return null;
  }

  return [GameLobbies.find({
    batchId
  }), Games.find({
    batchId
  })];
});
Meteor.publish("admin-batch-game", function (_ref2) {
  let {
    gameId
  } = _ref2;

  if (!this.userId) {
    return null;
  }

  if (!gameId) {
    return null;
  }

  return [Rounds.find({
    gameId
  }), Stages.find({
    gameId
  })];
});
Meteor.publish("runningBatches", function (_ref3) {
  let {
    playerId
  } = _ref3;
  return Batches.find({
    status: "running",
    full: false
  }, {
    fields: {
      _id: 1,
      full: 1
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"factor-types":{"factor-types.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factor-types/factor-types.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FactorTypes: () => FactorTypes
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let ArchivedSchema, TimestampSchema;
module.link("../default-schemas.js", {
  ArchivedSchema(v) {
    ArchivedSchema = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  }

}, 1);
const FactorTypes = new Mongo.Collection("factor_types");
FactorTypes.helpers({}); // requiredFactors hold a list of factors keys that are required by
// Empirica core to be able to run a game.
// Required factors are:
// -`playerCount` determines how many players participate in a game and is
//   therefore critical to run a game.

FactorTypes.requiredTypes = ["playerCount"];
FactorTypes.types = ["String", "Integer", "Number", "Boolean"];
FactorTypes.schema = new SimpleSchema({
  required: {
    type: Boolean
  },
  name: {
    type: String,
    max: 256,
    regEx: /^[a-z]+[a-zA-Z0-9]*$/,
    index: true,
    unique: true,

    custom() {
      if (this.isSet && FactorTypes.find({
        name: this.value
      }).count() > 0) {
        return "notUnique";
      }
    }

  },
  description: {
    type: String,
    min: 1,
    max: 2048
  },
  type: {
    type: String,
    allowedValues: FactorTypes.types
  },
  min: {
    type: Number,
    optional: true
  },
  max: {
    type: Number,
    optional: true
  }
});
FactorTypes.schema.messageBox.messages({
  en: {
    notUnique: "{{label}} already exists."
  }
});
FactorTypes.schema.extend(ArchivedSchema);
FactorTypes.schema.extend(TimestampSchema);
FactorTypes.attachSchema(FactorTypes.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factor-types/hooks.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let FactorTypes;
module.link("./factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 0);
let Factors;
module.link("../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 1);
FactorTypes.after.insert(function (userId, factorType) {
  const {
    _id: factorTypeId,
    type
  } = factorType;

  if (type === "Boolean") {
    [true, false].forEach(value => Factors.insert({
      factorTypeId,
      value
    }));
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factor-types/methods.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createFactorType: () => createFactorType,
  updateFactorType: () => updateFactorType
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let Factors;
module.link("../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 2);
let FactorTypes;
module.link("./factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 3);
let IdSchema;
module.link("../default-schemas.js", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 4);
const createFactorType = new ValidatedMethod({
  name: "FactorTypes.methods.create",
  validate: FactorTypes.schema.omit("createdAt", "updatedAt").extend(new SimpleSchema({
    initialValues: {
      type: Array,
      optional: true
    },
    "initialValues.$": {
      type: SimpleSchema.oneOf({
        type: String,
        scopedUnique: "type"
      }, {
        type: SimpleSchema.Integer,
        scopedUnique: "type"
      }, {
        type: Number,
        scopedUnique: "type"
      }, {
        type: Boolean,
        scopedUnique: "type"
      })
    }
  })).validator(),

  run(factorType) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const {
      initialValues
    } = factorType;
    const factorTypeId = FactorTypes.insert(_.omit(factorType, "initialValues"), {
      autoConvert: false
    });
    initialValues.forEach(value => Factors.insert({
      factorTypeId,
      value
    }));
  }

});
const updateFactorType = new ValidatedMethod({
  name: "FactorTypes.methods.update",
  validate: new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  }).extend(IdSchema).validator(),

  run(_ref) {
    let {
      _id,
      archived
    } = _ref;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const factorType = FactorTypes.findOne(_id);

    if (!factorType) {
      throw new Error("not found");
    }

    const $set = {},
          $unset = {};

    if (archived !== undefined) {
      if (archived) {
        if (factorType.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!factorType.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};

    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }

    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }

    if (Object.keys(modifier).length === 0) {
      return;
    }

    FactorTypes.update(_id, modifier);
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"bootstrap.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factor-types/server/bootstrap.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let FactorTypes;
module.link("../factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 0);
let log;
module.link("../../../lib/log.js", {
  default(v) {
    log = v;
  }

}, 1);
let bootstrapFunctions;
module.link("../../../startup/server/bootstrap.js", {
  bootstrapFunctions(v) {
    bootstrapFunctions = v;
  }

}, 2);
const defaultTypes = [{
  name: "playerCount",
  description: "The Number of players participating in the given game.",
  type: "Integer",
  min: 1,
  required: true
}];
bootstrapFunctions.push(() => {
  defaultTypes.forEach(type => {
    const exists = FactorTypes.findOne({
      name: type.name
    });

    if (exists) {
      return;
    }

    log.info("Inserting default Factor Type: ".concat(type.name));

    try {
      FactorTypes.insert(type);
    } catch (error) {
      log.error("Failed to insert '".concat(type.name, "' default Factor Type: ").concat(err));
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factor-types/server/publications.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let FactorTypes;
module.link("../factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 0);
Meteor.publish("admin-factor-types", function () {
  if (!this.userId) {
    return null;
  }

  return FactorTypes.find();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"factors":{"factors.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factors/factors.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Factors: () => Factors,
  typeConversion: () => typeConversion
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let ArchivedSchema, BelongsTo, TimestampSchema;
module.link("../default-schemas.js", {
  ArchivedSchema(v) {
    ArchivedSchema = v;
  },

  BelongsTo(v) {
    BelongsTo = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  }

}, 1);
let FactorTypes;
module.link("../factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 2);
const Factors = new Mongo.Collection("factors");
Factors.helpers({
  label() {
    let label = this.name;
    const value = String(this.value);

    if (label !== value) {
      label += " (".concat(value, ")");
    }

    return label;
  },

  factorType() {
    return FactorTypes.findOne(this.factorTypeId);
  },

  factorTypeName() {
    const t = this.factorType();
    return t && t.name;
  },

  fullLabel() {
    return "".concat(this.factorTypeName(), ": ").concat(this.label());
  }

});
const typeConversion = {
  Integer: SimpleSchema.Integer,
  String: String,
  Number: Number,
  Boolean: Boolean
};

Factors.valueValidation = function (factorType, value, simpleSchmemaType) {
  const type = typeConversion[factorType.type];

  if (simpleSchmemaType && simpleSchmemaType !== type) {
    return;
  }

  const fieldSchema = {
    type
  };

  if (factorType.min) {
    fieldSchema.min = factorType.min;
  }

  if (factorType.max) {
    fieldSchema.max = factorType.max;
  }

  const schema = {
    value: fieldSchema
  };
  const val = new SimpleSchema(schema).newContext();
  val.validate({
    value
  });

  if (!val.isValid()) {
    return val.validationErrors();
  }

  if (Factors.find({
    factorTypeId: factorType._id,
    value
  }).count() > 0) {
    return [{
      name: "value",
      type: "scopedUnique"
    }];
  }
};

const valueValidation = function () {
  if (this.key !== "value") {
    return;
  }

  const factorTypeId = this.field("factorTypeId").value;
  const factorType = FactorTypes.findOne(factorTypeId);
  const value = this.value;
  const errors = Factors.valueValidation(factorType, value);

  if (errors) {
    this.addValidationErrors(errors);
    return false;
  }
};

Factors.schema = new SimpleSchema({
  name: {
    type: String,

    autoValue() {
      if (!this.isSet && (this.isInsert || Meteor.isClient)) {
        return String(this.field("value").value).slice(0, 32);
      }
    },

    max: 256,
    regEx: /^[a-zA-Z0-9_\.]+$/
  },
  value: {
    type: SimpleSchema.oneOf({
      type: String
    }, {
      type: SimpleSchema.Integer
    }, {
      type: Number
    }, {
      type: Boolean
    })
  }
});
Factors.schema.addValidator(valueValidation);
Factors.schema.extend(ArchivedSchema);
Factors.schema.extend(BelongsTo("FactorTypes"));
Factors.schema.extend(TimestampSchema);
Factors.attachSchema(Factors.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factors/methods.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createFactor: () => createFactor,
  updateFactor: () => updateFactor
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Factors;
module.link("./factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 2);
let FactorTypes;
module.link("../factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 3);
let IdSchema;
module.link("../default-schemas.js", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 4);
let handleFactorValueErrorMessage;
module.link("../../lib/utils.js", {
  handleFactorValueErrorMessage(v) {
    handleFactorValueErrorMessage = v;
  }

}, 5);
const createFactor = new ValidatedMethod({
  name: "Factors.methods.create",
  validate: Factors.schema.omit("createdAt", "updatedAt").validator(),

  run(factor) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const factorType = FactorTypes.findOne(factor.factorTypeId);

    if (!factorType) {
      throw new Error("not found");
    }

    const errors = Factors.valueValidation(factorType, factor.value);

    if (errors) {
      throw new Error(errors.map(e => handleFactorValueErrorMessage(e)).join("\n"));
    }

    Factors.insert(factor, {
      autoConvert: false
    });
  }

});
const updateFactor = new ValidatedMethod({
  name: "Factors.methods.update",
  validate: Factors.schema.pick("name").extend(IdSchema).extend(new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  })).validator(),

  run(_ref) {
    let {
      _id,
      name,
      archived
    } = _ref;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const factor = Factors.findOne(_id);

    if (!factor) {
      throw new Error("not found");
    }

    const $set = {},
          $unset = {};

    if (name !== undefined) {
      $set.name = name;
    }

    if (archived !== undefined) {
      if (archived) {
        if (factor.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!factor.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};

    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }

    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }

    if (Object.keys(modifier).length === 0) {
      return;
    }

    Factors.update(_id, modifier);
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/factors/server/publications.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Factors;
module.link("../factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 0);
Meteor.publish("admin-factors", function () {
  if (!this.userId) {
    return null;
  }

  return [Factors.find()];
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"game-lobbies":{"game-lobbies.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/game-lobbies/game-lobbies.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  GameLobbies: () => GameLobbies
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let statusSchema;
module.link("../batches/status-schema", {
  statusSchema(v) {
    statusSchema = v;
  }

}, 1);
let Batches;
module.link("../batches/batches", {
  Batches(v) {
    Batches = v;
  }

}, 2);
let BelongsTo, HasManyByRef, TimestampSchema;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  HasManyByRef(v) {
    HasManyByRef = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  }

}, 3);
let DebugModeSchema, UserDataSchema;
module.link("../default-schemas.js", {
  DebugModeSchema(v) {
    DebugModeSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  }

}, 4);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 5);
let Treatments;
module.link("../treatments/treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 6);
const GameLobbies = new Mongo.Collection("game_lobbies");
GameLobbies.helpers({
  players() {
    return Players.find({
      _id: {
        $in: this.playerIds
      }
    }).fetch();
  },

  batch() {
    return Batches.findOne({
      _id: this.batchId
    });
  },

  treatment() {
    return Treatments.findOne({
      _id: this.treatmentId
    });
  }

});
GameLobbies.schema = new SimpleSchema({
  // index allows for an ordering of lobbies so we know which one
  // to choose from next
  index: {
    type: SimpleSchema.Integer,
    min: 0,
    label: "Position"
  },
  // availableCount tells us how many slots are available in this lobby
  // (== treatment.playerCount)
  availableCount: {
    type: SimpleSchema.Integer,
    min: 0,
    label: "Available Slots Count"
  },
  timeoutStartedAt: {
    label: "Time the first player arrived in the lobby",
    type: Date,
    optional: true
  },
  timedOutAt: {
    label: "Time when the lobby timed out and was cancelled",
    type: Date,
    optional: true,
    index: 1
  },
  endReason: {
    label: "Ended Reason",
    type: String,
    optional: true,
    regEx: /[a-zA-Z0-9_]+/
  },
  // Queued players are players that have been associated with the lobby
  // but are not confirmed for the game yet. playerIds is used for confirmed
  // players
  // There might be more queued player than availableCount as we
  // allow overbooking to make games start faster.
  queuedPlayerIds: {
    type: Array,
    defaultValue: [],
    label: "Queued Players",
    index: true
  },
  "queuedPlayerIds.$": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Queued Player"
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  GameLobbies.schema.extend(DebugModeSchema);
}

GameLobbies.schema.extend(UserDataSchema);
GameLobbies.schema.extend(TimestampSchema); // playerIds tells us how many players are ready to start (finished intro)
// Once playerIds.length == availableCount, the game starts. Player that are
// queued but haven't made it past the intro in time will be led to the outro
// directly.

GameLobbies.schema.extend(HasManyByRef("Players"));
GameLobbies.schema.extend(BelongsTo("Games", false));
GameLobbies.schema.extend(BelongsTo("Treatments"));
GameLobbies.schema.extend(BelongsTo("Batches"));
GameLobbies.schema.extend(BelongsTo("LobbyConfigs")); // We are denormalizing the parent batch status in order to make clean queries

GameLobbies.schema.extend(statusSchema);
GameLobbies.attachSchema(GameLobbies.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/game-lobbies/hooks.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 0);
let Games;
module.link("../games/games", {
  Games(v) {
    Games = v;
  }

}, 1);
let LobbyConfigs;
module.link("../lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 2);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 3);
let createGameFromLobby;
module.link("../games/create", {
  createGameFromLobby(v) {
    createGameFromLobby = v;
  }

}, 4);
let checkBatchFull, checkForBatchFinished;
module.link("../games/hooks.js", {
  checkBatchFull(v) {
    checkBatchFull = v;
  },

  checkForBatchFinished(v) {
    checkForBatchFinished = v;
  }

}, 5);
// Check if batch is full or the game finished if this lobby timed out
GameLobbies.after.update(function (userId, _ref, fieldNames, modifier, options) {
  let {
    batchId
  } = _ref;

  if (!fieldNames.includes("timedOutAt")) {
    return;
  }

  checkBatchFull(batchId);
  checkForBatchFinished(batchId);
}); // Start the game if lobby full

GameLobbies.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (!(fieldNames.includes("playerIds") || fieldNames.includes("status") && doc.status == "running")) {
    return;
  }

  const gameLobby = this.transform();
  const humanPlayers = [];

  if (gameLobby.playerIds && gameLobby.playerIds.length > 0) {
    const players = Players.find({
      _id: {
        $in: gameLobby.playerIds
      }
    }).fetch();
    humanPlayers.push(...players.filter(p => !p.bot));
  }

  const readyPlayersCount = gameLobby.playerIds.length; // If the lobby timeout it hasn't started yet and the lobby isn't full yet
  // (single player), try to start the timeout timer.

  if (humanPlayers.length > 0 && gameLobby.availableCount != 1 && !gameLobby.timeoutStartedAt) {
    const lobbyConfig = LobbyConfigs.findOne(gameLobby.lobbyConfigId);

    if (lobbyConfig.timeoutType === "lobby") {
      GameLobbies.update(gameLobby._id, {
        $set: {
          timeoutStartedAt: new Date()
        }
      });
    }
  } // If the readyPlayersCount went to 0 (disconnections for example), reset the
  // lobby timeout.


  if (humanPlayers.length === 0 && gameLobby.timeoutStartedAt) {
    const lobbyConfig = LobbyConfigs.findOne(gameLobby.lobbyConfigId);

    if (lobbyConfig.timeoutType === "lobby") {
      GameLobbies.update(gameLobby._id, {
        $unset: {
          timeoutStartedAt: ""
        }
      });
    }
  } // If there are not enough players ready, wait


  if (readyPlayersCount < gameLobby.availableCount) {
    return;
  } // Game already created (?!)


  if (Games.find({
    gameLobbyId: gameLobby._id
  }).count() > 0) {
    return;
  } // Create Game


  createGameFromLobby(gameLobby);
}, {
  fetchPrevious: false
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/game-lobbies/methods.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updateGameLobbyData: () => updateGameLobbyData,
  earlyExitGameLobby: () => earlyExitGameLobby
});
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
let GameLobbies;
module.link("./game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 3);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 4);
let Batches;
module.link("../batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 5);
const updateGameLobbyData = new ValidatedMethod({
  name: "GameLobbies.methods.updateData",
  validate: new SimpleSchema({
    gameLobbyId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      gameLobbyId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const gameLobby = GameLobbies.findOne(gameLobbyId);

    if (!gameLobby) {
      throw new Error("game lobbies not found");
    } // TODO check can update this record game


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    GameLobbies.update(gameLobbyId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        gameLobbyId,
        gameLobby,
        key,
        value: val,
        prevValue: gameLobby.data && gameLobby.data[key],
        append
      });
    }
  }

});
const earlyExitGameLobby = new ValidatedMethod({
  name: "GameLobbies.methods.earlyExit",
  validate: new SimpleSchema({
    exitReason: {
      label: "Reason for Exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    gameLobbyId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    status: {
      label: "Status for lobby after exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/,
      optional: true
    }
  }).validator(),

  run(_ref2) {
    let {
      exitReason,
      gameLobbyId,
      status
    } = _ref2;

    if (!Meteor.isServer) {
      return;
    }

    const gameLobby = GameLobbies.findOne(gameLobbyId);
    const exitStatus = status || "failed";

    if (!gameLobby) {
      throw new Error("gameLobby not found");
    }

    Players.update({
      gameLobbyId
    }, {
      $set: {
        exitAt: new Date(),
        exitStatus: exitStatus,
        exitReason
      }
    });
    GameLobbies.update(gameLobbyId, {
      $set: {
        status: exitStatus,
        endReason: exitReason
      }
    });
    const batch = Batches.findOne(gameLobby.batchId);
    const availableLobby = GameLobbies.findOne({
      $and: [{
        _id: {
          $in: batch.gameLobbyIds
        }
      }, {
        status: {
          $in: ["init", "running"]
        }
      }]
    }); // End batch if there is no available lobby

    if (!availableLobby) {
      Batches.update({
        gameLobbyIds: gameLobbyId
      }, {
        $set: {
          status: exitStatus,
          finishedAt: new Date()
        }
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"cron.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/game-lobbies/server/cron.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 0);
let GameLobbies;
module.link("../game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 1);
let LobbyConfigs;
module.link("../../lobby-configs/lobby-configs", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 2);
let Players;
module.link("../../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 3);
let createGameFromLobby;
module.link("../../games/create.js", {
  createGameFromLobby(v) {
    createGameFromLobby = v;
  }

}, 4);
let Cron;
module.link("../../../startup/server/cron.js", {
  default(v) {
    Cron = v;
  }

}, 5);

const checkLobbyTimeout = (log, lobby, lobbyConfig) => {
  // Timeout hasn't started yet
  if (!lobby.timeoutStartedAt) {
    return;
  }

  const now = moment();
  const startTimeAt = moment(lobby.timeoutStartedAt);
  const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
  const ended = now.isSameOrAfter(endTimeAt);

  if (!ended) {
    return;
  }

  switch (lobbyConfig.timeoutStrategy) {
    case "fail":
      GameLobbies.update(lobby._id, {
        $set: {
          timedOutAt: new Date(),
          status: "failed"
        }
      });
      Players.update({
        _id: {
          $in: lobby.queuedPlayerIds
        }
      }, {
        $set: {
          exitStatus: "gameLobbyTimedOut",
          exitAt: new Date()
        }
      }, {
        multi: true
      });
      break;

    case "ignore":
      createGameFromLobby(lobby);
      break;
    // case "bots": {
    //   break;
    // }

    default:
      log.error("unknown LobbyConfig.timeoutStrategy: ".concat(lobbyConfig.timeoutStrategy));
  }
};

const checkIndividualTimeout = (log, lobby, lobbyConfig) => {
  const now = moment();
  Players.find({
    _id: {
      $in: lobby.playerIds
    }
  }).forEach(player => {
    const startTimeAt = moment(player.timeoutStartedAt);
    const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
    const ended = now.isSameOrAfter(endTimeAt);

    if (!ended || player.timeoutWaitCount <= lobbyConfig.extendCount) {
      return;
    }

    Players.update(player._id, {
      $set: {
        exitStatus: "playerLobbyTimedOut",
        exitAt: new Date()
      }
    });
    GameLobbies.update(lobby._id, {
      $pull: {
        playerIds: player._id // We keep the player in queuedPlayerIds so they will still have the
        // fact they were in a lobby available in the UI, and so we can show
        // them the exit steps.

      }
    });
  });
};

Cron.add({
  name: "Check lobby timeouts",
  interval: 1000,
  task: function (log) {
    const query = {
      status: "running",
      gameId: {
        $exists: false
      },
      timedOutAt: {
        $exists: false
      }
    };
    GameLobbies.find(query).forEach(lobby => {
      const lobbyConfig = LobbyConfigs.findOne(lobby.lobbyConfigId);

      switch (lobbyConfig.timeoutType) {
        case "lobby":
          checkLobbyTimeout(log, lobby, lobbyConfig);
          break;

        case "individual":
          checkIndividualTimeout(log, lobby, lobbyConfig);
          break;

        default:
          log.error("unknown LobbyConfig.timeoutType: ".concat(lobbyConfig.timeoutType));
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/game-lobbies/server/publications.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let publishComposite;
module.link("meteor/reywood:publish-composite", {
  publishComposite(v) {
    publishComposite = v;
  }

}, 0);
let Factors;
module.link("../../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 1);
let LobbyConfigs;
module.link("../../lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 2);
let Players;
module.link("../../players/players", {
  Players(v) {
    Players = v;
  }

}, 3);
let Treatments;
module.link("../../treatments/treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 4);
let GameLobbies;
module.link("../game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 5);
publishComposite("gameLobby", function (_ref) {
  let {
    playerId
  } = _ref;
  return {
    find() {
      return Players.find(playerId);
    },

    children: [{
      find(_ref2) {
        let {
          gameLobbyId
        } = _ref2;
        return GameLobbies.find({
          _id: gameLobbyId
        });
      },

      children: [{
        find(_ref3) {
          let {
            treatmentId
          } = _ref3;
          return Treatments.find(treatmentId);
        },

        children: [{
          find(_ref4) {
            let {
              factorIds
            } = _ref4;
            return Factors.find({
              _id: {
                $in: factorIds
              }
            });
          }

        }]
      }, {
        find(_ref5) {
          let {
            lobbyConfigId
          } = _ref5;
          return LobbyConfigs.find(lobbyConfigId);
        }

      }]
    }]
  };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"games":{"augment.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/augment.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  augmentGameObject: () => augmentGameObject
});
let Stages;
module.link("../stages/stages", {
  Stages(v) {
    Stages = v;
  }

}, 0);
let augmentPlayerStageRound;
module.link("../player-stages/augment", {
  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  }

}, 1);
let Rounds;
module.link("../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 2);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 3);

const augmentGameObject = (_ref) => {
  let {
    game,
    treatment,
    round = undefined,
    stage = undefined,
    firstRoundId = undefined,
    currentStageId = undefined
  } = _ref;
  let gameTreatment = null,
      gamePlayers = null,
      gameRounds = null,
      gameStages = null;
  Object.defineProperties(game, {
    treatment: {
      get() {
        if (!gameTreatment) {
          gameTreatment = treatment.factorsObject();
        }

        return gameTreatment;
      }

    },
    players: {
      get() {
        if (!gamePlayers) {
          gamePlayers = Players.find({
            _id: {
              $in: game.playerIds
            }
          }).fetch();

          if (firstRoundId) {
            round = Rounds.findOne(firstRoundId);
            stage = round.stages.find(s => s._id === currentStageId);
          }

          gamePlayers.forEach(player => {
            player.round = _.extend({}, round);
            player.stage = _.extend({}, stage);
            augmentPlayerStageRound(player, player.stage, player.round, game);
          });
        }

        return gamePlayers;
      }

    },
    rounds: {
      get() {
        if (!gameRounds) {
          gameRounds = Rounds.find({
            gameId: game._id
          }).fetch();
          gameRounds.forEach(round => {
            let stages = null;
            Object.defineProperty(round, "stages", {
              get() {
                if (!stages) {
                  stages = Stages.find({
                    roundId: round._id
                  }).fetch();
                }

                return stages;
              }

            });
          });
        }

        return gameRounds;
      }

    },
    stages: {
      get() {
        if (!gameStages) {
          gameStages = Stages.find({
            gameId: game._id
          }).fetch();
        }

        return gameStages;
      }

    }
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"create.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/create.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  createGameFromLobby: () => createGameFromLobby,
  sendPlayersToNextBatches: () => sendPlayersToNextBatches
});
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 0);
let Batches;
module.link("../batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 1);
let GameLobbies;
module.link("../game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 2);
let Games;
module.link("./games", {
  Games(v) {
    Games = v;
  }

}, 3);
let PlayerRounds;
module.link("../player-rounds/player-rounds", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 4);
let PlayerStages;
module.link("../player-stages/player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 5);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 6);
let Rounds;
module.link("../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 7);
let Stages;
module.link("../stages/stages", {
  Stages(v) {
    Stages = v;
  }

}, 8);
let earlyExitGameLobby;
module.link("../game-lobbies/methods", {
  earlyExitGameLobby(v) {
    earlyExitGameLobby = v;
  }

}, 9);
let augmentPlayerStageRound, augmentGameStageRound;
module.link("../player-stages/augment.js", {
  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  },

  augmentGameStageRound(v) {
    augmentGameStageRound = v;
  }

}, 10);
let augmentGameObject;
module.link("../games/augment.js", {
  augmentGameObject(v) {
    augmentGameObject = v;
  }

}, 11);
let config;
module.link("../../server", {
  config(v) {
    config = v;
  }

}, 12);
let weightedRandom;
module.link("../../lib/utils.js", {
  weightedRandom(v) {
    weightedRandom = v;
  }

}, 13);
let log;
module.link("../../lib/log.js", {
  default(v) {
    log = v;
  }

}, 14);
let gameLobbyLock;
module.link("../../gameLobby-lock.js", {
  default(v) {
    gameLobbyLock = v;
  }

}, 15);
const addStageErrMsg = "\"round.addStage()\" requires an argument object with 3 properties:\n- name: internal name you'll use to write conditional logic in your experiment.\n- displayName: the name of the Stage the player will see in the UI.\n- durationInSeconds: the duration in seconds of the stage\n\ne.g.: round.addStage({\n  name: \"response\",\n  displayName: \"Response\",\n  durationInSeconds: 120\n});\n\n";

const createGameFromLobby = gameLobby => {
  if (Games.find({
    gameLobbyId: gameLobby._id
  }).count() > 0) {
    return;
  }

  const players = gameLobby.players();
  const batch = gameLobby.batch();
  const treatment = gameLobby.treatment();
  const factors = treatment.factorsObject();
  const {
    batchId,
    treatmentId,
    status,
    debugMode
  } = gameLobby;
  players.forEach(player => {
    player.data = player.data || {};

    player.set = (key, value) => {
      player.data[key] = value;
    };

    player.get = key => {
      return player.data[key];
    };
  }); // Ask (experimenter designer) init function to configure this game
  // given the factors and players given.

  const params = {
    data: _objectSpread({}, gameLobby.data),
    rounds: [],
    players
  };
  var gameCollector = {
    players,
    treatment: factors,

    get(k) {
      return params.data[k];
    },

    set(k, v) {
      params.data[k] = v;
    },

    addRound(props) {
      const data = props ? props.data : {} || {};
      const round = {
        data,
        stages: []
      };
      params.rounds.push(round);
      return {
        get(k) {
          return round.data[k];
        },

        set(k, v) {
          round.data[k] = v;
        },

        addStage(_ref) {
          let {
            name,
            displayName,
            durationInSeconds,
            data = {}
          } = _ref;

          try {
            if (!name || !displayName || !durationInSeconds) {
              log.error(addStageErrMsg);
              log.error("Got: ".concat(JSON.stringify({
                name,
                displayName,
                durationInSeconds
              }, null, "  ")));
              throw "gameInit error";
            }

            const durationInSecondsAsInt = parseInt(durationInSeconds);

            if (Number.isNaN(durationInSecondsAsInt) || durationInSecondsAsInt < 1) {
              console.error("Error in addStage call: durationInSeconds must be an number > 0 (name: ".concat(name, ")"));
            }

            const stage = {
              name,
              displayName,
              durationInSeconds: durationInSecondsAsInt
            };
            round.stages.push(_objectSpread({}, stage, {
              data
            }));
            return _objectSpread({}, stage, {
              get(k) {
                return data[k];
              },

              set(k, v) {
                data[k] = v;
              }

            });
          } catch (error) {
            earlyExitGameLobby.call({
              exitReason: "initError",
              gameLobbyId: gameLobby._id
            });
          }
        }

      };
    }

  };

  try {
    gameLobbyLock[gameLobby._id] = true;
    config.gameInit(gameCollector, factors);
  } catch (err) {
    console.error("fatal error encounter calling Empirica.gameInit:");
    console.error(err);
    earlyExitGameLobby.call({
      exitReason: "gameError",
      gameLobbyId: gameLobby._id
    });
    return;
  }

  if (!params.rounds || params.rounds.length === 0) {
    throw "at least one round must be added per game";
  }

  params.rounds.forEach(round => {
    if (!round.stages || round.stages.length === 0) {
      throw "at least one stage must be added per round";
    }

    round.stages.forEach((_ref2) => {
      let {
        name,
        displayName,
        durationInSeconds
      } = _ref2;

      // This should never happen as we already verified it above.
      if (!name || !displayName || !durationInSeconds) {
        log.error(addStageErrMsg);
        throw "invalid stage";
      }
    });
  }); // Keep debug mode from lobby

  params.debugMode = debugMode; // We need to create/configure stuff associated with the game before we
  // create it so we generate the id early

  const gameId = gameLobby._id;
  params._id = gameId;
  params.gameLobbyId = gameLobby._id; // We also add a few related objects

  params.treatmentId = treatmentId;
  params.batchId = batchId;
  params.status = status; // playerIds is the reference to players stored in the game object

  params.playerIds = _.pluck(params.players, "_id"); // We then need to verify all these ids exist and are unique, the
  // init function might not have returned them correctly

  const len = _.uniq(_.compact(params.playerIds)).length;

  if (len !== params.players.length || len !== players.length) {
    throw new Error("invalid player count");
  } // We want to copy over the changes made by the init function and save the
  // gameId in the player objects already in the DB


  params.players.forEach((_ref3) => {
    let {
      _id,
      data
    } = _ref3;
    Players.update(_id, {
      $set: {
        gameId,
        data
      }
    }, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });
  }); // Create the round objects

  let stageIndex = 0;
  let totalDuration = 0;
  let firstRoundId;
  const insertOption = {
    autoConvert: false,
    filter: false,
    validate: false,
    trimStrings: false,
    removeEmptyStrings: false
  };
  let StagesUpdateOp = Stages.rawCollection().initializeUnorderedBulkOp();
  let RoundsOp = Rounds.rawCollection().initializeUnorderedBulkOp();
  let StagesOp = Stages.rawCollection().initializeUnorderedBulkOp();
  let roundsOpResult;
  let stagesOpResult;
  params.rounds.forEach((round, index) => RoundsOp.insert(_.extend({
    gameId,
    index,
    _id: Random.id(),
    createdAt: new Date(),
    data: {}
  }, round), insertOption));
  roundsOpResult = Meteor.wrapAsync(RoundsOp.execute, RoundsOp)();
  const roundIds = roundsOpResult.getInsertedIds().map(ids => ids._id);
  params.roundIds = roundIds;
  RoundsOp = Rounds.rawCollection().initializeUnorderedBulkOp();
  params.rounds.forEach((round, index) => {
    const roundId = roundIds[index];
    const {
      players
    } = params;
    StagesOp = Stages.rawCollection().initializeUnorderedBulkOp();
    let PlayerStagesOp = PlayerStages.rawCollection().initializeUnorderedBulkOp();
    let PlayerRoundsOp = PlayerRounds.rawCollection().initializeUnorderedBulkOp();
    round.stages.forEach(stage => {
      if (batch.debugMode) {
        stage.durationInSeconds = 60 * 60; // Stage time in debugMode is 1h
      }

      totalDuration += stage.durationInSeconds;

      const sParams = _.extend({
        gameId,
        roundId,
        index: stageIndex,
        _id: Random.id(),
        createdAt: new Date(),
        data: {}
      }, stage);

      StagesOp.insert(sParams, insertOption);
      stageIndex++;
    });
    stagesOpResult = Meteor.wrapAsync(StagesOp.execute, StagesOp)();
    const stageIds = stagesOpResult.getInsertedIds().map(ids => ids._id);
    stageIds.forEach(stageId => {
      if (!params.currentStageId) {
        firstRoundId = roundId;
        params.currentStageId = stageId;
      }

      players.forEach((_ref4) => {
        let {
          _id: playerId
        } = _ref4;
        return PlayerStagesOp.insert({
          playerId,
          stageId,
          roundId,
          gameId,
          batchId,
          _id: Random.id(),
          createdAt: new Date(),
          data: {}
        });
      });
    });
    const playerStagesResult = Meteor.wrapAsync(PlayerStagesOp.execute, PlayerStagesOp)();
    const playerStageIds = playerStagesResult.getInsertedIds().map(ids => ids._id);
    stageIds.forEach(stageId => StagesUpdateOp.find({
      _id: stageId
    }).upsert().updateOne({
      $set: {
        playerStageIds,
        updatedAt: new Date()
      }
    }));
    players.forEach((_ref5) => {
      let {
        _id: playerId
      } = _ref5;
      return PlayerRoundsOp.insert({
        playerId,
        roundId,
        gameId,
        batchId,
        _id: Random.id(),
        data: {},
        createdAt: new Date()
      });
    });
    const playerRoundIdsResult = Meteor.wrapAsync(PlayerRoundsOp.execute, PlayerRoundsOp)();
    const playerRoundIds = playerRoundIdsResult.getInsertedIds().map(ids => ids._id);
    RoundsOp.find({
      _id: roundId
    }).upsert().updateOne({
      $set: {
        stageIds,
        playerRoundIds,
        updatedAt: new Date()
      }
    });
  });
  Meteor.wrapAsync(StagesUpdateOp.execute, StagesUpdateOp)();
  Meteor.wrapAsync(RoundsOp.execute, RoundsOp)(); // An estimation of the finish time to help querying.
  // At the moment, this will 100% break with pausing the game/batch.

  params.estFinishedTime = moment() // Give it an extra 24h (86400s) window for the inter-stage sync buffer.
  // It was 5 min and that failed on an experiment with many rounds.
  // This value is not extremely useful, it's main purpose is currently
  // to stop querying games indefinitely in the update game background job.
  // It was also meant to be an approximate estimate for when the game could
  // end at the maximum, that we could show in the admin, but it can no longer
  // work, and it is questionable if the "stop querying" "feature" is still
  // adequate.
  .add(totalDuration + 86400, "seconds").toDate(); // We're no longer filtering out unspecified fields on insert because of a
  // simpleschema bug, so we need to remove invalid params now.

  delete params.players;
  delete params.rounds; // Insert game. As soon as it comes online, the game will start for the
  // players so all related object (rounds, stages, players) must be created
  // and ready

  Games.insert(params, {
    autoConvert: false,
    filter: false,
    validate: false,
    trimStrings: false,
    removeEmptyStrings: false
  }); // Let Game Lobby know Game ID

  GameLobbies.update(gameLobby._id, {
    $set: {
      gameId
    }
  }); //
  // Overbooking
  //
  // Overbooked players that did not finish the intro and won't be in this game

  const failedPlayerIds = _.difference(gameLobby.queuedPlayerIds, gameLobby.playerIds);

  sendPlayersToNextBatches(failedPlayerIds, batchId, gameLobby); //
  // Call the callbacks
  //

  const {
    onRoundStart,
    onGameStart,
    onStageStart
  } = config;

  if ((onGameStart || onRoundStart || onStageStart) && firstRoundId) {
    const game = Games.findOne(gameId);
    augmentGameObject({
      game,
      treatment,
      firstRoundId,
      currentStageId: params.currentStageId
    });
    const nextRound = game.rounds.find(r => r._id === firstRoundId);
    const nextStage = nextRound.stages.find(s => s._id === params.currentStageId);
    augmentGameStageRound(game, nextStage, nextRound);

    if (onGameStart) {
      onGameStart(game);
    }

    if (onRoundStart) {
      onRoundStart(game, nextRound);
    }

    if (onStageStart) {
      onStageStart(game, nextRound, nextStage);
    }
  } //
  // Start the game
  //


  const startTimeAt = moment().add(Stages.stagePaddingDuration).toDate();
  Stages.update(params.currentStageId, {
    $set: {
      startTimeAt
    }
  });
  delete gameLobbyLock[gameLobby._id];
};

function sendPlayersToNextBatches(playerIds, batchId, gameLobby) {
  // Find other lobbies that are not full yet with the same treatment
  const runningBatches = Batches.find({
    _id: {
      $ne: batchId
    },
    status: "running"
  }, {
    sort: {
      runningAt: 1
    }
  });
  const {
    treatmentId
  } = gameLobby;
  const lobbiesGroups = runningBatches.map(() => []);
  const runningBatcheIds = runningBatches.map(b => b._id);
  lobbiesGroups.push([]);
  const possibleLobbies = GameLobbies.find({
    _id: {
      $ne: gameLobby._id
    },
    status: "running",
    timedOutAt: {
      $exists: false
    },
    gameId: {
      $exists: false
    },
    treatmentId
  }).fetch();
  possibleLobbies.forEach(lobby => {
    if (lobby.batchId === batchId) {
      lobbiesGroups[0].push(lobby);
    } else {
      lobbiesGroups[runningBatcheIds.indexOf(lobby.batchId) + 1].push(lobby);
    }
  }); // If no lobbies left, lead players to exit

  if (possibleLobbies.length === 0) {
    if (playerIds.length > 0) {
      Players.update({
        _id: {
          $in: playerIds
        }
      }, {
        $set: {
          exitAt: new Date(),
          exitStatus: "gameFull"
        }
      }, {
        multi: true
      });
    }

    return;
  }

  for (let i = 0; i < lobbiesGroups.length; i++) {
    const lobbies = lobbiesGroups[i];

    if (lobbies.length === 0) {
      continue;
    } // If there are lobbies remaining, distribute them across the lobbies
    // proportinally to the initial playerCount


    const weigthedLobbyPool = weightedRandom(lobbies.map(lobby => {
      return {
        value: lobby,
        weight: lobby.availableCount
      };
    }));

    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      const lobby = weigthedLobbyPool(); // Adding the player to specified lobby queue

      const $addToSet = {
        queuedPlayerIds: playerId
      };

      if (gameLobby.playerIds.includes(playerId)) {
        $addToSet.playerIds = playerId;
      }

      GameLobbies.update(lobby._id, {
        $addToSet
      });
      Players.update(playerId, {
        $set: {
          gameLobbyId: lobby._id
        }
      });
    }

    break;
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"games.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/games.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Games: () => Games
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Counter;
module.link("../../lib/counters", {
  Counter(v) {
    Counter = v;
  }

}, 1);
let statusSchema;
module.link("../batches/status-schema", {
  statusSchema(v) {
    statusSchema = v;
  }

}, 2);
let BelongsTo, HasManyByRef, TimestampSchema;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  HasManyByRef(v) {
    HasManyByRef = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  }

}, 3);
let DebugModeSchema, UserDataSchema;
module.link("../default-schemas.js", {
  DebugModeSchema(v) {
    DebugModeSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  }

}, 4);
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 5);
let Treatments;
module.link("../treatments/treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 6);
let Batches;
module.link("../batches/batches", {
  Batches(v) {
    Batches = v;
  }

}, 7);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 8);
let Stages;
module.link("../stages/stages", {
  Stages(v) {
    Stages = v;
  }

}, 9);
let Rounds;
module.link("../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 10);

class GamesCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.index = Counter.inc("games");
    return super.insert(doc, callback);
  }

}

const Games = new GamesCollection("games");
Games.schema = new SimpleSchema({
  // Auto-incremented number assigned to games as they are created
  index: {
    type: SimpleSchema.Integer
  },
  // estFinishedTime is adding up all stages timings when the game is
  // created/started to estimate when the game should be done at the latests.
  estFinishedTime: {
    type: Date,
    index: 1
  },
  // Time the game actually finished
  finishedAt: {
    type: Date,
    optional: true,
    index: 1
  },
  // Indicates which stage is ongoing
  currentStageId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id,
    index: 1
  },
  endReason: {
    label: "Ended Reason",
    type: String,
    optional: true,
    regEx: /[a-zA-Z0-9_]+/
  }
});

if (Meteor.isDevelopment || Meteor.settings.public.debug_gameDebugMode) {
  Games.schema.extend(DebugModeSchema);
}

Games.schema.extend(TimestampSchema);
Games.schema.extend(UserDataSchema);
Games.schema.extend(BelongsTo("GameLobbies", false));
Games.schema.extend(BelongsTo("Treatments"));
Games.schema.extend(HasManyByRef("Rounds"));
Games.schema.extend(HasManyByRef("Players"));
Games.schema.extend(BelongsTo("Batches")); // We are denormalizing the parent batch status in order to make clean queries

Games.schema.extend(statusSchema);
Games.attachSchema(Games.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/hooks.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  checkBatchFull: () => checkBatchFull,
  checkForBatchFinished: () => checkForBatchFinished
});
let Batches;
module.link("../batches/batches", {
  Batches(v) {
    Batches = v;
  }

}, 0);
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 1);
let Games;
module.link("../games/games", {
  Games(v) {
    Games = v;
  }

}, 2);

const checkBatchFull = batchId => {
  const batch = Batches.findOne(batchId);

  if (!batch) {
    throw "batch for game missing. batchId: ".concat(batchId);
  }

  const expectedGamesCount = batch.gameCount();
  const gamesCount = Games.find({
    batchId
  }).count();
  const timeOutGameLobbiesCount = GameLobbies.find({
    batchId,
    timedOutAt: {
      $exists: true
    }
  }).count();

  if (expectedGamesCount === gamesCount + timeOutGameLobbiesCount) {
    Batches.update(batchId, {
      $set: {
        full: true
      }
    });
  }
};

// If all games for batch are filled, change batch status
Games.after.insert(function (userId, _ref) {
  let {
    batchId
  } = _ref;
  checkBatchFull(batchId);
});

const checkForBatchFinished = batchId => {
  // Find games that are not finished
  const gameQuery = {
    batchId,
    finishedAt: {
      $exists: false
    }
  };
  const gamesCount = Games.find(gameQuery).count();
  const noGamesLeft = gamesCount === 0; // Find game lobbies that haven't been transformed into games and that haven't timedout

  const gameLobbiesQuery = {
    batchId,
    gameId: {
      $exists: false
    },
    timedOutAt: {
      $exists: false
    }
  };
  const lobbiesCount = GameLobbies.find(gameLobbiesQuery).count();
  const noGameLobbiesLeft = lobbiesCount === 0;

  if (noGamesLeft && noGameLobbiesLeft) {
    Batches.update(batchId, {
      $set: {
        status: "finished",
        finishedAt: new Date()
      }
    });
  }
};

// Check if all games finished, mark batch as finished
Games.after.update(function (userId, _ref2, fieldNames, modifier, options) {
  let {
    batchId
  } = _ref2;

  if (!fieldNames.includes("finishedAt")) {
    return;
  }

  checkForBatchFinished(batchId);
}, {
  fetchPrevious: false
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/methods.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updateGameData: () => updateGameData,
  earlyExitGame: () => earlyExitGame
});
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
let Games;
module.link("./games.js", {
  Games(v) {
    Games = v;
  }

}, 3);
let GameLobbies;
module.link("../game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 4);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 5);
let Stages;
module.link("../stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 6);
let Batches;
module.link("../batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 7);
const updateGameData = new ValidatedMethod({
  name: "Games.methods.updateData",
  validate: new SimpleSchema({
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      gameId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const game = Games.findOne(gameId);

    if (!game) {
      throw new Error("game not found");
    } // TODO check can update this record game


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    Games.update(gameId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        gameId,
        game,
        key,
        value: val,
        prevValue: game.data && game.data[key],
        append
      });
    }
  }

});
const earlyExitGame = new ValidatedMethod({
  name: "Games.methods.earlyExitGame",
  validate: new SimpleSchema({
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    endReason: {
      label: "Reason for End",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    status: {
      label: "status for games and players after exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    }
  }).validator(),

  run(_ref2) {
    let {
      gameId,
      endReason,
      status
    } = _ref2;

    if (!Meteor.isServer) {
      return;
    }

    const game = Games.findOne(gameId);

    if (!game) {
      throw new Error("game not found");
    }

    if (game && game.finishedAt) {
      if (Meteor.isDevelopment) {
        console.log("\n\ngame already ended!");
      }

      return;
    }

    Games.update(gameId, {
      $set: {
        finishedAt: new Date(),
        status,
        endReason
      }
    });
    GameLobbies.update({
      gameId
    }, {
      $set: {
        status,
        endReason
      }
    });
    game.playerIds.forEach(playerId => Players.update(playerId, {
      $set: {
        exitAt: new Date(),
        exitStatus: status,
        exitReason: endReason
      }
    }));
    const batch = Batches.findOne(game.batchId);
    const availableLobby = GameLobbies.findOne({
      $and: [{
        _id: {
          $in: batch.gameLobbyIds
        }
      }, {
        status: {
          $in: ["init", "running"]
        }
      }]
    }); // End batch if there is no available game

    if (!availableLobby) {
      Batches.update({
        gameLobbyIds: gameId
      }, {
        $set: {
          status: status,
          finishedAt: new Date()
        }
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"cron.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/server/cron.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 0);
let Games;
module.link("../games.js", {
  Games(v) {
    Games = v;
  }

}, 1);
let Players;
module.link("../../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 2);
let Rounds;
module.link("../../rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 3);
let Stages;
module.link("../../stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 4);
let Treatments;
module.link("../../treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 5);
let augmentPlayerStageRound, augmentGameStageRound;
module.link("../../player-stages/augment.js", {
  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  },

  augmentGameStageRound(v) {
    augmentGameStageRound = v;
  }

}, 6);
let augmentGameObject;
module.link("../../games/augment.js", {
  augmentGameObject(v) {
    augmentGameObject = v;
  }

}, 7);
let config;
module.link("../../../server", {
  config(v) {
    config = v;
  }

}, 8);
let endOfStage;
module.link("../../stages/finish.js", {
  endOfStage(v) {
    endOfStage = v;
  }

}, 9);
let Cron;
module.link("../../../startup/server/cron.js", {
  default(v) {
    Cron = v;
  }

}, 10);
Cron.add({
  name: "Trigger stage timeout or Run bots",
  interval: 1000,
  task: function (log) {
    const query = {
      status: "running",
      estFinishedTime: {
        $gte: new Date()
      },
      finishedAt: {
        $exists: false
      }
    };
    Games.find(query).forEach(game => {
      const stage = Stages.findOne(game.currentStageId);
      const now = moment();
      const startTimeAt = moment(stage.startTimeAt);
      const endTimeAt = startTimeAt.add(stage.durationInSeconds, "seconds");
      const ended = now.isSameOrAfter(endTimeAt);

      if (ended) {
        endOfStage(stage._id);
      } else {
        const {
          gameId
        } = stage; // make bots play

        const query = {
          gameId,
          bot: {
            $exists: true
          }
        };

        if (Players.find(query).count() === 0) {
          return;
        }

        const botPlayers = Players.find(query);
        const treatment = Treatments.findOne(game.treatmentId);
        const round = Rounds.findOne(stage.roundId);
        augmentGameObject({
          game,
          treatment,
          round,
          stage
        });
        botPlayers.forEach(botPlayer => {
          const bot = config.bots[botPlayer.bot];

          if (!bot) {
            log.error("Definition for bot \"".concat(botPlayer.bot, "\" was not found in the server config!"));
            return;
          }

          if (!bot.onStageTick) {
            return;
          }

          augmentGameStageRound(game, stage, round);
          botPlayer.stage = _.extend({}, stage);
          botPlayer.round = _.extend({}, round);
          augmentPlayerStageRound(botPlayer, botPlayer.stage, botPlayer.round, game);
          const tick = endTimeAt.diff(now, "seconds");
          game.rounds.forEach(round => {
            round.stages = game.stages.filter(s => s.roundId === round._id);
          });
          bot.onStageTick(botPlayer, game, round, stage, tick);
        });
      }
    });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/games/server/publications.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let PlayerRounds;
module.link("../../player-rounds/player-rounds", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 0);
let PlayerStages;
module.link("../../player-stages/player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 1);
let Players;
module.link("../../players/players", {
  Players(v) {
    Players = v;
  }

}, 2);
let Rounds;
module.link("../../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 3);
let Stages;
module.link("../../stages/stages", {
  Stages(v) {
    Stages = v;
  }

}, 4);
let Games;
module.link("../games", {
  Games(v) {
    Games = v;
  }

}, 5);
Meteor.publish("game", function (_ref) {
  let {
    playerId
  } = _ref;
  return Games.find({
    playerIds: playerId
  });
});
Meteor.publish("gameDependencies", function (_ref2) {
  let {
    gameId
  } = _ref2;

  if (!gameId) {
    return [];
  }

  return [Players.find({
    gameId
  })];
});
Meteor.publish("gameLobbyDependencies", function (_ref3) {
  let {
    gameLobbyId
  } = _ref3;

  if (!gameLobbyId) {
    return [];
  }

  return [Players.find({
    gameLobbyId
  })];
});
Meteor.publish("gameCurrentRoundStage", function (_ref4) {
  let {
    gameId,
    stageId
  } = _ref4;

  if (!gameId || !stageId) {
    return [];
  }

  const stage = Stages.findOne(stageId);
  const roundId = stage.roundId;
  return [Stages.find({
    gameId,
    roundId
  }), Rounds.find({
    gameId,
    _id: roundId
  }), PlayerRounds.find({
    gameId,
    roundId
  }), PlayerStages.find({
    gameId,
    stageId
  })];
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lobby-configs":{"lobby-configs.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/lobby-configs/lobby-configs.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  LobbyConfigs: () => LobbyConfigs
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let inflection;
module.link("inflection", {
  default(v) {
    inflection = v;
  }

}, 1);
let HasManyByRef, TimestampSchema, ArchivedSchema;
module.link("../default-schemas", {
  HasManyByRef(v) {
    HasManyByRef = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  },

  ArchivedSchema(v) {
    ArchivedSchema = v;
  }

}, 2);
const LobbyConfigs = new Mongo.Collection("lobby_configs");
LobbyConfigs.helpers({
  displayName() {
    if (this.name) {
      return this.name;
    }

    const type = inflection.titleize(this.timeoutType);
    const base = "".concat(type, ": ").concat(this.timeoutInSeconds, "s");
    let details;

    switch (this.timeoutType) {
      case "lobby":
        details = "\u2192 ".concat(inflection.titleize(this.timeoutStrategy));

        if (this.timeoutStrategy === "bots") {
          details += "(".concat(this.timeoutBots.join(","), ")");
        }

        break;

      case "individual":
        details = "\u2A09 ".concat(this.extendCount + 1);
        break;

      default:
        console.error("unknown timeoutType: ".concat(this.timeoutType));
        return base;
    }

    return "".concat(base, " ").concat(details);
  }

}); // There are 2 exclusive timeout types:
// - lobby: the timeout start when the first player reaches the lobby and runs
//   out for all the players whether they have even reached the lobby or not.
// - individual: the timeout is started for each player as they reach the room.
//   Some players might time out before all players are in the lobby, they might
//   continue waiting for another timeout period. They might also leave the game
//   and a new player can replace them. The lobby itself never times out.

LobbyConfigs.timeoutTypes = ["lobby", "individual"]; // The timeoutStrategy determines what to do in case people are waiting
// in the lobby for longer than the timeoutInSeconds duration.
// Only for "lobby" timeoutType.
// Available strategies:
// - ignore: start the game anyway
// - fail: take the player to the exit survey
// - bots: fill the missing players slots with bots from timeoutBots

LobbyConfigs.timeoutStrategies = ["fail", "ignore"]; // DEACTIVATING bots until bots implemented.
// LobbyConfigs.timeoutStrategies = ["fail", "ignore", "bots"];
// One year, that's a lot, just need to block from something too wild like 10M
// years. We don't actually care, Inf would be fine...

LobbyConfigs.maxTimeoutInSeconds = 365 * 24 * 60 * 60; // defaultTimeoutInSeconds is simply used as the default value in the Lobby
// Configuration creation form.

LobbyConfigs.defaultTimeoutInSeconds = 5 * 60;
LobbyConfigs.schema = new SimpleSchema({
  // Optional experimenter given name for the treatment
  name: {
    type: String,
    max: 256,
    optional: true,

    custom() {
      if (this.isSet && LobbyConfigs.find({
        name: this.value
      }).count() > 0) {
        return "notUnique";
      }
    } // regEx: /^[a-zA-Z0-9_]+$/


  },
  // The timeoutType fundamentally changes the behavior of the lobby. See
  // LobbyConfigs.timeoutTypes above for details.
  timeoutType: {
    type: String,
    allowedValues: LobbyConfigs.timeoutTypes
  },
  // Number of seconds for one player to wait in lobby before timeoutStrategy
  // is applied. This timeout applies only to the waiting for the game to start.
  // It is either a "Lobby Timeout", or an "Individual Timeout", depending on
  // the timeoutType value.
  timeoutInSeconds: {
    type: SimpleSchema.Integer,
    max: LobbyConfigs.maxTimeoutInSeconds,
    // It would be difficult to manage a timer that is less than 5s, and it
    // would be  weird. 5s is already weird...
    min: 5
  },
  // The timeoutStrategy determines what to do in case people are waiting
  // in the lobby for longer than the timeoutInSeconds duration.
  // Only for "lobby" timeoutType.
  // See LobbyConfigs.timeoutStrategies for details.
  timeoutStrategy: {
    type: String,
    allowedValues: LobbyConfigs.timeoutStrategies,
    defaultValue: "fail",
    optional: true
  },
  // Names of bot to use if timed out and still not enough player.
  // Only for "lobby" timeoutType and timeoutStrategy is "bots".
  timeoutBots: {
    type: Array,
    // Should add custom validation to verify the timeoutStrategy and make
    // required if "bots" and should verify bot with name exists.
    optional: true
  },
  "timeoutBots.$": {
    type: String
  },
  // Number of times to allow the user to extend their wait time by
  // timeoutInSeconds.
  // If set to 0, they are never asked to retry.
  // Only for "individual" timeoutType.
  extendCount: {
    type: SimpleSchema.Integer,
    // 1 millard times, that should be a sufficient upper bound
    max: 1000000000,
    min: 0,
    optional: true
  }
});
LobbyConfigs.schema.extend(TimestampSchema);
LobbyConfigs.schema.extend(ArchivedSchema);
LobbyConfigs.schema.extend(HasManyByRef("Batches"));
LobbyConfigs.schema.extend(HasManyByRef("GameLobbies"));
LobbyConfigs.attachSchema(LobbyConfigs.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/lobby-configs/methods.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createLobbyConfig: () => createLobbyConfig,
  updateLobbyConfig: () => updateLobbyConfig
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let LobbyConfigs;
module.link("./lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 2);
let IdSchema;
module.link("../default-schemas.js", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 3);
const createLobbyConfig = new ValidatedMethod({
  name: "LobbyConfigs.methods.create",
  validate: LobbyConfigs.schema.pick("name", "timeoutType", "timeoutInSeconds", "timeoutStrategy", "timeoutBots", "timeoutBots.$", "extendCount").validator(),

  run(lobbyConfig) {
    if (!this.userId) {
      throw new Error("unauthorized");
    }

    LobbyConfigs.insert(lobbyConfig);
  }

});
const updateLobbyConfig = new ValidatedMethod({
  name: "LobbyConfigs.methods.update",
  validate: LobbyConfigs.schema.pick("name").extend(new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  })).extend(IdSchema).validator(),

  run(_ref) {
    let {
      _id,
      name,
      archived
    } = _ref;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const lobbyConfig = LobbyConfigs.findOne(_id);

    if (!lobbyConfig) {
      throw new Error("not found");
    }

    const $set = {},
          $unset = {};

    if (name !== undefined) {
      $set.name = name;
    }

    if (archived !== undefined) {
      if (archived) {
        if (lobbyConfig.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!lobbyConfig.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};

    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }

    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }

    if (Object.keys(modifier).length === 0) {
      return;
    }

    LobbyConfigs.update(_id, modifier);
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/lobby-configs/server/publications.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let LobbyConfigs;
module.link("../lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 0);
Meteor.publish("admin-lobby-configs", function (_ref) {
  let {
    archived
  } = _ref;

  if (!this.userId) {
    return null;
  }

  if (archived === undefined) {
    return LobbyConfigs.find();
  }

  return LobbyConfigs.find({
    archivedAt: {
      $exists: Boolean(archived)
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"player-inputs":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-inputs/methods.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  addPlayerInput: () => addPlayerInput
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 2);
let PlayerInputs;
module.link("./player-inputs.js", {
  PlayerInputs(v) {
    PlayerInputs = v;
  }

}, 3);
const addPlayerInput = new ValidatedMethod({
  name: "PlayerInputs.methods.add",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    gameLobbyId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    data: {
      type: String
    }
  }).validator(),

  run(_ref) {
    let {
      playerId,
      gameId,
      gameLobbyId,
      data: rawData
    } = _ref;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    }

    if (!gameId && !gameLobbyId) {
      throw new Error("gameId or gameLobbyId required");
    }

    const data = JSON.parse(rawData);
    PlayerInputs.insert({
      playerId,
      gameId,
      gameLobbyId,
      data
    }, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"player-inputs.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-inputs/player-inputs.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PlayerInputs: () => PlayerInputs
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let BelongsTo, TimestampSchema, UserDataSchema;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  }

}, 1);
const PlayerInputs = new Mongo.Collection("player_inputs");
PlayerInputs.schema = new SimpleSchema({});
PlayerInputs.schema.extend(TimestampSchema);
PlayerInputs.schema.extend(UserDataSchema);
PlayerInputs.schema.extend(BelongsTo("Games", false));
PlayerInputs.schema.extend(BelongsTo("GameLobbies", false));
PlayerInputs.schema.extend(BelongsTo("Players"));
PlayerInputs.attachSchema(PlayerInputs.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"player-logs":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-logs/methods.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  playerLog: () => playerLog
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let PlayerLogs;
module.link("./player-logs.js", {
  PlayerLogs(v) {
    PlayerLogs = v;
  }

}, 2);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 3);
const playerLog = new ValidatedMethod({
  name: "PlayerLogs.methods.add",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    stageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    roundId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    name: {
      type: String,
      max: 255
    },
    jsonData: {
      type: String
    }
  }).validator(),

  run(_ref) {
    let {
      playerId,
      gameId,
      roundId,
      stageId,
      name,
      jsonData
    } = _ref;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    }

    PlayerLogs.insert({
      playerId,
      gameId,
      roundId,
      stageId,
      name,
      jsonData
    }, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"player-logs.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-logs/player-logs.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PlayerLogs: () => PlayerLogs
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let TimestampSchema, BelongsTo;
module.link("../default-schemas", {
  TimestampSchema(v) {
    TimestampSchema = v;
  },

  BelongsTo(v) {
    BelongsTo = v;
  }

}, 1);
const PlayerLogs = new Mongo.Collection("player_logs");
PlayerLogs.schema = new SimpleSchema({
  stageId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  roundId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  name: {
    type: String,
    max: 255
  },
  jsonData: {
    type: String
  }
});
PlayerLogs.schema.extend(TimestampSchema);
PlayerLogs.schema.extend(BelongsTo("Players"));
PlayerLogs.attachSchema(PlayerLogs.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"player-rounds":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-rounds/methods.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updatePlayerRoundData: () => updatePlayerRoundData
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let PlayerRounds;
module.link("./player-rounds", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 2);
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 3);
const updatePlayerRoundData = new ValidatedMethod({
  name: "PlayerRounds.methods.updateData",
  validate: new SimpleSchema({
    playerRoundId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      playerRoundId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const playerRound = PlayerRounds.findOne(playerRoundId);

    if (!playerRound) {
      throw new Error("playerRound not found");
    } // TODO check can update this record playerRound


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    PlayerRounds.update(playerRoundId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId: playerRound.playerId,
        playerRoundId,
        playerRound,
        key,
        value: val,
        prevValue: playerRound.data && playerRound.data[key],
        append
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"player-rounds.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-rounds/player-rounds.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PlayerRounds: () => PlayerRounds
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let TimestampSchema, UserDataSchema, BelongsTo;
module.link("../default-schemas", {
  TimestampSchema(v) {
    TimestampSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  },

  BelongsTo(v) {
    BelongsTo = v;
  }

}, 1);
const PlayerRounds = new Mongo.Collection("player_rounds");
PlayerRounds.schema = new SimpleSchema({});
PlayerRounds.schema.extend(TimestampSchema);
PlayerRounds.schema.extend(UserDataSchema);
PlayerRounds.schema.extend(BelongsTo("Players"));
PlayerRounds.schema.extend(BelongsTo("Rounds"));
PlayerRounds.schema.extend(BelongsTo("Games"));
PlayerRounds.schema.extend(BelongsTo("Batches"));
PlayerRounds.attachSchema(PlayerRounds.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"player-stages":{"augment.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-stages/augment.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  augmentGameLobby: () => augmentGameLobby,
  augmentPlayerLobby: () => augmentPlayerLobby,
  augmentPlayer: () => augmentPlayer,
  augmentPlayerStageRound: () => augmentPlayerStageRound,
  stubPlayerStageRound: () => stubPlayerStageRound,
  augmentGameStageRound: () => augmentGameStageRound,
  stubStageRound: () => stubStageRound
});
let updateGameData, earlyExitGame;
module.link("../games/methods.js", {
  updateGameData(v) {
    updateGameData = v;
  },

  earlyExitGame(v) {
    earlyExitGame = v;
  }

}, 0);
let updateGameLobbyData;
module.link("../game-lobbies/methods", {
  updateGameLobbyData(v) {
    updateGameLobbyData = v;
  }

}, 1);
let updatePlayerRoundData;
module.link("../player-rounds/methods", {
  updatePlayerRoundData(v) {
    updatePlayerRoundData = v;
  }

}, 2);
let PlayerRounds;
module.link("../player-rounds/player-rounds", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 3);
let updatePlayerData, earlyExitPlayer, earlyExitPlayerLobby;
module.link("../players/methods.js", {
  updatePlayerData(v) {
    updatePlayerData = v;
  },

  earlyExitPlayer(v) {
    earlyExitPlayer = v;
  },

  earlyExitPlayerLobby(v) {
    earlyExitPlayerLobby = v;
  }

}, 4);
let playerLog;
module.link("../player-logs/methods.js", {
  playerLog(v) {
    playerLog = v;
  }

}, 5);
let updateRoundData;
module.link("../rounds/methods.js", {
  updateRoundData(v) {
    updateRoundData = v;
  }

}, 6);
let updateStageData;
module.link("../stages/methods.js", {
  updateStageData(v) {
    updateStageData = v;
  }

}, 7);
let submitPlayerStage, updatePlayerStageData;
module.link("./methods", {
  submitPlayerStage(v) {
    submitPlayerStage = v;
  },

  updatePlayerStageData(v) {
    updatePlayerStageData = v;
  }

}, 8);
let PlayerStages;
module.link("./player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 9);

const gameSet = function (gameId) {
  let append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (key, value) => {
    updateGameData.call({
      gameId,
      key,
      value: JSON.stringify(value),
      append,
      noCallback: Meteor.isServer
    });
  };
};

const gameLobbySet = function (gameLobbyId) {
  let append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (key, value) => {
    updateGameLobbyData.call({
      gameLobbyId,
      key,
      value: JSON.stringify(value),
      append,
      noCallback: Meteor.isServer
    });
  };
};

const playerSet = function (playerId) {
  let append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (key, value) => {
    updatePlayerData.call({
      playerId,
      key,
      value: JSON.stringify(value),
      append,
      noCallback: Meteor.isServer
    });
  };
};

const stageSet = function (playerStageId) {
  let append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (key, value) => {
    updatePlayerStageData.call({
      playerStageId,
      key,
      value: JSON.stringify(value),
      append,
      noCallback: Meteor.isServer
    });
  };
};

const stageSubmit = playerStageId => cb => {
  submitPlayerStage.call({
    playerStageId,
    noCallback: Meteor.isServer
  }, cb);
};

const roundSet = function (playerRoundId) {
  let append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (key, value) => {
    updatePlayerRoundData.call({
      playerRoundId,
      key,
      value: JSON.stringify(value),
      append,
      noCallback: Meteor.isServer
    });
  };
}; // Once the operation has succeeded (no throw), set the value
// undefined is not supported, null is, replace undefineds by nulls.


const set = (obj, func) => (k, v) => {
  const val = v === undefined ? null : v;
  func(k, val);
  obj[k] = val;
};

const append = (obj, func) => (k, v) => {
  const val = v === undefined ? null : v;
  func(k, val);

  if (!obj[k]) {
    obj[k] = [];
  }

  obj[k].push(val);
};

const nullFunc = () => {
  throw "You called .get(...) or .set(...) but there is no data for the player yet. Did the game run for this player?";
};

const augmentGameLobby = gameLobby => {
  gameLobby.get = key => gameLobby.data[key];

  gameLobby.set = set(gameLobby.data, gameLobbySet(gameLobby._id));
  gameLobby.append = append(gameLobby.data, gameLobbySet(gameLobby._id, true));
};

const augmentPlayerLobby = function (player) {
  let round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let stage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let gameLobby = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const {
    _id: playerId
  } = player;

  player.exit = reason => earlyExitPlayerLobby.call({
    playerId,
    exitReason: reason,
    gameLobbyId: gameLobby._id
  });

  player.get = key => player.data[key];

  player.set = set(player.data, playerSet(playerId));
  player.append = append(player.data, playerSet(playerId, true));

  player.log = (name, data) => {
    playerLog.call({
      playerId,
      name,
      jsonData: JSON.stringify(data),
      stageId: stage._id,
      roundId: round._id,
      gameLobbyId: gameLobby._id
    });
  };
};

const augmentPlayer = function (player) {
  let stage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let game = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const {
    _id: playerId
  } = player;

  player.exit = reason => earlyExitPlayer.call({
    playerId,
    exitReason: reason,
    gameId: game._id
  });

  player.get = key => player.data[key];

  player.set = set(player.data, playerSet(playerId));
  player.append = append(player.data, playerSet(playerId, true));

  player.log = (name, data) => {
    playerLog.call({
      playerId,
      name,
      jsonData: JSON.stringify(data),
      stageId: stage._id,
      roundId: round._id,
      gameId: game._id
    });
  };
};

const augmentPlayerStageRound = function (player) {
  let stage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let game = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const {
    _id: playerId
  } = player;
  augmentPlayer(player, stage, round, game);

  if (stage) {
    const playerStage = PlayerStages.findOne({
      stageId: stage._id,
      playerId
    });

    stage.get = key => playerStage.data[key];

    stage.set = set(playerStage.data, stageSet(playerStage._id));
    stage.append = append(playerStage.data, stageSet(playerStage._id, true));
    stage.submit = stageSubmit(playerStage._id, err => {
      if (!err) {
        stage.submitted = true;
      }
    });
    stage.submitted = Boolean(playerStage.submittedAt);
  }

  if (round) {
    const playerRound = PlayerRounds.findOne({
      roundId: round._id,
      playerId
    });

    round.get = key => playerRound.data[key];

    round.set = set(playerRound.data, roundSet(playerRound._id));
    round.append = append(playerRound.data, roundSet(playerRound._id, true));
  }
};

const stubPlayerStageRound = (player, stage, round) => {
  player.get = nullFunc;
  player.set = nullFunc;
  player.append = nullFunc;

  if (stage) {
    stage.get = nullFunc;
    stage.set = nullFunc;
    stage.append = nullFunc;
    stage.submit = nullFunc;
    stage.submitted = false;
  }

  if (round) {
    round.get = nullFunc;
    round.set = nullFunc;
    round.append = nullFunc;
  }
};

const augmentGameStageRound = (game, stage, round) => {
  if (game) {
    game.get = key => game.data[key];

    game.set = set(game.data, gameSet(game._id));
    game.append = append(game.data, gameSet(game._id, true));

    game.end = endReason => earlyExitGame.call({
      gameId: game._id,
      endReason,
      status: "custom"
    });
  }

  if (stage) {
    stage.get = key => {
      return stage.data[key];
    };

    stage.set = set(stage.data, (key, value) => {
      updateStageData.call({
        stageId: stage._id,
        key,
        value: JSON.stringify(value),
        append: false,
        noCallback: Meteor.isServer
      });
    });
    stage.append = append(stage.data, (key, value) => {
      updateStageData.call({
        stageId: stage._id,
        key,
        value: JSON.stringify(value),
        append: true,
        noCallback: Meteor.isServer
      });
    });

    stage.submit = () => {
      throw "You cannot submit the entire stage at the moment";
    };
  }

  if (round) {
    round.get = key => {
      return round.data[key];
    };

    round.set = set(round.data, (key, value) => {
      updateRoundData.call({
        roundId: round._id,
        key,
        value: JSON.stringify(value),
        append: false,
        noCallback: Meteor.isServer
      });
    });
    round.append = append(round.data, (key, value) => {
      updateRoundData.call({
        roundId: round._id,
        key,
        value: JSON.stringify(value),
        append: true,
        noCallback: Meteor.isServer
      });
    });
  }
};

const stubStageRound = (stage, round) => {
  stage.get = nullFunc;
  stage.set = nullFunc;
  stage.append = nullFunc;
  stage.submit = nullFunc;
  round.get = nullFunc;
  round.set = nullFunc;
  round.append = nullFunc;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hooks.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-stages/hooks.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let PlayerStages;
module.link("./player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 0);
let endOfStage;
module.link("../stages/finish.js", {
  endOfStage(v) {
    endOfStage = v;
  }

}, 1);
let Players;
module.link("../players/players", {
  Players(v) {
    Players = v;
  }

}, 2);
PlayerStages.after.update(function (userId, playerStage, fieldNames, modifier, options) {
  if (!fieldNames.includes("submittedAt")) {
    return;
  }

  const {
    stageId
  } = playerStage;
  const playerIDs = PlayerStages.find({
    stageId
  }).map(p => p.playerId);
  const availPlayerIDs = Players.find({
    _id: {
      $in: playerIDs
    },
    exitAt: {
      $exists: false
    }
  }).map(p => p._id);
  const doneCount = PlayerStages.find({
    stageId,
    playerId: {
      $in: availPlayerIDs
    },
    submittedAt: {
      $exists: true
    }
  }).count();

  if (doneCount === availPlayerIDs.length) {
    endOfStage(stageId);
  }
}, {
  fetchPrevious: false
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-stages/methods.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updatePlayerStageData: () => updatePlayerStageData,
  submitPlayerStage: () => submitPlayerStage
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let PlayerStages;
module.link("./player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 2);
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 3);
const updatePlayerStageData = new ValidatedMethod({
  name: "PlayerStages.methods.updateData",
  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      playerStageId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const playerStage = PlayerStages.findOne(playerStageId);

    if (!playerStage) {
      throw new Error("playerStage not found");
    } // TODO check can update this record playerStage


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    PlayerStages.update(playerStageId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId: playerStage.playerId,
        playerStageId,
        playerStage,
        key,
        value: val,
        prevValue: playerStage.data && playerStage.data[key],
        append
      });
    }
  }

});
const submitPlayerStage = new ValidatedMethod({
  name: "PlayerStages.methods.submit",
  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref2) {
    let {
      playerStageId,
      noCallback
    } = _ref2;
    const playerStage = PlayerStages.findOne(playerStageId);

    if (!playerStage) {
      throw new Error("playerStage not found");
    } // TODO check can update this record playerStage


    if (playerStage.submittedAt) {
      if (Meteor.isDevelopment) {
        console.log("stage already submitted");
      }

      return;
    }

    PlayerStages.update(playerStageId, {
      $set: {
        submittedAt: new Date()
      }
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnSubmit({
        playerId: playerStage.playerId,
        playerStage
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"player-stages.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/player-stages/player-stages.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PlayerStages: () => PlayerStages
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let TimestampSchema, UserDataSchema, BelongsTo;
module.link("../default-schemas", {
  TimestampSchema(v) {
    TimestampSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  },

  BelongsTo(v) {
    BelongsTo = v;
  }

}, 1);
const PlayerStages = new Mongo.Collection("player_stages");
PlayerStages.schema = new SimpleSchema({
  submittedAt: {
    type: Date,
    denyInsert: true,
    optional: true,
    index: 1
  }
});
PlayerStages.schema.extend(TimestampSchema);
PlayerStages.schema.extend(UserDataSchema);
PlayerStages.schema.extend(BelongsTo("Players"));
PlayerStages.schema.extend(BelongsTo("Stages"));
PlayerStages.schema.extend(BelongsTo("Rounds"));
PlayerStages.schema.extend(BelongsTo("Games"));
PlayerStages.schema.extend(BelongsTo("Batches"));
PlayerStages.attachSchema(PlayerStages.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"players":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/players/methods.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createPlayer: () => createPlayer,
  playerReady: () => playerReady,
  updatePlayerData: () => updatePlayerData,
  markPlayerExitStepDone: () => markPlayerExitStepDone,
  extendPlayerTimeoutWait: () => extendPlayerTimeoutWait,
  endPlayerTimeoutWait: () => endPlayerTimeoutWait,
  earlyExitPlayer: () => earlyExitPlayer,
  earlyExitPlayerLobby: () => earlyExitPlayerLobby,
  retireSinglePlayer: () => retireSinglePlayer,
  retireGameFullPlayers: () => retireGameFullPlayers,
  playerWasRetired: () => playerWasRetired,
  updatePlayerStatus: () => updatePlayerStatus
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Batches;
module.link("../batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 2);
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 3);
let IdSchema;
module.link("../default-schemas.js", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 4);
let LobbyConfigs;
module.link("../lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 5);
let Games;
module.link("../games/games.js", {
  Games(v) {
    Games = v;
  }

}, 6);
let Players;
module.link("./players", {
  Players(v) {
    Players = v;
  }

}, 7);
let exitStatuses;
module.link("./players.js", {
  exitStatuses(v) {
    exitStatuses = v;
  }

}, 8);
let sleep, weightedRandom;
module.link("../../lib/utils.js", {
  sleep(v) {
    sleep = v;
  },

  weightedRandom(v) {
    weightedRandom = v;
  }

}, 9);
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 10);
let gameLobbyLock;
module.link("../../gameLobby-lock.js", {
  default(v) {
    gameLobbyLock = v;
  }

}, 11);
const createPlayer = new ValidatedMethod({
  name: "Players.methods.create",
  validate: new SimpleSchema({
    id: {
      type: String
    },
    urlParams: {
      type: Object,
      blackbox: true,
      defaultValue: {}
    }
  }).validator(),

  run(player) {
    // Find the first running batch (in order of running started time)
    const batch = Batches.findOne({
      status: "running",
      full: false
    }, {
      sort: {
        runningAt: 1
      }
    });

    if (!batch) {
      // The UI should update and realize there is no batch available
      // This should be a rare case where a fraction of a second of
      // desynchornisation when the last available batch just finished.
      // If this is the case, since the user exist in the DB at this point
      // but has no lobby assigned, and the UI will soon determine there
      // is no available game, the UI will switch to "No experiments
      // available", nothing else to do.
      return;
    } // TODO: MAYBE, add verification that the user is not current connected
    // elsewhere and this is not a flagrant impersonation. Note that is
    // extremely difficult to guaranty. Could also add verification of user's
    // id with email verication for example. For now the assumption is that
    // there is no immediate reason or long-term motiviation for people to hack
    // each other's player account.


    const existing = Players.findOne({
      id: player.id
    }); // If the player already has a game lobby assigned, no need to
    // re-initialize them

    if (existing && existing.gameLobbyId) {
      return existing._id;
    }

    if (existing) {
      player = existing;
    } else {
      // Because of a bug in SimpleSchema around blackbox: true, skipping
      // validation here. Validation did happen at the method level though.
      player._id = Players.insert(player, {
        filter: false,
        validate: false
      });
    } // Looking for all lobbies for batch (for which that game has not started yet)


    const lobbies = GameLobbies.find({
      batchId: batch._id,
      status: "running",
      timedOutAt: {
        $exists: false
      },
      gameId: {
        $exists: false
      }
    }).fetch();

    if (lobbies.length === 0) {
      // This is the same case as when there are no batches available.
      return;
    } // Let's first try to find lobbies for which their queue isn't full yet


    let lobbyPool = lobbies.filter(l => l.availableCount > l.queuedPlayerIds.length); // If no lobbies still have "availability", just fill any lobby

    if (lobbyPool.length === 0) {
      lobbyPool = lobbies;
    } // Book proportially to total expected playerCount


    const weigthedLobbyPool = lobbyPool.map(lobby => {
      return {
        value: lobby,
        weight: lobby.availableCount
      };
    }); // Choose a lobby in the available weigthed pool

    const lobby = weightedRandom(weigthedLobbyPool)(); // Adding the player to specified lobby queue

    GameLobbies.update(lobby._id, {
      $addToSet: {
        queuedPlayerIds: player._id
      }
    });
    const gameLobbyId = lobby._id;
    const $set = {
      gameLobbyId
    }; // Check if there will be instructions

    let skipInstructions = lobby.debugMode; // If there are no instruction, mark the player as ready immediately

    if (skipInstructions) {
      $set.readyAt = new Date();
    }

    Players.update(player._id, {
      $set
    }); // If there are no instruction, player is ready, notify the lobby

    if (skipInstructions) {
      GameLobbies.update(gameLobbyId, {
        $addToSet: {
          playerIds: player._id
        }
      });
    }

    return player._id;
  }

});
const playerReady = new ValidatedMethod({
  name: "Players.methods.ready",
  validate: IdSchema.validator(),

  run(_ref) {
    return Promise.asyncApply(() => {
      let {
        _id
      } = _ref;

      if (!Meteor.isServer) {
        return;
      }

      try {
        // Lobby might be locked if game is currently being created.
        // We retry until lobby is unlocked.
        while (!assignToLobby(_id)) {
          Promise.await(sleep(1000));
        }
      } catch (error) {
        console.error("Players.methods.ready", error);
      }
    });
  }

});

function assignToLobby(_id) {
  const player = Players.findOne(_id);

  if (!player) {
    throw "unknown ready player: ".concat(_id);
  }

  const {
    readyAt,
    gameLobbyId
  } = player;

  if (readyAt) {
    // Already ready
    return true;
  }

  const lobby = GameLobbies.findOne(gameLobbyId);

  if (!lobby) {
    throw "unknown lobby for ready player: ".concat(_id);
  } // GameLobby is locked.


  if (gameLobbyLock[gameLobbyId]) {
    return false;
  } // Game is Full, bail the player


  if (lobby.playerIds.length === lobby.availableCount) {
    // User already ready, something happened out of order
    if (lobby.playerIds.includes(_id)) {
      return true;
    } // Mark the player's participation attemp as failed if
    // not already marked exited


    Players.update({
      _id,
      exitAt: {
        $exists: false
      }
    }, {
      $set: {
        exitAt: new Date(),
        exitStatus: "gameFull"
      }
    });
    return true;
  } // Try to update the GameLobby with the playerIds we just queried.


  GameLobbies.update({
    _id: gameLobbyId,
    playerIds: lobby.playerIds
  }, {
    $addToSet: {
      playerIds: _id
    }
  }); // If the playerId insert succeeded (playerId WAS added to playerIds),
  // mark the user record as ready and potentially start the individual
  // lobby timer.

  const lobbyUpdated = GameLobbies.findOne(gameLobbyId);

  if (lobbyUpdated.playerIds.includes(_id)) {
    // If it did work, mark player as ready
    $set = {
      readyAt: new Date()
    }; // If it's an individual lobby timeout, mark the first timer as started.

    const lobbyConfig = LobbyConfigs.findOne(lobbyUpdated.lobbyConfigId);

    if (lobbyConfig.timeoutType === "individual") {
      $set.timeoutStartedAt = new Date();
      $set.timeoutWaitCount = 1;
    }

    Players.update(_id, {
      $set
    });
    return true;
  } // If the playerId insert failed (playerId NOT added to playerIds), the
  // playerIds has changed since it was queried and the lobby might not
  // have any available slots left, loop and retry.


  return false;
}

const updatePlayerData = new ValidatedMethod({
  name: "Players.methods.updateData",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref2) {
    let {
      playerId,
      key,
      value,
      append,
      noCallback
    } = _ref2;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    } // TODO check can update this record player


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    Players.update(playerId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        playerId,
        player,
        key,
        value: val,
        prevValue: player.data && player.data[key],
        append
      });
    }
  }

});
const markPlayerExitStepDone = new ValidatedMethod({
  name: "Players.methods.markExitStepDone",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    stepName: {
      type: String
    }
  }).validator(),

  run(_ref3) {
    let {
      playerId,
      stepName
    } = _ref3;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    } // TODO check can update this record player


    Players.update(playerId, {
      $addToSet: {
        exitStepsDone: stepName
      }
    });
  }

});
const extendPlayerTimeoutWait = new ValidatedMethod({
  name: "Players.methods.extendTimeoutWait",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(_ref4) {
    let {
      playerId
    } = _ref4;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    }

    Players.update(playerId, {
      $inc: {
        timeoutWaitCount: 1
      },
      $set: {
        timeoutStartedAt: new Date()
      }
    });
  }

});
const endPlayerTimeoutWait = new ValidatedMethod({
  name: "Players.methods.endTimeoutWait",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(_ref5) {
    let {
      playerId
    } = _ref5;
    const player = Players.findOne(playerId);

    if (!player) {
      throw new Error("player not found");
    }

    Players.update(playerId, {
      $set: {
        exitStatus: "playerEndedLobbyWait",
        exitAt: new Date()
      }
    });
    GameLobbies.update(player.gameLobbyId, {
      $pull: {
        playerIds: playerId // We keep the player in queuedPlayerIds so they will still have the
        // fact they were in a lobby available in the UI, and so we can show
        // them the exit steps.

      }
    });
  }

});
const earlyExitPlayer = new ValidatedMethod({
  name: "Players.methods.admin.earlyExitPlayer",
  validate: new SimpleSchema({
    exitReason: {
      label: "Reason for Exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    gameId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(_ref6) {
    let {
      exitReason,
      playerId,
      gameId
    } = _ref6;

    if (!Meteor.isServer) {
      return;
    }

    const game = Games.findOne(gameId);

    if (!game) {
      throw new Error("game not found");
    }

    if (game && game.finishedAt) {
      if (Meteor.isDevelopment) {
        console.log("\n\ngame already ended!");
      }

      return;
    }

    const currentPlayer = Players.findOne(playerId);

    if (currentPlayer && currentPlayer.exitAt) {
      if (Meteor.isDevelopment) {
        console.log("\nplayer already exited!");
      }

      return;
    }

    Players.update(playerId, {
      $set: {
        exitAt: new Date(),
        exitStatus: "custom",
        exitReason
      }
    });
    const players = Players.find({
      gameId
    }).fetch();
    const onlinePlayers = players.filter(player => !player.exitAt);

    if (!onlinePlayers || onlinePlayers && onlinePlayers.length === 0) {
      Games.update(gameId, {
        $set: {
          finishedAt: new Date(),
          status: "custom",
          endReason: "finished_early"
        }
      });
      GameLobbies.update({
        gameId
      }, {
        $set: {
          status: "custom",
          endReason: "finished_early"
        }
      });
    }
  }

});
const earlyExitPlayerLobby = new ValidatedMethod({
  name: "Players.methods.admin.earlyExitPlayerLobby",
  validate: new SimpleSchema({
    exitReason: {
      label: "Reason for Exit",
      type: String,
      regEx: /[a-zA-Z0-9_]+/
    },
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    gameLobbyId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(_ref7) {
    let {
      exitReason,
      playerId,
      gameLobbyId
    } = _ref7;

    if (!Meteor.isServer) {
      return;
    }

    const gameLobby = GameLobbies.findOne(gameLobbyId);

    if (!gameLobby) {
      throw new Error("gameLobby not found");
    }

    const currentPlayer = Players.findOne(playerId);

    if (currentPlayer && currentPlayer.exitAt) {
      if (Meteor.isDevelopment) {
        console.log("\nplayer already exited!");
      }

      return;
    }

    Players.update(playerId, {
      $set: {
        exitAt: new Date(),
        exitStatus: "custom",
        exitReason
      }
    });
  }

});
const retireSinglePlayer = new ValidatedMethod({
  name: "Players.methods.admin.retireSingle",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(_ref8) {
    let {
      playerId
    } = _ref8;

    if (!playerId) {
      throw new Error("empty playerId");
    }

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const player = Players.findOne({
      _id: playerId,
      retiredAt: {
        $exists: false
      }
    });

    if (!player) {
      throw new Error("Player not found");
    }

    const timestamp = new Date().toISOString();
    Players.update(playerId, {
      $set: {
        id: "".concat(player.id, " (Retired custom at ").concat(timestamp, ")"),
        retiredAt: new Date(),
        retiredReason: "custom"
      }
    });
    return player;
  }

});
const retireGameFullPlayers = new ValidatedMethod({
  name: "Players.methods.admin.retireGameFull",
  validate: new SimpleSchema({
    retiredReason: {
      label: "Retired Reason",
      type: String,
      optional: true,
      allowedValues: exitStatuses
    }
  }).validator(),

  run(_ref9) {
    let {
      retiredReason
    } = _ref9;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const players = Players.find({
      exitStatus: retiredReason,
      retiredAt: {
        $exists: false
      }
    }).fetch();
    const timestamp = new Date().toISOString();

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      Players.update(player._id, {
        $set: {
          id: "".concat(player.id, " (Retired ").concat(retiredReason, " at ").concat(timestamp, ")"),
          retiredAt: new Date(),
          retiredReason
        }
      });
    }

    return players.length;
  }

});
const playerWasRetired = new ValidatedMethod({
  name: "Players.methods.playerWasRetired",
  validate: IdSchema.validator(),

  run(_ref10) {
    let {
      _id
    } = _ref10;
    return Boolean(Players.findOne({
      _id,
      exitStatus: {
        $exists: true
      },
      retiredAt: {
        $exists: true
      }
    }));
  }

});
const updatePlayerStatus = new ValidatedMethod({
  name: "Players.methods.updateStatus",
  validate: new SimpleSchema({
    playerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    idle: {
      type: Boolean
    },
    lastActivityAt: {
      type: Date
    }
  }).validator(),

  run(_ref11) {
    let {
      playerId,
      idle,
      lastActivityAt
    } = _ref11;

    if (Meteor.isServer) {
      const playerIdConn = shared.playerIdForConn(this.connection);

      if (!playerIdConn) {
        return;
      }

      if (playerId !== playerIdConn) {
        console.error("Attempting to update player status from wrong connection");
        return;
      }
    }

    Players.update(playerId, {
      $set: {
        idle,
        lastActivityAt
      }
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"players.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/players/players.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Players: () => Players,
  exitStatuses: () => exitStatuses
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Counter;
module.link("../../lib/counters", {
  Counter(v) {
    Counter = v;
  }

}, 1);
let BelongsTo, TimestampSchema, UserDataSchema;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  }

}, 2);

class PlayersCollection extends Mongo.Collection {
  insert(doc, callback) {
    doc.index = Counter.inc("players");
    return super.insert(doc, callback);
  }

}

const Players = new PlayersCollection("players");
const exitStatuses = ["gameFull", "gameCancelled", "gameLobbyTimedOut", "playerEndedLobbyWait", "playerLobbyTimedOut", "finished", "cancelled", "failed", "custom"];
Players.schema = new SimpleSchema({
  // The Player `id` is used to uniquely identify the player to avoid
  // having a user play multiple times. It can be any string, for example
  // an email address, a Mechanical Turk ID, a manually assigned participation
  // number (saved as string), etc...
  id: {
    type: String,
    max: 256
  },
  // True if the player is currently online and idle
  idle: {
    label: "Idle",
    type: Boolean,
    optional: true
  },
  // True if the player is currently online
  online: {
    label: "Online",
    type: Boolean,
    optional: true
  },
  // Time when the player was last seen online and active
  lastActivityAt: {
    label: "Last Activity At",
    type: Date,
    optional: true
  },
  lastLogin: {
    type: Object,
    optional: true
  },
  "lastLogin.at": {
    type: Date,
    optional: true
  },
  "lastLogin.ip": {
    type: String,
    optional: true
  },
  "lastLogin.userAgent": {
    type: String,
    optional: true
  },
  // Auto-incremented number assigned to players as they are created
  index: {
    type: SimpleSchema.Integer
  },
  // params contains any URL passed parameters
  urlParams: {
    type: Object,
    blackbox: true,
    defaultValue: {}
  },
  bot: {
    label: "Name of bot definition if player is a bot",
    type: String,
    optional: true,
    index: 1
  },
  // Time at witch the player became ready (done with intro)
  readyAt: {
    label: "Ready At",
    type: Date,
    optional: true
  },
  timeoutStartedAt: {
    label: "Time the first player arrived in the lobby",
    type: Date,
    optional: true
  },
  timeoutWaitCount: {
    label: "Number of time the player has waited for timeoutStartedAt",
    type: SimpleSchema.Integer,
    optional: true,
    min: 1
  },
  exitStepsDone: {
    type: Array,
    defaultValue: []
  },
  "exitStepsDone.$": {
    type: String
  },
  // Failed fields are filled when the player's participation in a game failed
  exitAt: {
    label: "Exited At",
    type: Date,
    optional: true
  },
  exitStatus: {
    label: "Failed Status",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  },
  exitReason: {
    label: "Failed Reason",
    type: String,
    optional: true,
    regEx: /[a-zA-Z0-9_]+/
  },
  // A player can be retired. Retired players should no longer be used in active
  // game, but NOTHING is done in the code to block that from happening. It's
  // more of an indicator for debugging down the line.
  retiredAt: {
    label: "Retired At",
    type: Date,
    optional: true
  },
  retiredReason: {
    label: "Retired Reason",
    type: String,
    optional: true,
    allowedValues: exitStatuses
  }
});
Players.schema.extend(TimestampSchema);
Players.schema.extend(UserDataSchema);
Players.schema.extend(BelongsTo("Games", false));
Players.schema.extend(BelongsTo("GameLobbies", false));
Players.attachSchema(Players.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/players/server/publications.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let savePlayerId;
module.link("../../../startup/server/connections.js", {
  savePlayerId(v) {
    savePlayerId = v;
  }

}, 0);
let Players;
module.link("../players.js", {
  Players(v) {
    Players = v;
  }

}, 1);
Meteor.publish("admin-players", function (props) {
  if (!this.userId) {
    return null;
  }

  if (!props || props.retired === undefined) {
    return Players.find();
  }

  return Players.find({
    retiredAt: {
      $exists: Boolean(props.retired)
    }
  });
});
Meteor.publish("playerInfo", function (_ref) {
  let {
    playerId
  } = _ref;
  const selector = {
    _id: playerId,
    retiredAt: {
      $exists: false
    }
  };
  const playerExists = Players.find(selector).count() > 0;

  if (playerExists) {
    savePlayerId(this.connection, playerId);
  }

  return Players.find(selector);
});
const clients = {};
let hasPlayers = false;
Meteor.startup(() => {
  let initializing = true;
  hasPlayers = Players.find().count() > 0; // `observeChanges` only returns after the initial `added` callbacks have run.
  // Until then, we don't want to send a lot of `changed` messages—hence
  // tracking the `initializing` state.

  const handle = Players.find({}, {
    fields: {
      _id: 1
    }
  }).observeChanges({
    added: id => {
      if (initializing) {
        return;
      }

      if (Players.find().count() > 0 && !hasPlayers) {
        hasPlayers = true;

        for (const id in clients) {
          if (clients.hasOwnProperty(id)) {
            const client = clients[id];
            client.changed("hasPlayers", "id", {
              hasPlayers
            });
          }
        }
      }
    },
    removed: id => {
      if (Players.find().count() === 0 && hasPlayers) {
        hasPlayers = false;

        for (const id in clients) {
          if (clients.hasOwnProperty(id)) {
            const client = clients[id];
            client.changed("hasPlayers", "id", {
              hasPlayers
            });
          }
        }
      }
    }
  });
  initializing = false;
});
Meteor.publish(null, function () {
  clients[this.connection.id] = this;
  this.added("hasPlayers", "id", {
    hasPlayers
  });
  this.ready();
  this.onStop(() => delete clients[this.connection.id]);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"rounds":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/rounds/methods.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updateRoundData: () => updateRoundData
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Rounds;
module.link("./rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 2);
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 3);
const updateRoundData = new ValidatedMethod({
  name: "Rounds.methods.updateData",
  validate: new SimpleSchema({
    roundId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      roundId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const round = Rounds.findOne(roundId);

    if (!round) {
      throw new Error("round not found");
    } // TODO check can update this record round


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    Rounds.update(roundId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        roundId,
        round,
        key,
        value: val,
        prevValue: round.data && round.data[key],
        append
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"rounds.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/rounds/rounds.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Rounds: () => Rounds
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let BelongsTo, HasManyByRef, UserDataSchema, TimestampSchema;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  HasManyByRef(v) {
    HasManyByRef = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  }

}, 1);
const Rounds = new Mongo.Collection("rounds");
Rounds.schema = new SimpleSchema({
  // Index represents the 0 based position of the current round in the ordered
  // list of a game's rounds. For display, add 1.
  index: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 9999 // That's a lot of rounds...

  }
});
Rounds.schema.extend(TimestampSchema);
Rounds.schema.extend(UserDataSchema);
Rounds.schema.extend(HasManyByRef("Stages"));
Rounds.schema.extend(BelongsTo("Games"));
Rounds.schema.extend(HasManyByRef("PlayerRounds"));
Rounds.attachSchema(Rounds.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"onchange.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/server/onchange.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  callOnChange: () => callOnChange
});
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 0);
let Games;
module.link("../games/games.js", {
  Games(v) {
    Games = v;
  }

}, 1);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 2);
let Rounds;
module.link("../rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 3);
let Stages;
module.link("../stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 4);
let Treatments;
module.link("../treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 5);
let augmentGameStageRound, augmentPlayerStageRound;
module.link("../player-stages/augment.js", {
  augmentGameStageRound(v) {
    augmentGameStageRound = v;
  },

  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  }

}, 6);
let augmentGameObject;
module.link("../games/augment.js", {
  augmentGameObject(v) {
    augmentGameObject = v;
  }

}, 7);
let config;
module.link("../../server", {
  config(v) {
    config = v;
  }

}, 8);
const targets = {
  playerStageId: "playerStage",
  playerRoundId: "playerRound",
  stageId: "stage",
  roundId: "round",
  gameId: "game"
}; // Central point for triggering the onSet, onAppend and onChange callbacks.
// These callbacks are called when the experiment code calls custom data update
// methods on games, rounds, stages, players, playerRounds or playerStages.
// onSet is called when the .set() method is used.
// onAppend is called when the .append() method is used.
// onChange is called when the .set() or .append() method is used.

const callOnChange = params => {
  const cbName = params.append ? "onAppend" : "onSet";
  const {
    onChange,
    [cbName]: onSetAppend
  } = config;
  const callbacks = [];

  if (onSetAppend) {
    callbacks.push(onSetAppend);
  }

  if (onChange) {
    callbacks.push(onChange);
  }

  if (callbacks.length === 0) {
    return;
  }

  if (params.conn && !params.playerId) {
    params.playerId = shared.playerIdForConn(params.conn);
  }

  let target = params.player,
      targetType = "player";

  for (const key in targets) {
    if (params[key]) {
      targetType = targets[key];
      target = params[targets[key]]; // Update field to latest value

      if (params.append) {
        if (!target.data[params.key]) {
          target.data[params.key] = [params.value];
        } else {
          target.data[params.key] = target.data[params.key].slice(0);
          target.data[params.key].push(params.value);
        }
      } else {
        target.data[params.key] = params.value;
      }

      break;
    }
  }

  let {
    player,
    game,
    round,
    stage
  } = params;
  player = player || Players.findOne(params.playerId);
  game = game || Games.findOne(player.gameId);

  if (!game) {
    console.error("".concat(targetType, " data updated without game"));
    return;
  }

  stage = stage || Stages.findOne(game.currentStageId);

  if (!stage) {
    console.error("".concat(targetType, " data updated without stage"));
    return;
  }

  const {
    roundId
  } = stage;
  round = round || Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);
  augmentGameObject({
    game,
    treatment,
    round,
    stage
  });
  augmentGameStageRound(game, stage, round);
  callbacks.forEach(callback => {
    callback(game, round, stage, player, target, targetType, params.key, params.value, params.prevValue, params.append // for onChange
    );
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"onsubmit.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/server/onsubmit.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  callOnSubmit: () => callOnSubmit
});
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 0);
let Games;
module.link("../games/games.js", {
  Games(v) {
    Games = v;
  }

}, 1);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 2);
let Rounds;
module.link("../rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 3);
let Stages;
module.link("../stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 4);
let Treatments;
module.link("../treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 5);
let augmentGameStageRound, augmentPlayerStageRound;
module.link("../player-stages/augment.js", {
  augmentGameStageRound(v) {
    augmentGameStageRound = v;
  },

  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  }

}, 6);
let augmentGameObject;
module.link("../games/augment.js", {
  augmentGameObject(v) {
    augmentGameObject = v;
  }

}, 7);
let config;
module.link("../../server", {
  config(v) {
    config = v;
  }

}, 8);

const callOnSubmit = params => {
  const {
    onSubmit
  } = config;

  if (!onSubmit) {
    return;
  }

  const {
    playerId,
    playerStage
  } = params;
  const player = Players.findOne(playerId);
  const game = Games.findOne(player.gameId);

  if (!game) {
    console.error("".concat(targetType, " data updated without game"));
    return;
  }

  const stage = Stages.findOne(playerStage.stageId);

  if (!stage) {
    console.error("".concat(targetType, " data updated without stage"));
    return;
  }

  const {
    roundId
  } = stage;
  const round = Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);
  augmentGameObject({
    game,
    treatment,
    round,
    stage
  });
  augmentGameStageRound(game, stage, round);
  player.stage = _.extend({}, stage);
  player.round = _.extend({}, round);
  augmentPlayerStageRound(player, player.stage, player.round, game);
  onSubmit(game, round, stage, player);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"stages":{"finish.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/stages/finish.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  endOfStage: () => endOfStage
});
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 0);
let config;
module.link("../../server", {
  config(v) {
    config = v;
  }

}, 1);
let Games;
module.link("../games/games.js", {
  Games(v) {
    Games = v;
  }

}, 2);
let augmentGameStageRound, augmentPlayerStageRound;
module.link("../player-stages/augment.js", {
  augmentGameStageRound(v) {
    augmentGameStageRound = v;
  },

  augmentPlayerStageRound(v) {
    augmentPlayerStageRound = v;
  }

}, 3);
let augmentGameObject;
module.link("../games/augment.js", {
  augmentGameObject(v) {
    augmentGameObject = v;
  }

}, 4);
let Players;
module.link("../players/players.js", {
  Players(v) {
    Players = v;
  }

}, 5);
let Rounds;
module.link("../rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 6);
let Treatments;
module.link("../treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 7);
let Stages;
module.link("./stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 8);
let GameLobbies;
module.link("../game-lobbies/game-lobbies", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 9);
// endOfStage should only ever run once per stageId. If one of the callback
// (or the execution of endOfStage itself) takes too much time, a second
// trigger could try to run endOfStage again (e.g. all players submitted +
// cron). The lock ensures endOfStage can only run once.
const lock = {};

const endOfStage = stageId => {
  if (lock[stageId]) {
    return;
  }

  lock[stageId] = true;
  const stage = Stages.findOne(stageId);
  const {
    index,
    gameId,
    roundId
  } = stage;
  const game = Games.findOne(gameId);
  const round = Rounds.findOne(roundId);
  const treatment = Treatments.findOne(game.treatmentId);
  augmentGameObject({
    game,
    treatment,
    round,
    stage
  });
  augmentGameStageRound(game, stage, round);
  const {
    onStageEnd,
    onRoundEnd,
    onRoundStart,
    onStageStart
  } = config;

  if (onStageEnd) {
    onStageEnd(game, round, stage);
  }

  const nextStage = Stages.findOne({
    gameId,
    index: index + 1
  });

  if (onRoundEnd && !nextStage || stage.roundId !== nextStage.roundId) {
    onRoundEnd(game, round);
  }

  if (nextStage && (onRoundStart || onStageStart)) {
    const nextRound = Rounds.findOne(nextStage.roundId);
    augmentGameStageRound(game, nextStage, nextRound);
    game.players.forEach(player => {
      player.round = _.extend({}, nextRound);
      player.stage = _.extend({}, nextStage);
      augmentPlayerStageRound(player, player.stage, player.round, game);
    });

    if (onRoundStart && stage.roundId !== nextStage.roundId) {
      onRoundStart(game, nextRound);
    }

    if (onStageStart) {
      onStageStart(game, nextRound, nextStage);
    }
  }

  if (nextStage) {
    // go to next stage
    const currentStageId = nextStage._id;
    Games.update(gameId, {
      $set: {
        currentStageId
      }
    });
    const startTimeAt = moment().add(Stages.stagePaddingDuration);
    Stages.update(currentStageId, {
      $set: {
        startTimeAt: startTimeAt.toDate()
      }
    });
  } else {
    const onGameEnd = config.onGameEnd;

    if (onGameEnd) {
      onGameEnd(game);
    }

    Players.update({
      _id: {
        $in: _.pluck(game.players, "_id"),
        $exists: {
          exitStatus: false
        }
      }
    }, {
      $set: {
        exitStatus: "finished",
        exitAt: new Date()
      }
    }, {
      multi: true
    });
    Games.update(gameId, {
      $set: {
        finishedAt: new Date(),
        status: "finished"
      }
    });
    GameLobbies.update({
      gameId
    }, {
      $set: {
        status: "finished"
      }
    });
  }

  delete lock[stageId];
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/stages/methods.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  updateStageData: () => updateStageData
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Stages;
module.link("./stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 2);
let shared;
module.link("../../shared.js", {
  default(v) {
    shared = v;
  }

}, 3);
const updateStageData = new ValidatedMethod({
  name: "Stages.methods.updateData",
  validate: new SimpleSchema({
    stageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: String
    },
    append: {
      type: Boolean,
      optional: true
    },
    noCallback: {
      type: Boolean,
      optional: true
    }
  }).validator(),

  run(_ref) {
    let {
      stageId,
      key,
      value,
      append,
      noCallback
    } = _ref;
    const stage = Stages.findOne(stageId);

    if (!stage) {
      throw new Error("stage not found");
    } // TODO check can update this record stage


    const val = JSON.parse(value);
    let update = {
      ["data.".concat(key)]: val
    };
    const modifier = append ? {
      $push: update
    } : {
      $set: update
    };
    Stages.update(stageId, modifier, {
      autoConvert: false,
      filter: false,
      validate: false,
      trimStrings: false,
      removeEmptyStrings: false
    });

    if (Meteor.isServer && !noCallback) {
      shared.callOnChange({
        conn: this.connection,
        stageId,
        stage,
        key,
        value: val,
        prevValue: stage.data && stage.data[key],
        append
      });
    }
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stages.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/stages/stages.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Stages: () => Stages
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 1);
let BelongsTo, TimestampSchema, UserDataSchema, HasManyByRef;
module.link("../default-schemas", {
  BelongsTo(v) {
    BelongsTo = v;
  },

  TimestampSchema(v) {
    TimestampSchema = v;
  },

  UserDataSchema(v) {
    UserDataSchema = v;
  },

  HasManyByRef(v) {
    HasManyByRef = v;
  }

}, 2);
let Games;
module.link("../games/games", {
  Games(v) {
    Games = v;
  }

}, 3);
let PlayerStages;
module.link("../player-stages/player-stages", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 4);
let Rounds;
module.link("../rounds/rounds", {
  Rounds(v) {
    Rounds = v;
  }

}, 5);
const Stages = new Mongo.Collection("stages");
Stages.helpers({
  round() {
    return Rounds.findOne(this.roundId);
  }

});
Stages.stagePaddingDuration = moment.duration(0.25, "seconds");
Stages.schema = new SimpleSchema({
  // Index represents the 0 based position of the current stage in the ordered
  // list of a all the game's stages. For display, add 1.
  index: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 999999 // That's a lot of stages...

  },
  name: {
    type: String,
    max: 64
  },
  displayName: {
    type: String,
    max: 128 // TODO Add auto value to by default copy the name into the displayName?

  },
  // This will synchronize the clients timer start time and record start time
  // for the record
  startTimeAt: {
    type: Date,
    optional: true
  },
  durationInSeconds: {
    type: SimpleSchema.Integer,
    // One day, that's a lot, but could be "weird" experiment, yet no going nuts
    // into hundreds of years for example.
    max: 24 * 60 * 60,
    // It would be difficult to manage a timer that is less than 5s given all
    // the multi-peer synchronization going on.
    min: 5
  }
});
Stages.schema.extend(TimestampSchema);
Stages.schema.extend(UserDataSchema);
Stages.schema.extend(BelongsTo("Rounds"));
Stages.schema.extend(BelongsTo("Games"));
Stages.schema.extend(HasManyByRef("PlayerStages"));
Stages.attachSchema(Stages.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"treatments":{"methods.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/treatments/methods.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  createTreatment: () => createTreatment,
  updateTreatment: () => updateTreatment
});
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let IdSchema;
module.link("../default-schemas.js", {
  IdSchema(v) {
    IdSchema = v;
  }

}, 2);
let FactorTypes;
module.link("../factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 3);
let Factors;
module.link("../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 4);
let Treatments;
module.link("./treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 5);
const createTreatment = new ValidatedMethod({
  name: "Treatments.methods.create",
  validate: new SimpleSchema({
    name: {
      type: String,
      max: 256,
      optional: true
    },
    factorIds: {
      type: Array,
      label: "Factors"
    },
    "factorIds.$": {
      type: String
    }
  }).validator(),

  run(treatment) {
    if (!this.userId) {
      throw new Error("unauthorized");
    } // Validate the required factor types


    const requiredFactorTypes = FactorTypes.find({
      required: true,
      archivedAt: {
        $exists: false
      }
    }).fetch();

    if (requiredFactorTypes.length > 0) {
      const createdFactors = Factors.find({
        _id: {
          $in: treatment.factorIds
        }
      }).fetch();
      const createdFactorTypes = FactorTypes.find({
        $and: [{
          _id: {
            $in: createdFactors.map(f => f.factorTypeId)
          }
        }, {
          required: true
        }]
      }).fetch();

      if (requiredFactorTypes.length !== createdFactorTypes.length) {
        throw new Error("Fill all required factors!");
      }
    }

    Treatments.insert(treatment);
  }

});
const updateTreatment = new ValidatedMethod({
  name: "Treatments.methods.update",
  validate: Treatments.schema.pick("name").extend(new SimpleSchema({
    archived: {
      type: Boolean,
      optional: true
    }
  })).extend(IdSchema).validator(),

  run(_ref) {
    let {
      _id,
      name,
      archived
    } = _ref;

    if (!this.userId) {
      throw new Error("unauthorized");
    }

    const treatment = Treatments.findOne(_id);

    if (!treatment) {
      throw new Error("not found");
    }

    const $set = {},
          $unset = {};

    if (name !== undefined) {
      $set.name = name;
    }

    if (archived !== undefined) {
      if (archived) {
        if (treatment.archivedAt) {
          throw new Error("not found");
        }

        $set.archivedAt = new Date();
        $set.archivedById = this.userId;
      }

      if (!archived) {
        if (!treatment.archivedAt) {
          throw new Error("not found");
        }

        $unset.archivedAt = true;
        $unset.archivedById = true;
      }
    }

    const modifier = {};

    if (Object.keys($set).length > 0) {
      modifier.$set = $set;
    }

    if (Object.keys($unset).length > 0) {
      modifier.$unset = $unset;
    }

    if (Object.keys(modifier).length === 0) {
      return;
    }

    Treatments.update(_id, modifier);
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"treatments.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/treatments/treatments.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Treatments: () => Treatments
});
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Factors;
module.link("../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 1);
let FactorTypes;
module.link("../factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 2);
let TimestampSchema, ArchivedSchema;
module.link("../default-schemas", {
  TimestampSchema(v) {
    TimestampSchema = v;
  },

  ArchivedSchema(v) {
    ArchivedSchema = v;
  }

}, 3);
const Treatments = new Mongo.Collection("treatments");
Treatments.helpers({
  displayName() {
    return this.name || _.map(this.factors(), c => c.fullLabel()).join(" - ");
  },

  factor(name) {
    const type = FactorTypes.findOne({
      name
    });

    if (!type) {
      return;
    }

    return this.factors().find(c => c.factorTypeId === type._id);
  },

  factors() {
    const query = {
      _id: {
        $in: this.factorIds
      }
    };
    return Factors.find(query).fetch();
  },

  factorsObject() {
    const doc = {};
    this.factors().forEach(c => {
      const type = FactorTypes.findOne(c.factorTypeId);
      doc[type.name] = c.value;
    });
    return doc;
  }

});
Treatments.schema = new SimpleSchema({
  // Optional experimenter given name for the treatment
  name: {
    type: String,
    max: 256,
    optional: true,

    custom() {
      if (this.isSet && Treatments.find({
        name: this.value
      }).count() > 0) {
        return "notUnique";
      }
    } // regEx: /^[a-zA-Z0-9_]+$/


  },
  // Array of factorIds
  factorIds: {
    type: Array,
    minCount: FactorTypes.requiredTypes,
    label: "Factors",
    index: true,
    denyUpdate: true // // Custom validation verifies required factors are present and that
    // // there are no duplicate factors with the same key. We cannot easily
    // // verify one of each factors is present.
    // custom() {
    //   if (!Meteor.isServer || !this.isInsert) {
    //     return;
    //   }
    //   const factors = Factors.find({ _id: { $in: this.value } }).fetch();
    //   const doc = {};
    //   factors.forEach(c => (doc[c.type] = c.value));
    //   const context = factorsSchema.newContext();
    //   context.validate(doc);
    //   if (!context.isValid()) {
    //     const error = {
    //       name: "factorIds",
    //       type: "invalid",
    //       details: context.validationErrors()
    //     };
    //     this.addValidationErrors([error]);
    //     return "invalid";
    //   }
    // }

  },
  "factorIds.$": {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: "Factor Item"
  }
});
Treatments.schema.addDocValidator((_ref) => {
  let {
    factorIds
  } = _ref;

  if (!this.isInsert) {
    return [];
  }

  const query = {
    factorIds: {
      $size: factorIds.length,
      $all: factorIds
    }
  };

  if (Boolean(Treatments.findOne(query))) {
    return [{
      name: "factorIds",
      type: "notUnique"
    }];
  }

  return [];
});
Treatments.schema.extend(TimestampSchema);
Treatments.schema.extend(ArchivedSchema);
Treatments.attachSchema(Treatments.schema);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"publications.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/api/treatments/server/publications.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Treatments;
module.link("../treatments", {
  Treatments(v) {
    Treatments = v;
  }

}, 0);
let Factors;
module.link("../../factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 1);
let FactorTypes;
module.link("../../factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 2);
Meteor.publish("admin-treatments", function (_ref) {
  let {
    archived
  } = _ref;

  if (!this.userId) {
    return null;
  }

  if (archived === undefined) {
    return Treatments.find();
  }

  return Treatments.find({
    archivedAt: {
      $exists: Boolean(archived)
    }
  });
});
Meteor.publish("treatment", function (treatmentId) {
  if (!treatmentId) {
    return [];
  }

  const treatment = Treatments.findOne(treatmentId);

  if (!treatment) {
    return [];
  }

  return [Treatments.find(treatmentId), Factors.find({
    _id: {
      $in: treatment.factorIds
    }
  }), FactorTypes.find()];
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"lib":{"componentChecker.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/lib/componentChecker.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
!function (module1) {
  let React;
  module1.link("react", {
    default(v) {
      React = v;
    }

  }, 0);

  function isClassComponent(component) {
    return typeof component === "function" && !!component.prototype.isReactComponent ? true : false;
  }

  function isFunctionComponent(component) {
    return typeof component === "function" && String(component).includes("return React.createElement") ? true : false;
  }

  function isReactComponent(component) {
    return isClassComponent(component) || isFunctionComponent(component) ? true : false;
  }

  function isElement(element) {
    return React.isValidElement(element);
  }

  function isDOMTypeElement(element) {
    return isElement(element) && typeof element.type === "string";
  }

  function isCompositeTypeElement(element) {
    return isElement(element) && typeof element.type === "function";
  }

  module.exports = {
    isClassComponent,
    isFunctionComponent,
    isReactComponent,
    isElement,
    isDOMTypeElement,
    isCompositeTypeElement
  };
}.call(this, module);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"counters.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/lib/counters.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Counter: () => Counter
});
// Named Atomic counters
//
// Example:
//    Counter.inc("something") // => 1
//    Counter.inc("something") // => 2
//    Counter.inc("something", 8) // => 10
//    Counter.inc("something", -5) // => 5
//    Counter.set("something", 42) // => 42
let incset;

if (Meteor.isServer) {
  const raw = new Mongo.Collection("counters").rawCollection();
  findAndModify = Meteor.wrapAsync(raw.findAndModify, raw);

  incset = op => function (name) {
    let amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    const res = findAndModify({
      _id: name
    }, // query
    null, // sort
    {
      ["$".concat(op)]: {
        value: amount
      }
    }, // update
    {
      new: true,
      upsert: true
    } // options
    );
    return res.value && res.value.value;
  };
} else {
  incset = op => () => {};
}

const Counter = {
  inc: incset("inc"),
  set: incset("set")
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"log.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/lib/log.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let logging;
module.link("loglevel", {
  "*"(v) {
    logging = v;
  }

}, 0);
const log = logging.getLogger("main"); // Fallback level if none is set in config file

log.setDefaultLevel(Meteor.isDevelopment ? "info" : "warn"); // Log level is set in "public" so it's accessible on the client
// Valid log level strings are: trace, debug, info, warn, error or silent.

if (Meteor.settings.public.loglevel) {
  log.setLevel(Meteor.settings.public.loglevel);
}

module.exportDefault(log);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utils.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/lib/utils.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  sleep: () => sleep,
  weightedRandom: () => weightedRandom,
  isReactComponents: () => isReactComponents,
  getFunctionParameters: () => getFunctionParameters,
  handleFactorValueErrorMessage: () => handleFactorValueErrorMessage
});
let isClassComponent, isFunctionComponent, isReactComponent, isElement;
module.link("./componentChecker", {
  isClassComponent(v) {
    isClassComponent = v;
  },

  isFunctionComponent(v) {
    isFunctionComponent = v;
  },

  isReactComponent(v) {
    isReactComponent = v;
  },

  isElement(v) {
    isElement = v;
  }

}, 0);

const sleep = ms => {
  return new Promise(function (resolve, _) {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const weightedRandom = values => {
  const samples = [];

  for (var i = 0; i < values.length; i += 1) {
    if (!values[i] || !values[i].hasOwnProperty("value") || !values[i].hasOwnProperty("weight")) {
      throw "all values passed to weightedRandom must have a value and weight field";
    }

    for (var j = 0; j < values[i].weight; j += 1) {
      samples.push(values[i].value);
    }
  }

  return () => samples[Math.floor(Math.random() * samples.length)];
};

const isReactComponents = components => {
  let isValid = true;

  if (components && _.isArray(components)) {
    for (let i = 0; i < components.length; i++) {
      if (!isClassComponent(components[i]) && !isFunctionComponent(components[i]) && !isReactComponent(components[i]) && !isElement(components[i])) {
        console.error("component is not a React Component!", components[i]);
        isValid = false;
        break;
      }
    }
  } else {
    console.error("components is not Valid!");
    isValid = false;
  }

  return isValid;
};

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
let ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;

const getFunctionParameters = func => {
  let fnStr = func.toString().replace(STRIP_COMMENTS, "");
  fnStr = fnStr.split("=>")[0];
  const argsList = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"));
  const result = argsList.match(ARGUMENT_NAMES);

  if (result === null) {
    return [];
  } else {
    let stripped = [];

    for (let i = 0; i < result.length; i++) {
      stripped.push(result[i].replace(/[\s,]/g, ""));
    }

    return stripped;
  }
};

const handleFactorValueErrorMessage = error => {
  switch (error.type) {
    case "maxNumber":
    case "maxString":
      return "Value must be less than or equal to  ".concat(error.max, " ").concat(error.type === "maxString" ? "character(s)" : "", ".");

    case "minNumber":
    case "minString":
      return "Value must be greater than or equal to  ".concat(error.min, " ").concat(error.type === "minString" ? "character(s)" : "", ".");

    case "scopedUnique":
      return "".concat(error.name, " must be unique.");

    default:
      return "Unknown Error";
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"both":{"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/both/index.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../../api/schema-helpers.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"auth.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/auth.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Accounts.config({
  sendVerificationEmail: false,
  forbidClientAccountCreation: true,
  ambiguousErrorMessages: true
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"avatars.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/avatars.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let crypto;
module.link("crypto", {
  default(v) {
    crypto = v;
  }

}, 0);
let Identicon;
module.link("identicon.js", {
  default(v) {
    Identicon = v;
  }

}, 1);
let jdenticon;
module.link("jdenticon", {
  default(v) {
    jdenticon = v;
  }

}, 2);
WebApp.connectHandlers.use("/avatars", (req, res) => {
  const [type, id] = req.url.slice(1).split("/");
  const hash = crypto.createHash("sha1").update(id).digest("hex");
  let svg;

  switch (type) {
    case "identicon":
      svg = new Identicon(hash, {
        size: 200,
        format: "svg"
      }).toString(true);
      break;

    case "jdenticon":
      svg = jdenticon.toSvg(hash, 200);
      break;

    default:
      res.writeHead(404, {});
      res.end();
      return;
  }

  res.writeHead(200, {
    "Content-Type": "image/svg+xml"
  });
  res.end(svg);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"bootstrap.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/bootstrap.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  bootstrapFunctions: () => bootstrapFunctions,
  bootstrap: () => bootstrap
});
let log;
module.link("../../lib/log.js", {
  default(v) {
    log = v;
  }

}, 0);
const admins = [];
const settingsAdmins = Meteor.settings.admins;

if (settingsAdmins) {
  if (!_.isArray(settingsAdmins)) {
    log.error("settings: `admins` field is not an array");
  } else {
    settingsAdmins.forEach((_ref) => {
      let {
        username,
        password
      } = _ref;

      if (!username || !password) {
        log.error("settings: `admins` require `username` and `password`");
      } else {
        admins.push({
          username,
          password
        });
      }
    });
  }
}

if (admins.length === 0) {
  const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  admins.push({
    username: "admin",
    password: tempPassword
  });
  log.warn("You have not set a custom password for admin login.\nIf you have a settings file (e.g. local.json) with \"admins\" configured, you can\nrestart the app passing in the settings arg: \"meteor --settings local.json\".\nYou can temporarily log in with (reset on each app reload):\n  - username: admin\n  - password: ".concat(tempPassword, "\n"));
}

const bootstrapFunctions = [];

const bootstrap = () => {
  bootstrapFunctions.forEach(f => f());
  log.debug("Bootstrapped!");
};

Meteor.startup(() => {
  bootstrap();
});
bootstrapFunctions.push(() => {
  admins.forEach(admin => {
    const exists = Meteor.users.findOne(_.omit(admin, "password"));

    if (!exists) {
      Accounts.createUser(admin);
    } else {
      Accounts.setPassword(exists._id, admin.password, {
        logout: false
      });
    }
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connections.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/connections.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
module.export({
  connections: () => connections,
  playerIdForConn: () => playerIdForConn,
  savePlayerId: () => savePlayerId,
  forgetPlayerId: () => forgetPlayerId
});
let GameLobbies;
module.link("../../api/game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 0);
let Players;
module.link("../../api/players/players.js", {
  Players(v) {
    Players = v;
  }

}, 1);
const connections = {};

const playerInLobby = function (playerId) {
  let key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "playerIds";
  const query = {
    status: "running",
    gameId: {
      $exists: false
    },
    timedOutAt: {
      $exists: false
    },
    [key]: playerId
  };
  return GameLobbies.findOne(query);
};

const playerIdForConn = conn => {
  return connections[conn.id];
};

const savePlayerId = (conn, playerId) => {
  connections[conn.id] = playerId;
  const pii = Meteor.settings.collectPII ? {
    ip: conn.clientAddress,
    userAgent: conn.httpHeaders["user-agent"]
  } : {};
  Players.update(playerId, {
    $set: {
      online: true,
      lastLogin: _objectSpread({
        at: new Date()
      }, pii)
    }
  });
  const player = Players.findOne(playerId);

  if (!player.readyAt) {
    return;
  }

  const lobby = playerInLobby(playerId, "queuedPlayerIds");

  if (!lobby) {
    return;
  }

  GameLobbies.update(lobby._id, {
    $addToSet: {
      playerIds: playerId
    }
  });
};

const forgetPlayerId = conn => {
  if (!connections[conn.id]) {
    return;
  }

  const playerId = connections[conn.id];
  Players.update(playerId, {
    $set: {
      online: false
    },
    $unset: {
      idle: null
    }
  });
  const lobby = playerInLobby(playerId);

  if (!lobby) {
    return;
  }

  GameLobbies.update(lobby._id, {
    $pull: {
      playerIds: playerId
    }
  });
  delete connections[conn.id];
};

Meteor.onConnection(conn => {
  conn.onClose(() => {
    forgetPlayerId(conn);
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cron.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/cron.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let colors;
module.link("colors/safe", {
  default(v) {
    colors = v;
  }

}, 1);
const tasks = {};
const Cron = {
  add(options) {
    new SimpleSchema({
      name: {
        type: String
      },
      interval: {
        type: SimpleSchema.Integer
      },
      // In ms, shouldn't be less than 1000ms
      task: {
        type: Function
      }
    }).validate(options);

    if (tasks[options.name]) {
      throw "Cron task with name ".concat(options.name, " already exists");
    }

    tasks[options.name] = options;
  }

};
const logCron = Meteor.cron && Meteor.cron.log || false;

const cronLog = msg => logCron && console.info(msg);

const cronLogErr = msg => logCron && console.error(msg);

Meteor.startup(() => {
  for (const name in tasks) {
    if (!tasks.hasOwnProperty(name)) {
      continue;
    }

    const task = tasks[name];
    Meteor.defer(() => {
      const taskName = colors.bold(task.name);
      const startLog = "".concat(colors.green("▶"), " ").concat(taskName);

      const doneLog = (took, wait) => {
        return "".concat(colors.red("◼"), " ").concat(taskName, ": Done in ").concat(took, "ms. ") + "Waiting for ".concat(wait < 0 ? 0 : wait, "ms.");
      };

      const log = {
        info(msg) {
          cronLog("".concat(colors.dim("i"), " ").concat(taskName, ": ").concat(msg, " "));
        },

        error(msg) {
          cronLog("".concat(colors.red("✘"), " ").concat(colors.red(taskName + ":"), " ").concat(msg, " "));
        }

      };

      let run = () => {
        cronLog(startLog);
        const start = new Date();
        task.task(log);
        const took = new Date() - start;
        const wait = task.interval - took;
        cronLog(doneLog(took, wait));

        if (wait <= 0) {
          Meteor.defer(run);
        } else {
          Meteor.setTimeout(run, wait);
        }
      };

      run();
    });
  }
});
module.exportDefault(Cron);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"export.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/export.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  BOM: () => BOM,
  cast: () => cast,
  quoteMark: () => quoteMark,
  doubleQuoteMark: () => doubleQuoteMark,
  quoteRegex: () => quoteRegex,
  encodeCells: () => encodeCells
});
let archiver;
module.link("archiver", {
  default(v) {
    archiver = v;
  }

}, 0);
let contentDisposition;
module.link("content-disposition", {
  default(v) {
    contentDisposition = v;
  }

}, 1);
let moment;
module.link("moment", {
  default(v) {
    moment = v;
  }

}, 2);
let streams;
module.link("stream-buffers", {
  default(v) {
    streams = v;
  }

}, 3);
let Batches;
module.link("../../api/batches/batches.js", {
  Batches(v) {
    Batches = v;
  }

}, 4);
let FactorTypes;
module.link("../../api/factor-types/factor-types.js", {
  FactorTypes(v) {
    FactorTypes = v;
  }

}, 5);
let Factors;
module.link("../../api/factors/factors.js", {
  Factors(v) {
    Factors = v;
  }

}, 6);
let GameLobbies;
module.link("../../api/game-lobbies/game-lobbies.js", {
  GameLobbies(v) {
    GameLobbies = v;
  }

}, 7);
let Games;
module.link("../../api/games/games.js", {
  Games(v) {
    Games = v;
  }

}, 8);
let LobbyConfigs;
module.link("../../api/lobby-configs/lobby-configs.js", {
  LobbyConfigs(v) {
    LobbyConfigs = v;
  }

}, 9);
let PlayerInputs;
module.link("../../api/player-inputs/player-inputs.js", {
  PlayerInputs(v) {
    PlayerInputs = v;
  }

}, 10);
let PlayerLogs;
module.link("../../api/player-logs/player-logs.js", {
  PlayerLogs(v) {
    PlayerLogs = v;
  }

}, 11);
let PlayerRounds;
module.link("../../api/player-rounds/player-rounds.js", {
  PlayerRounds(v) {
    PlayerRounds = v;
  }

}, 12);
let PlayerStages;
module.link("../../api/player-stages/player-stages.js", {
  PlayerStages(v) {
    PlayerStages = v;
  }

}, 13);
let Players;
module.link("../../api/players/players.js", {
  Players(v) {
    Players = v;
  }

}, 14);
let Rounds;
module.link("../../api/rounds/rounds.js", {
  Rounds(v) {
    Rounds = v;
  }

}, 15);
let Stages;
module.link("../../api/stages/stages.js", {
  Stages(v) {
    Stages = v;
  }

}, 16);
let Treatments;
module.link("../../api/treatments/treatments.js", {
  Treatments(v) {
    Treatments = v;
  }

}, 17);
let log;
module.link("../../lib/log.js", {
  default(v) {
    log = v;
  }

}, 18);
const BOM = "\uFEFF";

// Get all possible keys in the data field of collections that have a data field
// such as Players, PlayerStages and PlayerRounds.
const getDataKeys = coll => {
  const map = {};
  coll.find({}, {
    fields: {
      data: 1
    }
  }).forEach(record => {
    _.keys(record.data).forEach(key => map[key] = true);
  });
  return _.keys(map);
};

const cast = out => {
  if (_.isArray(out)) {
    // The cast here will flatten arrays but will still catch dates correctly
    return out.map(a => cast(a)).join(",");
  }

  if (_.isDate(out)) {
    return moment(out).utc().format();
  }

  if (_.isObject(out)) {
    return JSON.stringify(out);
  }

  if (_.isString(out)) {
    return out.replace(/\n/g, "\\n");
  }

  if (out === false || out === 0) {
    return out.toString();
  }

  return (out || "").toString();
};

const quoteMark = '"';
const doubleQuoteMark = '""';
const quoteRegex = /"/g;

const encodeCells = line => {
  const row = line.slice(0);

  for (var i = 0, len = row.length; i < len; i++) {
    row[i] = cast(row[i]);

    if (row[i].indexOf(quoteMark) !== -1) {
      row[i] = quoteMark + row[i].replace(quoteRegex, doubleQuoteMark) + quoteMark;
    } else if (row[i].indexOf(",") !== -1 || row[i].indexOf("\\n") !== -1) {
      row[i] = quoteMark + row[i] + quoteMark;
    }
  }

  return row.join(",") + "\n";
};

const batch = function (coll) {
  let query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let sort = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1000;
  return iterator => {
    let skip = 0,
        records;

    while (!records || records.length > 0) {
      records = coll.find(query, {
        sort,
        limit,
        skip
      }).fetch();
      records.forEach(iterator);
      skip += limit;
    }
  };
};

WebApp.connectHandlers.use("/admin/export", (req, res, next) => {
  //
  // Authentication
  //
  const loginToken = req.cookies && req.cookies.meteor_login_token;
  let user;

  if (loginToken) {
    const hashedToken = Accounts._hashLoginToken(loginToken);

    const query = {
      "services.resume.loginTokens.hashedToken": hashedToken
    };
    const options = {
      fields: {
        _id: 1
      }
    };
    user = Meteor.users.findOne(query, options);
  }

  if (!user) {
    res.writeHead(403);
    res.end();
    return;
  } //
  // Format
  //


  let format;

  switch (true) {
    case req.url === "/":
      next();
      return;

    case req.url.includes("/.json"):
      format = "json";
      break;

    case req.url.includes("/.jsonl"):
      format = "jsonl";
      break;

    case req.url.includes("/.csv"):
      format = "csv";
      break;

    default:
      res.writeHead(404);
      res.end();
      return;
  } //
  // Connection bookkeeping
  //


  let cancelRequest = false,
      requestFinished = false;
  req.on("close", function (err) {
    if (!requestFinished) {
      log.info("Export request was cancelled");
      cancelRequest = true;
    }
  }); //
  // Headers
  //

  const ts = moment().format("YYYY-MM-DD HH-mm-ss");
  const filename = "Empirica Data - ".concat(ts);
  res.setHeader("Content-Disposition", contentDisposition(filename + ".zip"));
  res.setHeader("Content-Type", "application/zip");
  res.writeHead(200); //
  // Create archive
  //

  var archive = archiver("zip"); // good practice to catch warnings (ie stat failures and other non-blocking errors)

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      log.warn("archive warning", err);
    } else {
      log.err("archive error"); // throw error

      throw err;
    }
  }); // good practice to catch this error explicitly

  archive.on("error", function (err) {
    log.err("archive error");
    throw err;
  }); // pipe archive data to the file

  archive.pipe(res); //
  // File creation helper
  //

  const existingFile = {};

  const saveFile = function (name, keys, func) {
    let dataKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (existingFile[name]) {
      throw "export filename already exists: ".concat(name);
    }

    existingFile[name] = true;
    const file = new streams.ReadableStreamBuffer();
    archive.append(file, {
      name: "".concat(filename, "/").concat(name, ".").concat(format)
    });

    if (format === "csv") {
      file.put(BOM);
      file.put(encodeCells(keys.concat(dataKeys.map(k => "data.".concat(k)))));
    }

    format === "json" && file.put("[");
    let isFirstLine = true;
    func(function (data) {
      let userData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      switch (format) {
        case "csv":
          const out = [];
          keys.forEach(k => {
            out.push(data[k]);
          });
          dataKeys.forEach(k => {
            out.push(userData[k]);
          });
          file.put(encodeCells(out));
          break;

        case "jsonl":
          _.each(userData, (v, k) => data["data.".concat(k)] = v);

          file.put(JSON.stringify(data) + "\n");
          break;

        case "json":
          _.each(userData, (v, k) => data["data.".concat(k)] = v);

          if (isFirstLine) {
            isFirstLine = false;
            file.put("\t" + JSON.stringify(data));
          } else {
            file.put(",\t" + JSON.stringify(data));
          }

          break;

        default:
          throw "unknown format: ".concat(format);
      }
    });
    format === "json" && file.put("\n]");
    file.stop();
  }; //
  // Exports
  //


  const factorTypeFields = ["_id", "name", "required", "description", "type", "min", "max", "createdAt", "archivedAt"];
  saveFile("factor-types", factorTypeFields, puts => {
    FactorTypes.find().forEach(ft => puts(_.pick(ft, factorTypeFields)));
  });
  const factorFields = ["_id", "name", "value", "factorTypeId", "createdAt"];
  saveFile("factors", factorFields, puts => {
    batch(Factors)(f => puts(_.pick(f, factorFields)));
  });
  const treatmentFields = ["_id", "name", "factorIds", "createdAt", "archivedAt"];
  saveFile("treatments", treatmentFields, puts => {
    batch(Treatments)(f => puts(_.pick(f, treatmentFields)));
  });
  const lobbyConfigFields = ["_id", "name", "timeoutType", "timeoutInSeconds", "timeoutStrategy", "timeoutBots", "extendCount", "createdAt", "archivedAt"];
  saveFile("lobby-configs", lobbyConfigFields, puts => {
    batch(LobbyConfigs)(f => puts(_.pick(f, lobbyConfigFields)));
  });
  const batchFields = ["_id", "index", "assignment", "full", "runningAt", "finishedAt", "status", "gameIds", "gameLobbyIds", "createdAt", "archivedAt"];
  saveFile("batches", batchFields, puts => {
    batch(Batches)(f => puts(_.pick(f, batchFields)));
  });
  const gameLobbyFields = ["_id", "index", "availableCount", "timeoutStartedAt", "timedOutAt", "queuedPlayerIds", "playerIds", "gameId", "treatmentId", "batchId", "lobbyConfigId", "createdAt"];
  saveFile("game-lobbies", gameLobbyFields, puts => {
    batch(GameLobbies)(f => puts(_.pick(f, gameLobbyFields)));
  });
  const gameFields = ["_id", "finishedAt", "gameLobbyId", "treatmentId", "roundIds", "playerIds", "batchId", "createdAt"];
  const gameDataFields = getDataKeys(Games);
  saveFile("games", gameFields, puts => {
    batch(Games)(f => puts(_.pick(f, gameFields), _.pick(f.data, gameDataFields)));
  }, gameDataFields);
  const playerFields = ["_id", "bot", "readyAt", "timeoutStartedAt", "timeoutWaitCount", "exitStepsDone", "exitAt", "exitStatus", "exitReason", "retiredAt", "retiredReason", "createdAt"];

  if (req.query.include_pii === "true") {
    playerFields.splice(1, 0, "id", "urlParams");
    playerFields.splice(playerFields.length, 0, "lastLogin");
  }

  const playerDataFields = getDataKeys(Players);
  saveFile("players", playerFields, puts => {
    batch(Players)(p => puts(_.pick(p, playerFields), _.pick(p.data, playerDataFields)));
  }, playerDataFields);
  const roundFields = ["_id", "index", "stageIds", "gameId", "createdAt"];
  const roundDataFields = getDataKeys(Rounds);
  saveFile("rounds", roundFields, puts => {
    batch(Rounds)(p => puts(_.pick(p, roundFields), _.pick(p.data, roundDataFields)));
  }, roundDataFields);
  const stageFields = ["_id", "index", "name", "displayName", "startTimeAt", "durationInSeconds", "roundId", "gameId", "createdAt"];
  const stageDataFields = getDataKeys(Stages);
  saveFile("stages", stageFields, puts => {
    batch(Stages)(p => puts(_.pick(p, stageFields), _.pick(p.data, stageDataFields)));
  }, stageDataFields);
  const playerRoundFields = ["_id", "batchId", "playerId", "roundId", "gameId", "createdAt"];
  const playerRoundDataFields = getDataKeys(PlayerRounds);
  saveFile("player-rounds", playerRoundFields, puts => {
    batch(PlayerRounds)(p => puts(_.pick(p, playerRoundFields), _.pick(p.data, playerRoundDataFields)));
  }, playerRoundDataFields);
  const playerStageFields = ["_id", "batchId", "playerId", "stageId", "roundId", "gameId", "createdAt", "submittedAt"];
  const playerStageDataFields = getDataKeys(PlayerStages);
  saveFile("player-stages", playerStageFields, puts => {
    batch(PlayerStages)(p => puts(_.pick(p, playerStageFields), _.pick(p.data, playerStageDataFields)));
  }, playerStageDataFields);
  const playerInputFields = ["_id", "playerId", "gameId", "createdAt"];
  const playerInputDataFields = getDataKeys(PlayerInputs);
  saveFile("player-inputs", playerInputFields, puts => {
    batch(PlayerInputs)(p => puts(_.pick(p, playerInputFields), _.pick(p.data, playerInputDataFields)));
  }, playerInputDataFields);
  const playerLogFields = ["_id", "playerId", "gameId", "roundId", "stageId", "name", "jsonData", "createdAt"];
  saveFile("player-logs", playerLogFields, puts => {
    batch(PlayerLogs)(p => puts(_.pick(p, playerLogFields)));
  });
  archive.finalize();
  requestFinished = true;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/index.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../both/index.js");
module.link("./auth.js");
module.link("./bootstrap.js");
module.link("./cron.js");
module.link("./register-api.js");
module.link("./avatars.js");
module.link("./export.js");
module.link("./connections.js");
module.link("../../lib/utils.js");
module.link("../../api/indexes.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/empirica_core/startup/server/register-api.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../../api/admin/methods.js");
module.link("../../api/batches/methods.js");
module.link("../../api/batches/hooks.js");
module.link("../../api/batches/server/publications.js");
module.link("../../api/factors/methods.js");
module.link("../../api/factors/server/publications.js");
module.link("../../api/factor-types/methods.js");
module.link("../../api/factor-types/hooks.js");
module.link("../../api/factor-types/server/publications.js");
module.link("../../api/factor-types/server/bootstrap.js");
module.link("../../api/game-lobbies/hooks.js");
module.link("../../api/game-lobbies/server/cron.js");
module.link("../../api/game-lobbies/server/publications.js");
module.link("../../api/games/hooks.js");
module.link("../../api/games/methods.js");
module.link("../../api/games/server/publications.js");
module.link("../../api/games/server/cron.js");
module.link("../../api/lobby-configs/methods.js");
module.link("../../api/lobby-configs/server/publications.js");
module.link("../../api/players/methods.js");
module.link("../../api/players/server/publications");
module.link("../../api/player-inputs/methods.js");
module.link("../../api/player-rounds/methods.js");
module.link("../../api/player-stages/methods.js");
module.link("../../api/player-stages/hooks.js");
module.link("../../api/rounds/methods.js");
module.link("../../api/stages/methods.js");
module.link("../../api/treatments/methods.js");
module.link("../../api/treatments/server/publications.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"simpl-schema":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/simpl-schema/package.json                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "simpl-schema",
  "version": "1.5.5",
  "main": "./dist/main.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/simpl-schema/dist/main.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"loglevel":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/loglevel/package.json                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "loglevel",
  "version": "1.6.1",
  "main": "lib/loglevel"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"loglevel.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/loglevel/lib/loglevel.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"colors":{"safe.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/colors/safe.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"@babel":{"runtime":{"helpers":{"objectSpread2.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/@babel/runtime/helpers/objectSpread2.js                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"js-yaml":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/js-yaml/package.json                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "js-yaml",
  "version": "3.12.0"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/js-yaml/index.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"inflection":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/inflection/package.json                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "inflection",
  "version": "1.12.0",
  "main": "./lib/inflection.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"inflection.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/inflection/lib/inflection.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"moment":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/moment/package.json                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "moment",
  "version": "2.22.2",
  "main": "./moment.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"moment.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/moment/moment.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"react":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/react/package.json                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "react",
  "version": "16.5.2",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/react/index.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"identicon.js":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/identicon.js/package.json                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "identicon.js",
  "version": "2.3.2",
  "main": "identicon.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"identicon.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/identicon.js/identicon.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"jdenticon":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/jdenticon/package.json                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "jdenticon",
  "version": "2.1.0",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/jdenticon/index.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"archiver":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/archiver/package.json                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "archiver",
  "version": "3.0.0",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/archiver/index.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"content-disposition":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/content-disposition/package.json                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "content-disposition",
  "version": "0.5.2"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/content-disposition/index.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"stream-buffers":{"package.json":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/stream-buffers/package.json                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "stream-buffers",
  "version": "3.0.2",
  "main": "./lib/streambuffer.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"streambuffer.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/empirica_core/node_modules/stream-buffers/lib/streambuffer.js                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx",
    ".mjs"
  ]
});

var exports = require("/node_modules/meteor/empirica:core/server.js");

/* Exports */
Package._define("empirica:core", exports);

})();

//# sourceURL=meteor://💻app/packages/empirica_core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvZ2FtZUxvYmJ5LWxvY2suanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc2hhcmVkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9jb2xsZWN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZGVmYXVsdC1zY2hlbWFzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9pbmRleGVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9zY2hlbWEtaGVscGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvYWRtaW4vbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvYmF0Y2hlcy9iYXRjaGVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9iYXRjaGVzL2hvb2tzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9iYXRjaGVzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2JhdGNoZXMvc3RhdHVzLXNjaGVtYS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvYmF0Y2hlcy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9mYWN0b3ItdHlwZXMvZmFjdG9yLXR5cGVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9mYWN0b3ItdHlwZXMvaG9va3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2ZhY3Rvci10eXBlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9mYWN0b3ItdHlwZXMvc2VydmVyL2Jvb3RzdHJhcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZmFjdG9yLXR5cGVzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2ZhY3RvcnMvZmFjdG9ycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZmFjdG9ycy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9mYWN0b3JzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWUtbG9iYmllcy9nYW1lLWxvYmJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWUtbG9iYmllcy9ob29rcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZ2FtZS1sb2JiaWVzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWUtbG9iYmllcy9zZXJ2ZXIvY3Jvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZ2FtZS1sb2JiaWVzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWVzL2F1Z21lbnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWVzL2NyZWF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZ2FtZXMvZ2FtZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2dhbWVzL2hvb2tzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9nYW1lcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9nYW1lcy9zZXJ2ZXIvY3Jvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvZ2FtZXMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9sb2JieS1jb25maWdzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL2xvYmJ5LWNvbmZpZ3Mvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvcGxheWVyLWlucHV0cy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9wbGF5ZXItaW5wdXRzL3BsYXllci1pbnB1dHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3BsYXllci1sb2dzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3BsYXllci1sb2dzL3BsYXllci1sb2dzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9wbGF5ZXItcm91bmRzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3BsYXllci1yb3VuZHMvcGxheWVyLXJvdW5kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvcGxheWVyLXN0YWdlcy9hdWdtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9wbGF5ZXItc3RhZ2VzL2hvb2tzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9wbGF5ZXItc3RhZ2VzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3BsYXllci1zdGFnZXMvcGxheWVyLXN0YWdlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvcGxheWVycy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9wbGF5ZXJzL3BsYXllcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3BsYXllcnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvcm91bmRzL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3JvdW5kcy9yb3VuZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3NlcnZlci9vbmNoYW5nZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvc2VydmVyL29uc3VibWl0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9zdGFnZXMvZmluaXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS9zdGFnZXMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvc3RhZ2VzL3N0YWdlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9hcGkvdHJlYXRtZW50cy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL2FwaS90cmVhdG1lbnRzL3RyZWF0bWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvYXBpL3RyZWF0bWVudHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9saWIvY29tcG9uZW50Q2hlY2tlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9saWIvY291bnRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvbGliL2xvZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9saWIvdXRpbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9ib3RoL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lbXBpcmljYTpjb3JlL3N0YXJ0dXAvc2VydmVyL2F1dGguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9zZXJ2ZXIvYXZhdGFycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9zdGFydHVwL3NlcnZlci9ib290c3RyYXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9zZXJ2ZXIvY29ubmVjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9zZXJ2ZXIvY3Jvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZW1waXJpY2E6Y29yZS9zdGFydHVwL3NlcnZlci9leHBvcnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2VtcGlyaWNhOmNvcmUvc3RhcnR1cC9zZXJ2ZXIvcmVnaXN0ZXItYXBpLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImNvbmZpZyIsImxpbmsiLCJTaW1wbGVTY2hlbWEiLCJkZWZhdWx0IiwidiIsInBsYXllcklkRm9yQ29ubiIsImNhbGxPbkNoYW5nZSIsImNhbGxPblN1Ym1pdCIsImVhcmx5RXhpdEdhbWUiLCJzaGFyZWQiLCJnZXRGdW5jdGlvblBhcmFtZXRlcnMiLCJHYW1lcyIsImRlYnVnIiwic2FmZUNhbGxiYWNrIiwibmFtZSIsImZ1bmMiLCJhcmd1bWVudHMiLCJoYW5kbGVDYWxsYmFja0Z1bmNQYXJhbWV0ZXJzIiwiZ2FtZSIsImZpbmRPbmUiLCJfaWQiLCJmaW5pc2hlZEF0IiwiY29uc29sZSIsImxvZyIsImFwcGx5IiwiZXJyIiwiZXJyb3IiLCJjYWxsIiwiZ2FtZUlkIiwiZW5kUmVhc29uIiwic3RhdHVzIiwicGFyYW1ldGVycyIsImhhbmRsZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ0YXJnZXQiLCJrZXlJbmRleCIsImtleSIsInNwbGl0IiwiaW5kZXgiLCJwYXJzZUludCIsIkVycm9yIiwicHJveHkiLCJQcm94eSIsImZvckVhY2giLCJPYmplY3QiLCJib3RzIiwiRW1waXJpY2EiLCJnYW1lSW5pdCIsImJvdCIsIm9iaiIsIm9uR2FtZVN0YXJ0Iiwib25Sb3VuZFN0YXJ0Iiwib25TdGFnZVN0YXJ0Iiwib25TdGFnZUVuZCIsIm9uUm91bmRFbmQiLCJvbkdhbWVFbmQiLCJvblNldCIsIm9uQXBwZW5kIiwib25DaGFuZ2UiLCJvblN1Ym1pdCIsImV4cG9ydERlZmF1bHQiLCJnYW1lTG9iYnlMb2NrIiwic2hhcmVkTmFtZXNwYWNlIiwiY29sbGVjdGlvbnMiLCJCYXRjaGVzIiwiRmFjdG9ycyIsIkdhbWVMb2JiaWVzIiwiTG9iYnlDb25maWdzIiwiUGxheWVySW5wdXRzIiwiUGxheWVyUm91bmRzIiwiUGxheWVyU3RhZ2VzIiwiUGxheWVycyIsIlJvdW5kcyIsIlN0YWdlcyIsIlRyZWF0bWVudHMiLCJJZFNjaGVtYSIsIkFyY2hpdmVkU2NoZW1hIiwiRGVidWdNb2RlU2NoZW1hIiwiVGltZXN0YW1wU2NoZW1hIiwiQ3JlYXRvclNjaGVtYSIsIlVzZXJEYXRhU2NoZW1hIiwiUG9seW1vcnBoaWNTY2hlbWEiLCJIYXNNYW55QnlSZWYiLCJCZWxvbmdzVG8iLCJpbmZsZWN0aW9uIiwidHlwZSIsIlN0cmluZyIsIm9wdGlvbmFsIiwicmVnRXgiLCJSZWdFeCIsIklkIiwiYXJjaGl2ZWRCeUlkIiwiYXV0b1ZhbHVlIiwiZmllbGQiLCJpc1NldCIsInVzZXJJZCIsInVuZGVmaW5lZCIsImFyY2hpdmVkQXQiLCJEYXRlIiwibGFiZWwiLCJkZWJ1Z01vZGUiLCJCb29sZWFuIiwiZGVmYXVsdFZhbHVlIiwiY3JlYXRlZEF0IiwiaXNJbnNlcnQiLCJpc1Vwc2VydCIsIiRzZXRPbkluc2VydCIsInVuc2V0IiwidXBkYXRlZEF0IiwiaXNVcGRhdGUiLCJjcmVhdGVkQnlJZCIsImlzRnJvbVRydXN0ZWRDb2RlIiwidXBkYXRlZEJ5SWQiLCJkYXRhIiwiYmxhY2tib3giLCJjb2xsVHlwZXMiLCJvYmplY3RUeXBlIiwiYWxsb3dlZFZhbHVlcyIsIm9iamVjdElkIiwiY29sbCIsImNhbWVsIiwiY2FtZWxpemUiLCJzaW5ndWxhcml6ZSIsInRpdGxlaXplIiwiZmllbGROYW1lIiwiQXJyYXkiLCJyZXF1aXJlZCIsInNpbmd1bGFyIiwiTWV0ZW9yIiwic3RhcnR1cCIsInNldFRpbWVvdXQiLCJzY2hlbWEiLCJfbmFtZSIsIl9zY2hlbWEiLCJoYXNPd25Qcm9wZXJ0eSIsImRlZiIsImRlc2MiLCJ3YXJuIiwib3B0cyIsInNwYXJzZSIsIm9wdGlvbnMiLCJ1bmlxdWUiLCJKU09OIiwic3RyaW5naWZ5IiwicmF3Q29sbGVjdGlvbiIsImNyZWF0ZUluZGV4IiwicmVzIiwiY29kZU5hbWUiLCJDb2xsZWN0aW9uMiIsImV4dGVuZE9wdGlvbnMiLCJvbiIsImNvbGxlY3Rpb24iLCJzcyIsInZlcnNpb24iLCJtZXNzYWdlQm94IiwibWVzc2FnZXMiLCJzY29wZWRVbmlxdWUiLCJhZGRWYWxpZGF0b3IiLCJkZWZpbml0aW9uIiwidW5pcXVlRmllbGRTY29wZSIsInZhbCIsInZhbHVlIiwiZmluZCIsImNvdW50IiwiZW4iLCJpbnNlcnROb3RBbGxvd2VkIiwidXBkYXRlTm90QWxsb3dlZCIsInNjaGVtYURlbnlWYWxpZGF0b3IiLCJkZW55SW5zZXJ0IiwiZGVueVVwZGF0ZSIsIl9vYmplY3RTcHJlYWQiLCJ5YW1sIiwiRmFjdG9yVHlwZXMiLCJib290c3RyYXAiLCJ1c2VyQ29sbHMiLCJrZWVwUGFydGlhbCIsImRlbGV0ZUNvbGxzIiwiY29uY2F0IiwibG9jYWxUeXBlRm9ySW1wb3J0ZWQiLCJmYWN0b3JUeXBlSWQiLCJpbXBvcnRlZFR5cGUiLCJmYWN0b3JUeXBlcyIsInQiLCJsb2NhbEZhY3RvckZvckltcG9ydGVkIiwiZmFjdG9ySWQiLCJpbXBvcnRlZEZhY3RvciIsImZhY3RvcnMiLCJpbXBvcnRlZEZhY3RvclR5cGVJZCIsImZhY3RvciIsImFyY2hpdmVkVXBkYXRlIiwiZXhpc3RpbmdBcmNoaXZlZEF0IiwiJHNldCIsIiR1bnNldCIsIm1ldGhvZHMiLCJhZG1pbkltcG9ydENvbmZpZ3VyYXRpb24iLCJ0ZXh0Iiwic2FmZUxvYWQiLCJjb252ZXJ0RmFjdG9yVHlwZUlkIiwiY29udmVydEZhY3RvcklkIiwiZiIsImV4aXN0cyIsInF1ZXJ5IiwidXBkYXRlIiwiaW5zZXJ0IiwicGFyYW1zIiwidHJlYXRtZW50cyIsImZhY3RvcklkcyIsImltcG9ydGVkRmFjdG9ySWRzIiwibWFwIiwiXyIsImNvbXBhY3QiLCJsZW5ndGgiLCJsb2JieUNvbmZpZ3MiLCJsIiwicGljayIsImFkbWluRXhwb3J0Q29uZmlndXJhdGlvbiIsIm91dCIsImZldGNoIiwicHVzaCIsInNhZmVEdW1wIiwiaXNEZXZlbG9wbWVudCIsInNldHRpbmdzIiwicHVibGljIiwiZGVidWdfcmVzZXREYXRhYmFzZSIsImFkbWluUmVzZXREQiIsInBhcnRpYWwiLCJpc0NsaWVudCIsImRyaXZlciIsIk1vbmdvSW50ZXJuYWxzIiwiZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIiLCJkYiIsIm1vbmdvIiwibGlzdENvbGxlY3Rpb25zIiwidG9BcnJheSIsImJpbmRFbnZpcm9ubWVudCIsImNvbGxzIiwic29ydEJ5IiwiYyIsImluY2x1ZGVzIiwib3BlbiIsImRyb3AiLCJleHRyYSIsIm1heEdhbWVzQ291bnQiLCJhc3NpZ25tZW50VHlwZXMiLCJzdGF0dXNTY2hlbWEiLCJDb3VudGVyIiwiQmF0Y2hlc0NvbGxlY3Rpb24iLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJkb2MiLCJjYWxsYmFjayIsImluYyIsImhlbHBlcnMiLCJnYW1lQ291bnQiLCJhc3NpZ25tZW50Iiwic2ltcGxlQ29uZmlnIiwiY29tcGxldGVHYW1lQ291bnQiLCJyZWR1Y2UiLCJjb21wbGV0ZUNvbmZpZyIsInN1bSIsImR1cGxpY2F0ZSIsInNpbXBsZSIsImNvbXBsZXRlIiwiSW50ZWdlciIsImZ1bGwiLCJydW5uaW5nQXQiLCJjdXN0b20iLCJtaW4iLCJtYXgiLCJtaW5Db3VudCIsIm1heENvdW50IiwiZGVidWdfZ2FtZURlYnVnTW9kZSIsImV4dGVuZCIsImF0dGFjaFNjaGVtYSIsInNlbmRQbGF5ZXJzVG9OZXh0QmF0Y2hlcyIsImFmdGVyIiwiYmF0Y2giLCJnYW1lTG9iYmllcyIsInRpbWVzIiwidHJlYXRtZW50IiwiUmFuZG9tIiwiY2hvaWNlIiwidHJlYXRtZW50SWQiLCJsb2JieUNvbmZpZ0lkIiwic2h1ZmZsZSIsImdhbWVMb2JieUlkcyIsImlkIiwiYmF0Y2hJZCIsImJhdGNoVXBkYXRlZCIsImF2YWlsYWJsZUNvdW50IiwiYm90c0NvdW50Q29uZCIsImJvdHNDb3VudCIsImJvdE5hbWVzIiwia2V5cyIsInBsYXllcklkcyIsImdhbWVMb2JieUlkIiwicmVhZHlBdCIsImluZm8iLCJwbGF5ZXJJZCIsInF1ZXVlZFBsYXllcklkcyIsImZpZWxkTmFtZXMiLCJtb2RpZmllciIsIiRuaW4iLCJtdWx0aSIsImdhbWVzIiwiZ3BsYXllcklkcyIsImZsYXR0ZW4iLCJwbHVjayIsIiRpbiIsImV4aXRBdCIsIiRleGlzdHMiLCJleGl0U3RhdHVzIiwiZ2xwbGF5ZXJJZHMiLCJwbGF5ZXJzIiwiZmV0Y2hQcmV2aW91cyIsImNyZWF0ZUJhdGNoIiwiZHVwbGljYXRlQmF0Y2giLCJ1cGRhdGVCYXRjaCIsInVwZGF0ZUJhdGNoU3RhdHVzIiwiVmFsaWRhdGVkTWV0aG9kIiwidmFsaWRhdGUiLCJvbWl0IiwidmFsaWRhdG9yIiwicnVuIiwiYXV0b0NvbnZlcnQiLCJmaWx0ZXIiLCJhcmNoaXZlZCIsInNldEJhdGNoSW5EZWJ1Z01vZGUiLCJwdWJsaXNoIiwicHJvcHMiLCJmaWVsZHMiLCJyZXF1aXJlZFR5cGVzIiwidHlwZXMiLCJkZXNjcmlwdGlvbiIsIk51bWJlciIsIm5vdFVuaXF1ZSIsImZhY3RvclR5cGUiLCJjcmVhdGVGYWN0b3JUeXBlIiwidXBkYXRlRmFjdG9yVHlwZSIsImluaXRpYWxWYWx1ZXMiLCJvbmVPZiIsImJvb3RzdHJhcEZ1bmN0aW9ucyIsImRlZmF1bHRUeXBlcyIsInR5cGVDb252ZXJzaW9uIiwiZmFjdG9yVHlwZU5hbWUiLCJmdWxsTGFiZWwiLCJ2YWx1ZVZhbGlkYXRpb24iLCJzaW1wbGVTY2htZW1hVHlwZSIsImZpZWxkU2NoZW1hIiwibmV3Q29udGV4dCIsImlzVmFsaWQiLCJ2YWxpZGF0aW9uRXJyb3JzIiwiZXJyb3JzIiwiYWRkVmFsaWRhdGlvbkVycm9ycyIsInNsaWNlIiwiY3JlYXRlRmFjdG9yIiwidXBkYXRlRmFjdG9yIiwiaGFuZGxlRmFjdG9yVmFsdWVFcnJvck1lc3NhZ2UiLCJlIiwiam9pbiIsInRpbWVvdXRTdGFydGVkQXQiLCJ0aW1lZE91dEF0IiwiY3JlYXRlR2FtZUZyb21Mb2JieSIsImNoZWNrQmF0Y2hGdWxsIiwiY2hlY2tGb3JCYXRjaEZpbmlzaGVkIiwiZ2FtZUxvYmJ5IiwidHJhbnNmb3JtIiwiaHVtYW5QbGF5ZXJzIiwicCIsInJlYWR5UGxheWVyc0NvdW50IiwibG9iYnlDb25maWciLCJ0aW1lb3V0VHlwZSIsInVwZGF0ZUdhbWVMb2JieURhdGEiLCJlYXJseUV4aXRHYW1lTG9iYnkiLCJhcHBlbmQiLCJub0NhbGxiYWNrIiwicGFyc2UiLCIkcHVzaCIsInRyaW1TdHJpbmdzIiwicmVtb3ZlRW1wdHlTdHJpbmdzIiwiaXNTZXJ2ZXIiLCJjb25uIiwiY29ubmVjdGlvbiIsInByZXZWYWx1ZSIsImV4aXRSZWFzb24iLCJhdmFpbGFibGVMb2JieSIsIiRhbmQiLCJtb21lbnQiLCJDcm9uIiwiY2hlY2tMb2JieVRpbWVvdXQiLCJsb2JieSIsIm5vdyIsInN0YXJ0VGltZUF0IiwiZW5kVGltZUF0IiwiYWRkIiwidGltZW91dEluU2Vjb25kcyIsImVuZGVkIiwiaXNTYW1lT3JBZnRlciIsInRpbWVvdXRTdHJhdGVneSIsImNoZWNrSW5kaXZpZHVhbFRpbWVvdXQiLCJwbGF5ZXIiLCJ0aW1lb3V0V2FpdENvdW50IiwiZXh0ZW5kQ291bnQiLCIkcHVsbCIsImludGVydmFsIiwidGFzayIsInB1Ymxpc2hDb21wb3NpdGUiLCJjaGlsZHJlbiIsImF1Z21lbnRHYW1lT2JqZWN0IiwiYXVnbWVudFBsYXllclN0YWdlUm91bmQiLCJyb3VuZCIsInN0YWdlIiwiZmlyc3RSb3VuZElkIiwiY3VycmVudFN0YWdlSWQiLCJnYW1lVHJlYXRtZW50IiwiZ2FtZVBsYXllcnMiLCJnYW1lUm91bmRzIiwiZ2FtZVN0YWdlcyIsImRlZmluZVByb3BlcnRpZXMiLCJnZXQiLCJmYWN0b3JzT2JqZWN0Iiwic3RhZ2VzIiwicyIsInJvdW5kcyIsImRlZmluZVByb3BlcnR5Iiwicm91bmRJZCIsImF1Z21lbnRHYW1lU3RhZ2VSb3VuZCIsIndlaWdodGVkUmFuZG9tIiwiYWRkU3RhZ2VFcnJNc2ciLCJzZXQiLCJnYW1lQ29sbGVjdG9yIiwiayIsImFkZFJvdW5kIiwiYWRkU3RhZ2UiLCJkaXNwbGF5TmFtZSIsImR1cmF0aW9uSW5TZWNvbmRzIiwiZHVyYXRpb25JblNlY29uZHNBc0ludCIsImlzTmFOIiwibGVuIiwidW5pcSIsInN0YWdlSW5kZXgiLCJ0b3RhbER1cmF0aW9uIiwiaW5zZXJ0T3B0aW9uIiwiU3RhZ2VzVXBkYXRlT3AiLCJpbml0aWFsaXplVW5vcmRlcmVkQnVsa09wIiwiUm91bmRzT3AiLCJTdGFnZXNPcCIsInJvdW5kc09wUmVzdWx0Iiwic3RhZ2VzT3BSZXN1bHQiLCJ3cmFwQXN5bmMiLCJleGVjdXRlIiwicm91bmRJZHMiLCJnZXRJbnNlcnRlZElkcyIsImlkcyIsIlBsYXllclN0YWdlc09wIiwiUGxheWVyUm91bmRzT3AiLCJzUGFyYW1zIiwic3RhZ2VJZHMiLCJzdGFnZUlkIiwicGxheWVyU3RhZ2VzUmVzdWx0IiwicGxheWVyU3RhZ2VJZHMiLCJ1cHNlcnQiLCJ1cGRhdGVPbmUiLCJwbGF5ZXJSb3VuZElkc1Jlc3VsdCIsInBsYXllclJvdW5kSWRzIiwiZXN0RmluaXNoZWRUaW1lIiwidG9EYXRlIiwiZmFpbGVkUGxheWVySWRzIiwiZGlmZmVyZW5jZSIsIm5leHRSb3VuZCIsInIiLCJuZXh0U3RhZ2UiLCJzdGFnZVBhZGRpbmdEdXJhdGlvbiIsInJ1bm5pbmdCYXRjaGVzIiwiJG5lIiwic29ydCIsImxvYmJpZXNHcm91cHMiLCJydW5uaW5nQmF0Y2hlSWRzIiwiYiIsInBvc3NpYmxlTG9iYmllcyIsImluZGV4T2YiLCJpIiwibG9iYmllcyIsIndlaWd0aGVkTG9iYnlQb29sIiwid2VpZ2h0IiwiJGFkZFRvU2V0IiwiR2FtZXNDb2xsZWN0aW9uIiwiZXhwZWN0ZWRHYW1lc0NvdW50IiwiZ2FtZXNDb3VudCIsInRpbWVPdXRHYW1lTG9iYmllc0NvdW50IiwiZ2FtZVF1ZXJ5Iiwibm9HYW1lc0xlZnQiLCJnYW1lTG9iYmllc1F1ZXJ5IiwibG9iYmllc0NvdW50Iiwibm9HYW1lTG9iYmllc0xlZnQiLCJ1cGRhdGVHYW1lRGF0YSIsImVuZE9mU3RhZ2UiLCIkZ3RlIiwiYm90UGxheWVycyIsImJvdFBsYXllciIsIm9uU3RhZ2VUaWNrIiwidGljayIsImRpZmYiLCJiYXNlIiwiZGV0YWlscyIsInRpbWVvdXRCb3RzIiwidGltZW91dFR5cGVzIiwidGltZW91dFN0cmF0ZWdpZXMiLCJtYXhUaW1lb3V0SW5TZWNvbmRzIiwiZGVmYXVsdFRpbWVvdXRJblNlY29uZHMiLCJjcmVhdGVMb2JieUNvbmZpZyIsInVwZGF0ZUxvYmJ5Q29uZmlnIiwiYWRkUGxheWVySW5wdXQiLCJyYXdEYXRhIiwicGxheWVyTG9nIiwiUGxheWVyTG9ncyIsImpzb25EYXRhIiwidXBkYXRlUGxheWVyUm91bmREYXRhIiwicGxheWVyUm91bmRJZCIsInBsYXllclJvdW5kIiwiYXVnbWVudEdhbWVMb2JieSIsImF1Z21lbnRQbGF5ZXJMb2JieSIsImF1Z21lbnRQbGF5ZXIiLCJzdHViUGxheWVyU3RhZ2VSb3VuZCIsInN0dWJTdGFnZVJvdW5kIiwidXBkYXRlUGxheWVyRGF0YSIsImVhcmx5RXhpdFBsYXllciIsImVhcmx5RXhpdFBsYXllckxvYmJ5IiwidXBkYXRlUm91bmREYXRhIiwidXBkYXRlU3RhZ2VEYXRhIiwic3VibWl0UGxheWVyU3RhZ2UiLCJ1cGRhdGVQbGF5ZXJTdGFnZURhdGEiLCJnYW1lU2V0IiwiZ2FtZUxvYmJ5U2V0IiwicGxheWVyU2V0Iiwic3RhZ2VTZXQiLCJwbGF5ZXJTdGFnZUlkIiwic3RhZ2VTdWJtaXQiLCJjYiIsInJvdW5kU2V0IiwibnVsbEZ1bmMiLCJleGl0IiwicmVhc29uIiwicGxheWVyU3RhZ2UiLCJzdWJtaXQiLCJzdWJtaXR0ZWQiLCJzdWJtaXR0ZWRBdCIsImVuZCIsInBsYXllcklEcyIsImF2YWlsUGxheWVySURzIiwiZG9uZUNvdW50IiwiY3JlYXRlUGxheWVyIiwicGxheWVyUmVhZHkiLCJtYXJrUGxheWVyRXhpdFN0ZXBEb25lIiwiZXh0ZW5kUGxheWVyVGltZW91dFdhaXQiLCJlbmRQbGF5ZXJUaW1lb3V0V2FpdCIsInJldGlyZVNpbmdsZVBsYXllciIsInJldGlyZUdhbWVGdWxsUGxheWVycyIsInBsYXllcldhc1JldGlyZWQiLCJ1cGRhdGVQbGF5ZXJTdGF0dXMiLCJleGl0U3RhdHVzZXMiLCJzbGVlcCIsInVybFBhcmFtcyIsImV4aXN0aW5nIiwibG9iYnlQb29sIiwic2tpcEluc3RydWN0aW9ucyIsImFzc2lnblRvTG9iYnkiLCJsb2JieVVwZGF0ZWQiLCJzdGVwTmFtZSIsImV4aXRTdGVwc0RvbmUiLCIkaW5jIiwiY3VycmVudFBsYXllciIsIm9ubGluZVBsYXllcnMiLCJyZXRpcmVkQXQiLCJ0aW1lc3RhbXAiLCJ0b0lTT1N0cmluZyIsInJldGlyZWRSZWFzb24iLCJpZGxlIiwibGFzdEFjdGl2aXR5QXQiLCJwbGF5ZXJJZENvbm4iLCJQbGF5ZXJzQ29sbGVjdGlvbiIsIm9ubGluZSIsImxhc3RMb2dpbiIsInNhdmVQbGF5ZXJJZCIsInJldGlyZWQiLCJzZWxlY3RvciIsInBsYXllckV4aXN0cyIsImNsaWVudHMiLCJoYXNQbGF5ZXJzIiwiaW5pdGlhbGl6aW5nIiwiaGFuZGxlIiwib2JzZXJ2ZUNoYW5nZXMiLCJhZGRlZCIsImNsaWVudCIsImNoYW5nZWQiLCJyZW1vdmVkIiwicmVhZHkiLCJvblN0b3AiLCJ0YXJnZXRzIiwiY2JOYW1lIiwib25TZXRBcHBlbmQiLCJjYWxsYmFja3MiLCJ0YXJnZXRUeXBlIiwibG9jayIsImR1cmF0aW9uIiwiY3JlYXRlVHJlYXRtZW50IiwidXBkYXRlVHJlYXRtZW50IiwicmVxdWlyZWRGYWN0b3JUeXBlcyIsImNyZWF0ZWRGYWN0b3JzIiwiY3JlYXRlZEZhY3RvclR5cGVzIiwiYWRkRG9jVmFsaWRhdG9yIiwiJHNpemUiLCIkYWxsIiwiUmVhY3QiLCJtb2R1bGUxIiwiaXNDbGFzc0NvbXBvbmVudCIsImNvbXBvbmVudCIsInByb3RvdHlwZSIsImlzUmVhY3RDb21wb25lbnQiLCJpc0Z1bmN0aW9uQ29tcG9uZW50IiwiaXNFbGVtZW50IiwiZWxlbWVudCIsImlzVmFsaWRFbGVtZW50IiwiaXNET01UeXBlRWxlbWVudCIsImlzQ29tcG9zaXRlVHlwZUVsZW1lbnQiLCJleHBvcnRzIiwiaW5jc2V0IiwicmF3IiwiZmluZEFuZE1vZGlmeSIsIm9wIiwiYW1vdW50IiwibmV3IiwibG9nZ2luZyIsImdldExvZ2dlciIsInNldERlZmF1bHRMZXZlbCIsImxvZ2xldmVsIiwic2V0TGV2ZWwiLCJpc1JlYWN0Q29tcG9uZW50cyIsIm1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ2YWx1ZXMiLCJzYW1wbGVzIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImNvbXBvbmVudHMiLCJpc0FycmF5IiwiU1RSSVBfQ09NTUVOVFMiLCJBUkdVTUVOVF9OQU1FUyIsImZuU3RyIiwidG9TdHJpbmciLCJyZXBsYWNlIiwiYXJnc0xpc3QiLCJyZXN1bHQiLCJtYXRjaCIsInN0cmlwcGVkIiwiQWNjb3VudHMiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJhbWJpZ3VvdXNFcnJvck1lc3NhZ2VzIiwiY3J5cHRvIiwiSWRlbnRpY29uIiwiamRlbnRpY29uIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwidXJsIiwiaGFzaCIsImNyZWF0ZUhhc2giLCJkaWdlc3QiLCJzdmciLCJzaXplIiwiZm9ybWF0IiwidG9TdmciLCJ3cml0ZUhlYWQiLCJhZG1pbnMiLCJzZXR0aW5nc0FkbWlucyIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJ0ZW1wUGFzc3dvcmQiLCJhZG1pbiIsInVzZXJzIiwiY3JlYXRlVXNlciIsInNldFBhc3N3b3JkIiwibG9nb3V0IiwiY29ubmVjdGlvbnMiLCJmb3JnZXRQbGF5ZXJJZCIsInBsYXllckluTG9iYnkiLCJwaWkiLCJjb2xsZWN0UElJIiwiaXAiLCJjbGllbnRBZGRyZXNzIiwidXNlckFnZW50IiwiaHR0cEhlYWRlcnMiLCJhdCIsIm9uQ29ubmVjdGlvbiIsIm9uQ2xvc2UiLCJjb2xvcnMiLCJ0YXNrcyIsIkZ1bmN0aW9uIiwibG9nQ3JvbiIsImNyb24iLCJjcm9uTG9nIiwibXNnIiwiY3JvbkxvZ0VyciIsImRlZmVyIiwidGFza05hbWUiLCJib2xkIiwic3RhcnRMb2ciLCJncmVlbiIsImRvbmVMb2ciLCJ0b29rIiwid2FpdCIsInJlZCIsImRpbSIsInN0YXJ0IiwiQk9NIiwiY2FzdCIsInF1b3RlTWFyayIsImRvdWJsZVF1b3RlTWFyayIsInF1b3RlUmVnZXgiLCJlbmNvZGVDZWxscyIsImFyY2hpdmVyIiwiY29udGVudERpc3Bvc2l0aW9uIiwic3RyZWFtcyIsImdldERhdGFLZXlzIiwicmVjb3JkIiwiYSIsImlzRGF0ZSIsInV0YyIsImlzT2JqZWN0IiwiaXNTdHJpbmciLCJsaW5lIiwicm93IiwibGltaXQiLCJpdGVyYXRvciIsInNraXAiLCJyZWNvcmRzIiwibmV4dCIsImxvZ2luVG9rZW4iLCJjb29raWVzIiwibWV0ZW9yX2xvZ2luX3Rva2VuIiwidXNlciIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiY2FuY2VsUmVxdWVzdCIsInJlcXVlc3RGaW5pc2hlZCIsInRzIiwiZmlsZW5hbWUiLCJzZXRIZWFkZXIiLCJhcmNoaXZlIiwiY29kZSIsInBpcGUiLCJleGlzdGluZ0ZpbGUiLCJzYXZlRmlsZSIsImRhdGFLZXlzIiwiZmlsZSIsIlJlYWRhYmxlU3RyZWFtQnVmZmVyIiwicHV0IiwiaXNGaXJzdExpbmUiLCJ1c2VyRGF0YSIsImVhY2giLCJzdG9wIiwiZmFjdG9yVHlwZUZpZWxkcyIsInB1dHMiLCJmdCIsImZhY3RvckZpZWxkcyIsInRyZWF0bWVudEZpZWxkcyIsImxvYmJ5Q29uZmlnRmllbGRzIiwiYmF0Y2hGaWVsZHMiLCJnYW1lTG9iYnlGaWVsZHMiLCJnYW1lRmllbGRzIiwiZ2FtZURhdGFGaWVsZHMiLCJwbGF5ZXJGaWVsZHMiLCJpbmNsdWRlX3BpaSIsInNwbGljZSIsInBsYXllckRhdGFGaWVsZHMiLCJyb3VuZEZpZWxkcyIsInJvdW5kRGF0YUZpZWxkcyIsInN0YWdlRmllbGRzIiwic3RhZ2VEYXRhRmllbGRzIiwicGxheWVyUm91bmRGaWVsZHMiLCJwbGF5ZXJSb3VuZERhdGFGaWVsZHMiLCJwbGF5ZXJTdGFnZUZpZWxkcyIsInBsYXllclN0YWdlRGF0YUZpZWxkcyIsInBsYXllcklucHV0RmllbGRzIiwicGxheWVySW5wdXREYXRhRmllbGRzIiwicGxheWVyTG9nRmllbGRzIiwiZmluYWxpemUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFFBQU0sRUFBQyxNQUFJQTtBQUFaLENBQWQ7QUFBbUNGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDJCQUFaO0FBQXlDLElBQUlDLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJQyxlQUFKO0FBQW9CUCxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDSSxpQkFBZSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsbUJBQWUsR0FBQ0QsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQTlDLEVBQXNGLENBQXRGO0FBQXlGLElBQUlFLFlBQUo7QUFBaUJSLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNLLGNBQVksQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLGdCQUFZLEdBQUNGLENBQWI7QUFBZTs7QUFBaEMsQ0FBdkMsRUFBeUUsQ0FBekU7QUFBNEUsSUFBSUcsWUFBSjtBQUFpQlQsTUFBTSxDQUFDRyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ00sY0FBWSxDQUFDSCxDQUFELEVBQUc7QUFBQ0csZ0JBQVksR0FBQ0gsQ0FBYjtBQUFlOztBQUFoQyxDQUF2QyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJSSxhQUFKO0FBQWtCVixNQUFNLENBQUNHLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDTyxlQUFhLENBQUNKLENBQUQsRUFBRztBQUFDSSxpQkFBYSxHQUFDSixDQUFkO0FBQWdCOztBQUFsQyxDQUFyQyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJSyxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFVBQVosRUFBdUI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0ssVUFBTSxHQUFDTCxDQUFQO0FBQVM7O0FBQXJCLENBQXZCLEVBQThDLENBQTlDO0FBQWlELElBQUlNLHFCQUFKO0FBQTBCWixNQUFNLENBQUNHLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUNTLHVCQUFxQixDQUFDTixDQUFELEVBQUc7QUFBQ00seUJBQXFCLEdBQUNOLENBQXRCO0FBQXdCOztBQUFsRCxDQUExQixFQUE4RSxDQUE5RTtBQUFpRixJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNVLE9BQUssQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLFNBQUssR0FBQ1AsQ0FBTjtBQUFROztBQUFsQixDQUFuQyxFQUF1RCxDQUF2RDtBQUc5c0JGLFlBQVksQ0FBQ1UsS0FBYixHQUFxQixJQUFyQjs7QUFVQSxNQUFNQyxZQUFZLEdBQUcsVUFBU0MsSUFBVCxFQUFlQyxJQUFmLEVBQXFCQyxTQUFyQixFQUFnQztBQUNuRCxNQUFJO0FBQ0YsWUFBUUYsSUFBUjtBQUNFLFdBQUssYUFBTDtBQUNBLFdBQUssY0FBTDtBQUNBLFdBQUssY0FBTDtBQUNBLFdBQUssWUFBTDtBQUNBLFdBQUssWUFBTDtBQUNBLFdBQUssV0FBTDtBQUNFRyxvQ0FBNEIsQ0FBQ0YsSUFBRCxDQUE1QjtBQUNBOztBQUVGO0FBQ0U7QUFYSjs7QUFjQSxVQUFNRyxJQUFJLEdBQUdQLEtBQUssQ0FBQ1EsT0FBTixDQUFjSCxTQUFTLENBQUMsQ0FBRCxDQUFULENBQWFJLEdBQTNCLENBQWI7O0FBRUEsUUFBSUYsSUFBSSxDQUFDRyxVQUFULEVBQXFCO0FBQ25CQyxhQUFPLENBQUNDLEdBQVIsQ0FBWSxtQ0FBWjtBQUNBO0FBQ0Q7O0FBRUQsV0FBT1IsSUFBSSxDQUFDUyxLQUFMLENBQVcsSUFBWCxFQUFpQlIsU0FBakIsQ0FBUDtBQUNELEdBdkJELENBdUJFLE9BQU9TLEdBQVAsRUFBWTtBQUNaSCxXQUFPLENBQUNJLEtBQVIsa0RBQXdEWixJQUF4RDtBQUNBUSxXQUFPLENBQUNJLEtBQVIsQ0FBY0QsR0FBZDtBQUNBLFVBQU1QLElBQUksR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBdEI7QUFFQVIsaUJBQWEsQ0FBQ21CLElBQWQsQ0FBbUI7QUFDakJDLFlBQU0sRUFBRVYsSUFBSSxDQUFDRSxHQURJO0FBRWpCUyxlQUFTLHNCQUFlZixJQUFmLGNBRlE7QUFHakJnQixZQUFNLEVBQUU7QUFIUyxLQUFuQjtBQUtEO0FBQ0YsQ0FuQ0Q7O0FBcUNBLE1BQU1iLDRCQUE0QixHQUFHRixJQUFJLElBQUk7QUFDM0MsUUFBTWdCLFVBQVUsR0FBR3JCLHFCQUFxQixDQUFDSyxJQUFELENBQXhDO0FBQ0EsUUFBTWlCLE9BQU8sR0FBRztBQUNkQyw0QkFBd0IsQ0FBQ0MsTUFBRCxFQUFTQyxRQUFULEVBQW1CO0FBQ3pDLFlBQU1DLEdBQUcsR0FBR0QsUUFBUSxDQUFDRSxLQUFULENBQWUsT0FBZixFQUF3QixDQUF4QixDQUFaO0FBQ0EsWUFBTUMsS0FBSyxHQUFHQyxRQUFRLENBQUNKLFFBQVEsQ0FBQ0UsS0FBVCxDQUFlLE9BQWYsRUFBd0IsQ0FBeEIsQ0FBRCxDQUF0Qjs7QUFDQSxVQUNHRCxHQUFHLEtBQUssTUFBUixJQUFrQkUsS0FBSyxLQUFLLENBQTdCLElBQ0NGLEdBQUcsS0FBSyxPQUFSLElBQW1CRSxLQUFLLEtBQUssQ0FEOUIsSUFFQ0YsR0FBRyxLQUFLLE9BQVIsSUFBbUJFLEtBQUssS0FBSyxDQUhoQyxFQUlFO0FBQ0E7QUFDRCxPQU5ELE1BTU8sSUFBSUYsR0FBRyxLQUFLLFNBQVosRUFBdUI7QUFDNUIsY0FBTSxJQUFJSSxLQUFKLDhFQUFOO0FBR0QsT0FKTSxNQUlBO0FBQ0wsY0FBTSxJQUFJQSxLQUFKLGFBQWNKLEdBQWQsaURBQU47QUFDRDtBQUNGOztBQWpCYSxHQUFoQjtBQW9CQSxRQUFNSyxLQUFLLEdBQUcsSUFBSUMsS0FBSixDQUFVLEVBQVYsRUFBY1YsT0FBZCxDQUFkO0FBQ0FELFlBQVUsQ0FBQ1ksT0FBWCxDQUFtQixDQUFDUCxHQUFELEVBQU1FLEtBQU4sS0FBZ0I7QUFDakMsVUFBTUgsUUFBUSxHQUFHQyxHQUFHLEdBQUcsT0FBTixHQUFnQkUsS0FBakM7QUFDQU0sVUFBTSxDQUFDWCx3QkFBUCxDQUFnQ1EsS0FBaEMsRUFBdUNOLFFBQXZDO0FBQ0QsR0FIRDtBQUlELENBM0JELEMsQ0E2QkE7OztBQUNBLE1BQU1uQyxNQUFNLEdBQUc7QUFBRTZDLE1BQUksRUFBRTtBQUFSLENBQWY7QUFFQSxNQUFNQyxRQUFRLEdBQUc7QUFDZjtBQUNBQyxVQUFRLENBQUNoQyxJQUFELEVBQU87QUFDYmYsVUFBTSxDQUFDK0MsUUFBUCxHQUFrQmhDLElBQWxCO0FBQ0QsR0FKYzs7QUFNZmlDLEtBQUcsQ0FBQ2xDLElBQUQsRUFBT21DLEdBQVAsRUFBWTtBQUNiLFFBQUlqRCxNQUFNLENBQUM2QyxJQUFQLENBQVkvQixJQUFaLENBQUosRUFBdUI7QUFDckIsNEJBQWNBLElBQWQ7QUFDRDs7QUFDRGQsVUFBTSxDQUFDNkMsSUFBUCxDQUFZL0IsSUFBWixJQUFvQm1DLEdBQXBCO0FBQ0QsR0FYYzs7QUFhZkMsYUFBVyxDQUFDbkMsSUFBRCxFQUFPO0FBQ2hCZixVQUFNLENBQUNrRCxXQUFQLEdBQXFCLFlBQVc7QUFDOUIsYUFBT3JDLFlBQVksQ0FBQyxhQUFELEVBQWdCRSxJQUFoQixFQUFzQkMsU0FBdEIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0FqQmM7O0FBbUJmbUMsY0FBWSxDQUFDcEMsSUFBRCxFQUFPO0FBQ2pCZixVQUFNLENBQUNtRCxZQUFQLEdBQXNCLFlBQVc7QUFDL0IsYUFBT3RDLFlBQVksQ0FBQyxjQUFELEVBQWlCRSxJQUFqQixFQUF1QkMsU0FBdkIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0F2QmM7O0FBeUJmb0MsY0FBWSxDQUFDckMsSUFBRCxFQUFPO0FBQ2pCZixVQUFNLENBQUNvRCxZQUFQLEdBQXNCLFlBQVc7QUFDL0IsYUFBT3ZDLFlBQVksQ0FBQyxjQUFELEVBQWlCRSxJQUFqQixFQUF1QkMsU0FBdkIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0E3QmM7O0FBK0JmcUMsWUFBVSxDQUFDdEMsSUFBRCxFQUFPO0FBQ2ZmLFVBQU0sQ0FBQ3FELFVBQVAsR0FBb0IsWUFBVztBQUM3QixhQUFPeEMsWUFBWSxDQUFDLFlBQUQsRUFBZUUsSUFBZixFQUFxQkMsU0FBckIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0FuQ2M7O0FBcUNmc0MsWUFBVSxDQUFDdkMsSUFBRCxFQUFPO0FBQ2ZmLFVBQU0sQ0FBQ3NELFVBQVAsR0FBb0IsWUFBVztBQUM3QixhQUFPekMsWUFBWSxDQUFDLFlBQUQsRUFBZUUsSUFBZixFQUFxQkMsU0FBckIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0F6Q2M7O0FBMkNmdUMsV0FBUyxDQUFDeEMsSUFBRCxFQUFPO0FBQ2RmLFVBQU0sQ0FBQ3VELFNBQVAsR0FBbUIsWUFBVztBQUM1QixhQUFPMUMsWUFBWSxDQUFDLFdBQUQsRUFBY0UsSUFBZCxFQUFvQkMsU0FBcEIsQ0FBbkI7QUFDRCxLQUZEO0FBR0QsR0EvQ2M7O0FBaURmd0MsT0FBSyxDQUFDekMsSUFBRCxFQUFPO0FBQ1ZmLFVBQU0sQ0FBQ3dELEtBQVAsR0FBZSxZQUFXO0FBQ3hCLGFBQU8zQyxZQUFZLENBQUMsT0FBRCxFQUFVRSxJQUFWLEVBQWdCQyxTQUFoQixDQUFuQjtBQUNELEtBRkQ7QUFHRCxHQXJEYzs7QUF1RGZ5QyxVQUFRLENBQUMxQyxJQUFELEVBQU87QUFDYmYsVUFBTSxDQUFDeUQsUUFBUCxHQUFrQixZQUFXO0FBQzNCLGFBQU81QyxZQUFZLENBQUMsVUFBRCxFQUFhRSxJQUFiLEVBQW1CQyxTQUFuQixDQUFuQjtBQUNELEtBRkQ7QUFHRCxHQTNEYzs7QUE2RGYwQyxVQUFRLENBQUMzQyxJQUFELEVBQU87QUFDYmYsVUFBTSxDQUFDMEQsUUFBUCxHQUFrQixZQUFXO0FBQzNCLGFBQU83QyxZQUFZLENBQUMsVUFBRCxFQUFhRSxJQUFiLEVBQW1CQyxTQUFuQixDQUFuQjtBQUNELEtBRkQ7QUFHRCxHQWpFYzs7QUFtRWYyQyxVQUFRLENBQUM1QyxJQUFELEVBQU87QUFDYmYsVUFBTSxDQUFDMkQsUUFBUCxHQUFrQixZQUFXO0FBQzNCLGFBQU85QyxZQUFZLENBQUMsVUFBRCxFQUFhRSxJQUFiLEVBQW1CQyxTQUFuQixDQUFuQjtBQUNELEtBRkQ7QUFHRDs7QUF2RWMsQ0FBakI7QUFsRkFsQixNQUFNLENBQUM4RCxhQUFQLENBNkplZCxRQTdKZjtBQStKQTtBQUNBckMsTUFBTSxDQUFDSixlQUFQLEdBQXlCQSxlQUF6QjtBQUNBSSxNQUFNLENBQUNILFlBQVAsR0FBc0JBLFlBQXRCO0FBQ0FHLE1BQU0sQ0FBQ0YsWUFBUCxHQUFzQkEsWUFBdEIsQzs7Ozs7Ozs7Ozs7QUNsS0EsTUFBTXNELGFBQWEsR0FBRyxFQUF0QjtBQUFBL0QsTUFBTSxDQUFDOEQsYUFBUCxDQUVlQyxhQUZmLEU7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUVBLE1BQU1DLGVBQWUsR0FBRyxFQUF4QjtBQUhBaEUsTUFBTSxDQUFDOEQsYUFBUCxDQUtlRSxlQUxmLEU7Ozs7Ozs7Ozs7O0FDQUFoRSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDZ0UsYUFBVyxFQUFDLE1BQUlBO0FBQWpCLENBQWQ7QUFBNkMsSUFBSUMsT0FBSjtBQUFZbEUsTUFBTSxDQUFDRyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQytELFNBQU8sQ0FBQzVELENBQUQsRUFBRztBQUFDNEQsV0FBTyxHQUFDNUQsQ0FBUjtBQUFVOztBQUF0QixDQUFuQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJNkQsT0FBSjtBQUFZbkUsTUFBTSxDQUFDRyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ2dFLFNBQU8sQ0FBQzdELENBQUQsRUFBRztBQUFDNkQsV0FBTyxHQUFDN0QsQ0FBUjtBQUFVOztBQUF0QixDQUFuQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJOEQsV0FBSjtBQUFnQnBFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUNpRSxhQUFXLENBQUM5RCxDQUFELEVBQUc7QUFBQzhELGVBQVcsR0FBQzlELENBQVo7QUFBYzs7QUFBOUIsQ0FBN0MsRUFBNkUsQ0FBN0U7QUFBZ0YsSUFBSU8sS0FBSjtBQUFVYixNQUFNLENBQUNHLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDVSxPQUFLLENBQUNQLENBQUQsRUFBRztBQUFDTyxTQUFLLEdBQUNQLENBQU47QUFBUTs7QUFBbEIsQ0FBL0IsRUFBbUQsQ0FBbkQ7QUFBc0QsSUFBSStELFlBQUo7QUFBaUJyRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDa0UsY0FBWSxDQUFDL0QsQ0FBRCxFQUFHO0FBQUMrRCxnQkFBWSxHQUFDL0QsQ0FBYjtBQUFlOztBQUFoQyxDQUEvQyxFQUFpRixDQUFqRjtBQUFvRixJQUFJZ0UsWUFBSjtBQUFpQnRFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNtRSxjQUFZLENBQUNoRSxDQUFELEVBQUc7QUFBQ2dFLGdCQUFZLEdBQUNoRSxDQUFiO0FBQWU7O0FBQWhDLENBQS9DLEVBQWlGLENBQWpGO0FBQW9GLElBQUlpRSxZQUFKO0FBQWlCdkUsTUFBTSxDQUFDRyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ29FLGNBQVksQ0FBQ2pFLENBQUQsRUFBRztBQUFDaUUsZ0JBQVksR0FBQ2pFLENBQWI7QUFBZTs7QUFBaEMsQ0FBL0MsRUFBaUYsQ0FBakY7QUFBb0YsSUFBSWtFLFlBQUo7QUFBaUJ4RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDcUUsY0FBWSxDQUFDbEUsQ0FBRCxFQUFHO0FBQUNrRSxnQkFBWSxHQUFDbEUsQ0FBYjtBQUFlOztBQUFoQyxDQUEvQyxFQUFpRixDQUFqRjtBQUFvRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFuQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJb0UsTUFBSjtBQUFXMUUsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUFqQyxFQUF1RCxDQUF2RDtBQUEwRCxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ3dFLFFBQU0sQ0FBQ3JFLENBQUQsRUFBRztBQUFDcUUsVUFBTSxHQUFDckUsQ0FBUDtBQUFTOztBQUFwQixDQUFqQyxFQUF1RCxFQUF2RDtBQUEyRCxJQUFJc0UsVUFBSjtBQUFlNUUsTUFBTSxDQUFDRyxJQUFQLENBQVksNEJBQVosRUFBeUM7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUF6QyxFQUF1RSxFQUF2RTtBQWFsOUIsTUFBTTJELFdBQVcsR0FBRyxDQUN6QkMsT0FEeUIsRUFFekJDLE9BRnlCLEVBR3pCQyxXQUh5QixFQUl6QnZELEtBSnlCLEVBS3pCd0QsWUFMeUIsRUFNekJDLFlBTnlCLEVBT3pCQyxZQVB5QixFQVF6QkMsWUFSeUIsRUFTekJDLE9BVHlCLEVBVXpCQyxNQVZ5QixFQVd6QkMsTUFYeUIsRUFZekJDLFVBWnlCLENBQXBCLEM7Ozs7Ozs7Ozs7O0FDYlA1RSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDNEUsVUFBUSxFQUFDLE1BQUlBLFFBQWQ7QUFBdUJDLGdCQUFjLEVBQUMsTUFBSUEsY0FBMUM7QUFBeURDLGlCQUFlLEVBQUMsTUFBSUEsZUFBN0U7QUFBNkZDLGlCQUFlLEVBQUMsTUFBSUEsZUFBakg7QUFBaUlDLGVBQWEsRUFBQyxNQUFJQSxhQUFuSjtBQUFpS0MsZ0JBQWMsRUFBQyxNQUFJQSxjQUFwTDtBQUFtTUMsbUJBQWlCLEVBQUMsTUFBSUEsaUJBQXpOO0FBQTJPQyxjQUFZLEVBQUMsTUFBSUEsWUFBNVA7QUFBeVFDLFdBQVMsRUFBQyxNQUFJQTtBQUF2UixDQUFkO0FBQWlULElBQUlqRixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSWdGLFVBQUo7QUFBZXRGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ2dGLGNBQVUsR0FBQ2hGLENBQVg7QUFBYTs7QUFBekIsQ0FBekIsRUFBb0QsQ0FBcEQ7QUFHclksTUFBTXVFLFFBQVEsR0FBRyxJQUFJekUsWUFBSixDQUFpQjtBQUN2Q2tCLEtBQUcsRUFBRTtBQUNIaUUsUUFBSSxFQUFFQyxNQURIO0FBRUhDLFlBQVEsRUFBRSxJQUZQO0FBR0hDLFNBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBSHZCO0FBRGtDLENBQWpCLENBQWpCO0FBUUEsTUFBTWQsY0FBYyxHQUFHLElBQUkxRSxZQUFKLENBQWlCO0FBQzdDeUYsY0FBWSxFQUFFO0FBQ1pOLFFBQUksRUFBRUMsTUFETTtBQUVaQyxZQUFRLEVBQUUsSUFGRTtBQUdaQyxTQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQyxFQUhkOztBQUlaRSxhQUFTLEdBQUc7QUFDVixVQUFJLEtBQUtDLEtBQUwsQ0FBVyxZQUFYLEVBQXlCQyxLQUE3QixFQUFvQztBQUNsQyxlQUFPLEtBQUtDLE1BQVo7QUFDRDs7QUFDRCxhQUFPQyxTQUFQO0FBQ0Q7O0FBVFcsR0FEK0I7QUFZN0NDLFlBQVUsRUFBRTtBQUNWWixRQUFJLEVBQUVhLElBREk7QUFFVkMsU0FBSyxFQUFFLGFBRkc7QUFHVlosWUFBUSxFQUFFO0FBSEE7QUFaaUMsQ0FBakIsQ0FBdkI7QUFtQkEsTUFBTVYsZUFBZSxHQUFHLElBQUkzRSxZQUFKLENBQWlCO0FBQzlDa0csV0FBUyxFQUFFO0FBQ1RmLFFBQUksRUFBRWdCLE9BREc7QUFFVEMsZ0JBQVksRUFBRTtBQUZMO0FBRG1DLENBQWpCLENBQXhCO0FBT0EsTUFBTXhCLGVBQWUsR0FBRyxJQUFJNUUsWUFBSixDQUFpQjtBQUM5Q3FHLFdBQVMsRUFBRTtBQUNUbEIsUUFBSSxFQUFFYSxJQURHO0FBRVRDLFNBQUssRUFBRSxZQUZFO0FBR1Q7QUFDQTdELFNBQUssRUFBRSxJQUpFOztBQUtUc0QsYUFBUyxHQUFHO0FBQ1YsVUFBSSxLQUFLWSxRQUFULEVBQW1CO0FBQ2pCLGVBQU8sSUFBSU4sSUFBSixFQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBS08sUUFBVCxFQUFtQjtBQUN4QixlQUFPO0FBQUVDLHNCQUFZLEVBQUUsSUFBSVIsSUFBSjtBQUFoQixTQUFQO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsYUFBS1MsS0FBTCxHQURLLENBQ1M7QUFDZjtBQUNGOztBQWJRLEdBRG1DO0FBZ0I5Q0MsV0FBUyxFQUFFO0FBQ1R2QixRQUFJLEVBQUVhLElBREc7QUFFVEMsU0FBSyxFQUFFLGlCQUZFO0FBR1RaLFlBQVEsRUFBRSxJQUhEO0FBSVQ7QUFDQWpELFNBQUssRUFBRSxJQUxFOztBQU1Uc0QsYUFBUyxHQUFHO0FBQ1YsVUFBSSxLQUFLaUIsUUFBVCxFQUFtQjtBQUNqQixlQUFPLElBQUlYLElBQUosRUFBUDtBQUNEO0FBQ0Y7O0FBVlE7QUFoQm1DLENBQWpCLENBQXhCO0FBK0JBLE1BQU1uQixhQUFhLEdBQUcsSUFBSTdFLFlBQUosQ0FBaUI7QUFDNUM0RyxhQUFXLEVBQUU7QUFDWHpCLFFBQUksRUFBRUMsTUFESztBQUVYYSxTQUFLLEVBQUUsWUFGSTtBQUdYO0FBQ0FYLFNBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDLEVBSmY7O0FBS1hFLGFBQVMsR0FBRztBQUNWLFVBQUksS0FBS1ksUUFBVCxFQUFtQjtBQUNqQixlQUFPLEtBQUtWLEtBQUwsSUFBYyxLQUFLaUIsaUJBQW5CLEdBQXVDZixTQUF2QyxHQUFtRCxLQUFLRCxNQUEvRDtBQUNEOztBQUNELGFBQU9DLFNBQVA7QUFDRCxLQVZVOztBQVdYMUQsU0FBSyxFQUFFO0FBWEksR0FEK0I7QUFjNUMwRSxhQUFXLEVBQUU7QUFDWDNCLFFBQUksRUFBRUMsTUFESztBQUVYYSxTQUFLLEVBQUUsaUJBRkk7QUFHWFosWUFBUSxFQUFFLElBSEM7QUFJWEMsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFKZjs7QUFLWEUsYUFBUyxHQUFHO0FBQ1YsVUFBSSxLQUFLaUIsUUFBVCxFQUFtQjtBQUNqQixlQUFPLEtBQUtkLE1BQVo7QUFDRDtBQUNGLEtBVFU7O0FBVVh6RCxTQUFLLEVBQUU7QUFWSTtBQWQrQixDQUFqQixDQUF0QjtBQTRCQSxNQUFNMEMsY0FBYyxHQUFHLElBQUk5RSxZQUFKLENBQWlCO0FBQzdDK0csTUFBSSxFQUFFO0FBQ0o1QixRQUFJLEVBQUV6QyxNQURGO0FBRUpzRSxZQUFRLEVBQUUsSUFGTjtBQUdKWixnQkFBWSxFQUFFO0FBSFY7QUFEdUMsQ0FBakIsQ0FBdkI7O0FBYUEsTUFBTXJCLGlCQUFpQixHQUFHLFVBQVNrQyxTQUFULEVBQW9CO0FBQ25ELFNBQU8sSUFBSWpILFlBQUosQ0FBaUI7QUFDdEJrSCxjQUFVLEVBQUU7QUFDVi9CLFVBQUksRUFBRUMsTUFESTtBQUVWK0IsbUJBQWEsRUFBRUYsU0FGTDtBQUdWO0FBQ0E3RSxXQUFLLEVBQUU7QUFKRyxLQURVO0FBT3RCZ0YsWUFBUSxFQUFFO0FBQ1JqQyxVQUFJLEVBQUVDLE1BREU7QUFFUkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGbEI7QUFHUjtBQUNBcEQsV0FBSyxFQUFFO0FBSkM7QUFQWSxHQUFqQixDQUFQO0FBY0QsQ0FmTTs7QUFpQkEsTUFBTTRDLFlBQVksR0FBRyxVQUFTcUMsSUFBVCxFQUFlO0FBQ3pDLFFBQU1DLEtBQUssR0FBR3BDLFVBQVUsQ0FBQ3FDLFFBQVgsQ0FBb0JyQyxVQUFVLENBQUNzQyxXQUFYLENBQXVCSCxJQUF2QixDQUFwQixFQUFrRCxJQUFsRCxDQUFkO0FBQ0EsUUFBTXBCLEtBQUssR0FBR2YsVUFBVSxDQUFDdUMsUUFBWCxDQUFvQkosSUFBcEIsQ0FBZDtBQUNBLFFBQU1LLFNBQVMsYUFBTUosS0FBTixRQUFmO0FBQ0EsU0FBTyxJQUFJdEgsWUFBSixDQUFpQjtBQUN0QixLQUFDMEgsU0FBRCxHQUFhO0FBQ1h2QyxVQUFJLEVBQUV3QyxLQURLO0FBRVh2QixrQkFBWSxFQUFFLEVBRkg7QUFHWEgsV0FIVztBQUlYN0QsV0FBSyxFQUFFO0FBSkksS0FEUztBQU90QixlQUFJc0YsU0FBSixVQUFvQjtBQUNsQnZDLFVBQUksRUFBRUMsTUFEWTtBQUVsQkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGUjtBQUdsQlMsV0FBSyxZQUFLQSxLQUFMO0FBSGE7QUFQRSxHQUFqQixDQUFQO0FBYUQsQ0FqQk07O0FBbUJBLE1BQU1oQixTQUFTLEdBQUcsVUFBU29DLElBQVQsRUFBZ0M7QUFBQSxNQUFqQk8sUUFBaUIsdUVBQU4sSUFBTTtBQUN2RCxRQUFNQyxRQUFRLEdBQUczQyxVQUFVLENBQUNzQyxXQUFYLENBQXVCSCxJQUF2QixDQUFqQjtBQUNBLFFBQU1DLEtBQUssR0FBR3BDLFVBQVUsQ0FBQ3FDLFFBQVgsQ0FBb0JNLFFBQXBCLEVBQThCLElBQTlCLENBQWQ7QUFDQSxRQUFNNUIsS0FBSyxHQUFHZixVQUFVLENBQUN1QyxRQUFYLENBQW9CSSxRQUFwQixDQUFkO0FBQ0EsUUFBTUgsU0FBUyxhQUFNSixLQUFOLE9BQWY7QUFDQSxTQUFPLElBQUl0SCxZQUFKLENBQWlCO0FBQ3RCLEtBQUMwSCxTQUFELEdBQWE7QUFDWHZDLFVBQUksRUFBRUMsTUFESztBQUVYRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQyxFQUZmO0FBR1hTLFdBSFc7QUFJWDtBQUNBN0QsV0FBSyxFQUFFLElBTEk7QUFNWGlELGNBQVEsRUFBRSxDQUFDdUM7QUFOQTtBQURTLEdBQWpCLENBQVA7QUFVRCxDQWZNLEM7Ozs7Ozs7Ozs7O0FDakpQLElBQUkxQyxVQUFKO0FBQWV0RixNQUFNLENBQUNHLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNnRixjQUFVLEdBQUNoRixDQUFYO0FBQWE7O0FBQXpCLENBQXpCLEVBQW9ELENBQXBEO0FBQXVELElBQUltQixHQUFKO0FBQVF6QixNQUFNLENBQUNHLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNtQixPQUFHLEdBQUNuQixDQUFKO0FBQU07O0FBQWxCLENBQTVCLEVBQWdELENBQWhEO0FBQW1ELElBQUkyRCxXQUFKO0FBQWdCakUsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQzhELGFBQVcsQ0FBQzNELENBQUQsRUFBRztBQUFDMkQsZUFBVyxHQUFDM0QsQ0FBWjtBQUFjOztBQUE5QixDQUEvQixFQUErRCxDQUEvRDtBQWVqSjRILE1BQU0sQ0FBQ0MsT0FBUCxDQUFlLE1BQU07QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBRCxRQUFNLENBQUNFLFVBQVAsQ0FBa0IsTUFBTTtBQUN0Qm5FLGVBQVcsQ0FBQ3BCLE9BQVosQ0FBb0I0RSxJQUFJLElBQUk7QUFDMUIsVUFBSSxDQUFDQSxJQUFJLENBQUNZLE1BQVYsRUFBa0I7QUFDaEI7QUFDRDs7QUFFRCxVQUFJO0FBQ0YsY0FBTXJILElBQUksR0FBR3NFLFVBQVUsQ0FBQ3VDLFFBQVgsQ0FBb0JKLElBQUksQ0FBQ2EsS0FBekIsQ0FBYjtBQUNBN0csV0FBRyxDQUFDWCxLQUFKLENBQVUsbUJBQVYsRUFBK0JFLElBQS9COztBQUVBLGFBQUssTUFBTXNCLEdBQVgsSUFBa0JtRixJQUFJLENBQUNZLE1BQUwsQ0FBWUUsT0FBOUIsRUFBdUM7QUFDckMsY0FBSWQsSUFBSSxDQUFDWSxNQUFMLENBQVlFLE9BQVosQ0FBb0JDLGNBQXBCLENBQW1DbEcsR0FBbkMsQ0FBSixFQUE2QztBQUMzQyxrQkFBTW1HLEdBQUcsR0FBR2hCLElBQUksQ0FBQ1ksTUFBTCxDQUFZRSxPQUFaLENBQW9CakcsR0FBcEIsQ0FBWjtBQUVBLGtCQUFNb0csSUFBSSxlQUFPMUgsSUFBUCx5QkFBb0JzQixHQUFwQix3QkFBcUNtRyxHQUFHLENBQUNqRyxLQUF6QyxTQUFWLENBSDJDLENBSzNDOztBQUNBLGdCQUFJaUcsR0FBRyxDQUFDakcsS0FBSixLQUFjMEQsU0FBbEIsRUFBNkI7QUFDM0I7QUFDRCxhQVIwQyxDQVUzQzs7O0FBQ0EsZ0JBQUl1QyxHQUFHLENBQUNqRyxLQUFKLEtBQWMsS0FBbEIsRUFBeUI7QUFDdkJmLGlCQUFHLENBQUNrSCxJQUFKLDZDQUE4Q0QsSUFBOUM7QUFDQTtBQUNELGFBZDBDLENBZ0IzQzs7O0FBQ0EsZ0JBQUksRUFBRUQsR0FBRyxDQUFDakcsS0FBSixLQUFjLElBQWQsSUFBc0JpRyxHQUFHLENBQUNqRyxLQUFKLEtBQWMsQ0FBcEMsSUFBeUNpRyxHQUFHLENBQUNqRyxLQUFKLEtBQWMsQ0FBQyxDQUExRCxDQUFKLEVBQWtFO0FBQ2hFZixpQkFBRyxDQUFDa0gsSUFBSixrQ0FBbUNELElBQW5DO0FBQ0E7QUFDRCxhQXBCMEMsQ0FzQjNDOzs7QUFDQSxrQkFBTUUsSUFBSSxHQUFHLEVBQWI7O0FBQ0EsZ0JBQUlILEdBQUcsQ0FBQ0ksTUFBSixLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCQyxxQkFBTyxDQUFDRCxNQUFSLEdBQWlCLElBQWpCO0FBQ0Q7O0FBQ0QsZ0JBQUlKLEdBQUcsQ0FBQ00sTUFBSixLQUFlLElBQW5CLEVBQXlCO0FBQ3ZCSCxrQkFBSSxDQUFDRyxNQUFMLEdBQWMsSUFBZDtBQUNEOztBQUVELGdCQUFJdkcsS0FBSyxHQUFHLEVBQVo7O0FBQ0Esb0JBQVFpRyxHQUFHLENBQUNqRyxLQUFaO0FBQ0UsbUJBQUssQ0FBTDtBQUNBLG1CQUFLLElBQUw7QUFDRUEscUJBQUssR0FBRztBQUFFLG1CQUFDRixHQUFELEdBQU87QUFBVCxpQkFBUjtBQUNBOztBQUNGLG1CQUFLLENBQUMsQ0FBTjtBQUNFRSxxQkFBSyxHQUFHO0FBQUUsbUJBQUNGLEdBQUQsR0FBTyxDQUFDO0FBQVYsaUJBQVI7QUFDQTtBQVBKOztBQVVBYixlQUFHLENBQUNYLEtBQUosMkJBQ3FCa0ksSUFBSSxDQUFDQyxTQUFMLENBQWV6RyxLQUFmLENBRHJCLGVBQytDd0csSUFBSSxDQUFDQyxTQUFMLENBQzNDTCxJQUQyQyxDQUQvQztBQU1BbkIsZ0JBQUksQ0FBQ3lCLGFBQUwsR0FBcUJDLFdBQXJCLENBQWlDM0csS0FBakMsRUFBd0NvRyxJQUF4QyxFQUE4QyxDQUFDakgsR0FBRCxFQUFNeUgsR0FBTixLQUFjO0FBQzFELGtCQUFJekgsR0FBRyxJQUFJQSxHQUFHLENBQUMwSCxRQUFKLEtBQWlCLHNCQUE1QixFQUFvRDtBQUNsRDVILG1CQUFHLENBQUNHLEtBQUosK0JBQ3lCWixJQUR6QixjQUNpQ2dJLElBQUksQ0FBQ0MsU0FBTCxDQUFlekcsS0FBZixDQURqQyxlQUMyRGIsR0FEM0Q7QUFHRDtBQUNGLGFBTkQ7QUFPRDtBQUNGO0FBQ0YsT0E5REQsQ0E4REUsT0FBT0MsS0FBUCxFQUFjLENBQUU7QUFDbkIsS0FwRUQ7QUFxRUQsR0F0RUQsRUFzRUcsSUF0RUg7QUF1RUQsQ0FsRkQsRTs7Ozs7Ozs7Ozs7QUNmQSxJQUFJMEgsV0FBSjtBQUFnQnRKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNnSixlQUFXLEdBQUNoSixDQUFaO0FBQWM7O0FBQTFCLENBQXhDLEVBQW9FLENBQXBFO0FBQXVFLElBQUlGLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUd4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FGLFlBQVksQ0FBQ21KLGFBQWIsQ0FBMkIsQ0FBQyxjQUFELENBQTNCO0FBRUFELFdBQVcsQ0FBQ0UsRUFBWixDQUFlLGlCQUFmLEVBQWtDLENBQUNDLFVBQUQsRUFBYUMsRUFBYixLQUFvQjtBQUNwRCxNQUFJQSxFQUFFLENBQUNDLE9BQUgsSUFBYyxDQUFsQixFQUFxQjtBQUNuQkQsTUFBRSxDQUFDRSxVQUFILENBQWNDLFFBQWQsQ0FBdUI7QUFDckJDLGtCQUFZLEVBQUU7QUFETyxLQUF2QjtBQUdEOztBQUVESixJQUFFLENBQUNLLFlBQUgsQ0FBZ0IsWUFBVztBQUN6QixRQUFJLENBQUMsS0FBSy9ELEtBQVYsRUFBaUI7QUFDZjtBQUNEOztBQUVELFVBQU15QyxHQUFHLEdBQUcsS0FBS3VCLFVBQWpCO0FBQ0EsVUFBTUMsZ0JBQWdCLEdBQUd4QixHQUFHLENBQUNxQixZQUE3Qjs7QUFFQSxRQUFJLENBQUNHLGdCQUFMLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsVUFBTUMsR0FBRyxHQUFHLEtBQUtuRSxLQUFMLENBQVdrRSxnQkFBWCxFQUE2QkUsS0FBekM7QUFDQSxVQUFNN0gsR0FBRyxHQUFHLEtBQUtBLEdBQWpCOztBQUNBLFFBQ0VtSCxVQUFVLENBQ1BXLElBREgsQ0FDUTtBQUNKLE9BQUNILGdCQUFELEdBQW9CQyxHQURoQjtBQUVKLE9BQUM1SCxHQUFELEdBQU8sS0FBSzZIO0FBRlIsS0FEUixFQUtHRSxLQUxILEtBS2EsQ0FOZixFQU9FO0FBQ0EsYUFBTyxjQUFQO0FBQ0Q7QUFDRixHQXhCRDtBQXlCRCxDQWhDRCxFLENBa0NBOztBQUNBakssWUFBWSxDQUFDbUosYUFBYixDQUEyQixDQUFDLFlBQUQsRUFBZSxZQUFmLENBQTNCO0FBRUFELFdBQVcsQ0FBQ0UsRUFBWixDQUFlLGlCQUFmLEVBQWtDLENBQUNDLFVBQUQsRUFBYUMsRUFBYixLQUFvQjtBQUNwRCxNQUNFQSxFQUFFLENBQUNDLE9BQUgsSUFBYyxDQUFkLElBQ0FELEVBQUUsQ0FBQ0UsVUFESCxJQUVBLE9BQU9GLEVBQUUsQ0FBQ0UsVUFBSCxDQUFjQyxRQUFyQixLQUFrQyxVQUhwQyxFQUlFO0FBQ0FILE1BQUUsQ0FBQ0UsVUFBSCxDQUFjQyxRQUFkLENBQXVCO0FBQ3JCUyxRQUFFLEVBQUU7QUFDRkMsd0JBQWdCLEVBQUUsMENBRGhCO0FBRUZDLHdCQUFnQixFQUFFO0FBRmhCO0FBRGlCLEtBQXZCO0FBTUQ7O0FBRURkLElBQUUsQ0FBQ0ssWUFBSCxDQUFnQixTQUFTVSxtQkFBVCxHQUErQjtBQUM3QyxRQUFJLENBQUMsS0FBS3pFLEtBQVYsRUFBaUI7QUFFakIsVUFBTXlDLEdBQUcsR0FBRyxLQUFLdUIsVUFBakI7QUFFQSxRQUFJdkIsR0FBRyxDQUFDaUMsVUFBSixJQUFrQixLQUFLaEUsUUFBM0IsRUFBcUMsT0FBTyxrQkFBUDtBQUNyQyxRQUFJK0IsR0FBRyxDQUFDa0MsVUFBSixLQUFtQixLQUFLNUQsUUFBTCxJQUFpQixLQUFLSixRQUF6QyxDQUFKLEVBQ0UsT0FBTyxrQkFBUDtBQUNILEdBUkQ7QUFTRCxDQXZCRCxFLENBeUJBOztBQUNBdkcsWUFBWSxDQUFDbUosYUFBYixDQUEyQixDQUN6QixPQUR5QixFQUNoQjtBQUNULFFBRnlCLEVBRWY7QUFDVixRQUh5QixDQUdoQjtBQUhnQixDQUEzQixFOzs7Ozs7Ozs7OztBQzVFQSxJQUFJcUIsYUFBSjs7QUFBa0I1SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDc0ssaUJBQWEsR0FBQ3RLLENBQWQ7QUFBZ0I7O0FBQTVCLENBQW5ELEVBQWlGLENBQWpGO0FBQWxCLElBQUl1SyxJQUFKO0FBQVM3SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxTQUFaLEVBQXNCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUN1SyxRQUFJLEdBQUN2SyxDQUFMO0FBQU87O0FBQW5CLENBQXRCLEVBQTJDLENBQTNDO0FBQThDLElBQUlzRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDeUUsWUFBVSxDQUFDdEUsQ0FBRCxFQUFHO0FBQUNzRSxjQUFVLEdBQUN0RSxDQUFYO0FBQWE7O0FBQTVCLENBQWpELEVBQStFLENBQS9FO0FBQWtGLElBQUk2RCxPQUFKO0FBQVluRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDZ0UsU0FBTyxDQUFDN0QsQ0FBRCxFQUFHO0FBQUM2RCxXQUFPLEdBQUM3RCxDQUFSO0FBQVU7O0FBQXRCLENBQTNDLEVBQW1FLENBQW5FO0FBQXNFLElBQUl3SyxXQUFKO0FBQWdCOUssTUFBTSxDQUFDRyxJQUFQLENBQVksd0NBQVosRUFBcUQ7QUFBQzJLLGFBQVcsQ0FBQ3hLLENBQUQsRUFBRztBQUFDd0ssZUFBVyxHQUFDeEssQ0FBWjtBQUFjOztBQUE5QixDQUFyRCxFQUFxRixDQUFyRjtBQUF3RixJQUFJK0QsWUFBSjtBQUFpQnJFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBDQUFaLEVBQXVEO0FBQUNrRSxjQUFZLENBQUMvRCxDQUFELEVBQUc7QUFBQytELGdCQUFZLEdBQUMvRCxDQUFiO0FBQWU7O0FBQWhDLENBQXZELEVBQXlGLENBQXpGO0FBQTRGLElBQUl5SyxTQUFKO0FBQWMvSyxNQUFNLENBQUNHLElBQVAsQ0FBWSxtQ0FBWixFQUFnRDtBQUFDNEssV0FBUyxDQUFDekssQ0FBRCxFQUFHO0FBQUN5SyxhQUFTLEdBQUN6SyxDQUFWO0FBQVk7O0FBQTFCLENBQWhELEVBQTRFLENBQTVFO0FBQStFLElBQUltQixHQUFKO0FBQVF6QixNQUFNLENBQUNHLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDbUIsT0FBRyxHQUFDbkIsQ0FBSjtBQUFNOztBQUFsQixDQUEvQixFQUFtRCxDQUFuRDtBQVdwaUIsTUFBTTBLLFNBQVMsR0FBRyxDQUFDLDJDQUFELEVBQThDLE9BQTlDLENBQWxCO0FBQ0EsTUFBTUMsV0FBVyxHQUFHLENBQUMsWUFBRCxFQUFlLFNBQWYsRUFBMEIsY0FBMUIsRUFBMEMsZUFBMUMsQ0FBcEI7QUFDQSxNQUFNQyxXQUFXLEdBQUcsQ0FDbEIsY0FEa0IsRUFFbEIsZUFGa0IsRUFHbEIsU0FIa0IsRUFJbEIsUUFKa0IsRUFLbEIsVUFMa0IsRUFNbEIsT0FOa0IsRUFPbEIsZUFQa0IsRUFRbEIsU0FSa0IsRUFTbEIsZUFUa0IsRUFVbEIsYUFWa0IsRUFXbEIsUUFYa0IsRUFZbEJDLE1BWmtCLENBWVhGLFdBWlcsQ0FBcEI7O0FBY0EsTUFBTUcsb0JBQW9CLEdBQUdqRSxJQUFJLElBQUk7QUFDbkMsU0FBT2tFLFlBQVksSUFBSTtBQUNyQixVQUFNQyxZQUFZLEdBQUduRSxJQUFJLENBQUNvRSxXQUFMLENBQWlCbkIsSUFBakIsQ0FBc0JvQixDQUFDLElBQUlBLENBQUMsQ0FBQ2xLLEdBQUYsS0FBVStKLFlBQXJDLENBQXJCOztBQUNBLFFBQUksQ0FBQ0MsWUFBTCxFQUFtQjtBQUNqQjdKLFNBQUcsQ0FBQ2tILElBQUosQ0FBUywyQ0FBVCxFQUFzRDBDLFlBQXREO0FBQ0E7QUFDRDs7QUFDRCxVQUFNOUYsSUFBSSxHQUFHdUYsV0FBVyxDQUFDekosT0FBWixDQUFvQjtBQUFFTCxVQUFJLEVBQUVzSyxZQUFZLENBQUN0SztBQUFyQixLQUFwQixDQUFiOztBQUNBLFFBQUksQ0FBQ3VFLElBQUwsRUFBVztBQUNUOUQsU0FBRyxDQUFDa0gsSUFBSixDQUFTLG9EQUFUO0FBQ0E7QUFDRDs7QUFFRCxXQUFPcEQsSUFBSSxDQUFDakUsR0FBWjtBQUNELEdBYkQ7QUFjRCxDQWZEOztBQWlCQSxNQUFNbUssc0JBQXNCLEdBQUd0RSxJQUFJLElBQUk7QUFDckMsU0FBT3VFLFFBQVEsSUFBSTtBQUNqQixVQUFNQyxjQUFjLEdBQUd4RSxJQUFJLENBQUN5RSxPQUFMLENBQWF4QixJQUFiLENBQWtCb0IsQ0FBQyxJQUFJQSxDQUFDLENBQUNsSyxHQUFGLEtBQVVvSyxRQUFqQyxDQUF2Qjs7QUFDQSxRQUFJLENBQUNDLGNBQUwsRUFBcUI7QUFDbkJsSyxTQUFHLENBQUNrSCxJQUFKLENBQVMsMERBQVQ7QUFDQTtBQUNEOztBQUNELFVBQU07QUFBRXdCLFdBQUY7QUFBU2tCLGtCQUFZLEVBQUVRO0FBQXZCLFFBQWdERixjQUF0RDtBQUVBLFVBQU1OLFlBQVksR0FBR0Qsb0JBQW9CLENBQUNqRSxJQUFELENBQXBCLENBQTJCMEUsb0JBQTNCLENBQXJCOztBQUNBLFFBQUksQ0FBQ1IsWUFBTCxFQUFtQjtBQUNqQjVKLFNBQUcsQ0FBQ2tILElBQUosQ0FBUyxnQ0FBVDtBQUNBO0FBQ0Q7O0FBQ0QsVUFBTW1ELE1BQU0sR0FBRzNILE9BQU8sQ0FBQzlDLE9BQVIsQ0FBZ0I7QUFBRThJLFdBQUY7QUFBU2tCO0FBQVQsS0FBaEIsQ0FBZjs7QUFDQSxRQUFJLENBQUNTLE1BQUwsRUFBYTtBQUNYckssU0FBRyxDQUFDa0gsSUFBSixDQUFTLGlEQUFUO0FBQ0E7QUFDRDs7QUFFRCxXQUFPbUQsTUFBTSxDQUFDeEssR0FBZDtBQUNELEdBcEJEO0FBcUJELENBdEJEOztBQXdCQSxNQUFNeUssY0FBYyxHQUFHLENBQUM1RixVQUFELEVBQWE2RixrQkFBYixLQUNyQixDQUFDLENBQUM3RixVQUFGLEtBQWlCLENBQUMsQ0FBQzZGLGtCQUFuQixHQUNJLElBREosR0FFSTdGLFVBQVUsR0FDVjtBQUFFOEYsTUFBSSxFQUFFO0FBQUU5RixjQUFVLEVBQUUsSUFBSUMsSUFBSjtBQUFkO0FBQVIsQ0FEVSxHQUVWO0FBQUU4RixRQUFNLEVBQUU7QUFBRS9GLGNBQVUsRUFBRSxJQUFkO0FBQW9CTixnQkFBWSxFQUFFO0FBQWxDO0FBQVYsQ0FMTjs7QUFPQXFDLE1BQU0sQ0FBQ2lFLE9BQVAsQ0FBZTtBQUNiQywwQkFBd0IsT0FBVztBQUFBLFFBQVY7QUFBRUM7QUFBRixLQUFVO0FBQ2pDNUssT0FBRyxDQUFDWCxLQUFKLENBQVUsa0JBQVY7QUFDQSxVQUFNcUcsSUFBSSxHQUFHMEQsSUFBSSxDQUFDeUIsUUFBTCxDQUFjRCxJQUFkLENBQWI7QUFDQSxVQUFNRSxtQkFBbUIsR0FBR25CLG9CQUFvQixDQUFDakUsSUFBRCxDQUFoRDtBQUNBLFVBQU1xRixlQUFlLEdBQUdmLHNCQUFzQixDQUFDdEUsSUFBRCxDQUE5QztBQUVBLEtBQUNBLElBQUksQ0FBQ29FLFdBQUwsSUFBb0IsRUFBckIsRUFBeUIxSSxPQUF6QixDQUFpQzRKLENBQUMsSUFBSTtBQUNwQyxZQUFNO0FBQUV0RyxrQkFBRjtBQUFjbkY7QUFBZCxVQUF1QnlMLENBQTdCO0FBQ0EsWUFBTUMsTUFBTSxHQUFHNUIsV0FBVyxDQUFDekosT0FBWixDQUFvQjtBQUFFTDtBQUFGLE9BQXBCLENBQWY7O0FBQ0EsVUFBSTBMLE1BQUosRUFBWTtBQUNWakwsV0FBRyxDQUFDWCxLQUFKLENBQVUsb0JBQVY7QUFDQSxjQUFNNkwsS0FBSyxHQUFHWixjQUFjLENBQUM1RixVQUFELEVBQWF1RyxNQUFNLENBQUN2RyxVQUFwQixDQUE1Qjs7QUFDQSxZQUFJd0csS0FBSixFQUFXO0FBQ1Q3QixxQkFBVyxDQUFDOEIsTUFBWixDQUFtQkYsTUFBTSxDQUFDcEwsR0FBMUIsRUFBK0JxTCxLQUEvQjtBQUNEOztBQUNEO0FBQ0Q7O0FBQ0RsTCxTQUFHLENBQUNYLEtBQUosQ0FBVSxpQkFBVjtBQUNBZ0ssaUJBQVcsQ0FBQytCLE1BQVosQ0FBbUJKLENBQW5CO0FBQ0QsS0FiRDtBQWVBLEtBQUN0RixJQUFJLENBQUN5RSxPQUFMLElBQWdCLEVBQWpCLEVBQXFCL0ksT0FBckIsQ0FBNkI0SixDQUFDLElBQUk7QUFDaEMsWUFBTTtBQUFFcEIsb0JBQVksRUFBRVEsb0JBQWhCO0FBQXNDMUI7QUFBdEMsVUFBZ0RzQyxDQUF0RDtBQUNBLFlBQU1wQixZQUFZLEdBQUdrQixtQkFBbUIsQ0FBQ1Ysb0JBQUQsQ0FBeEM7O0FBQ0EsVUFBSSxDQUFDUixZQUFMLEVBQW1CO0FBQ2pCNUosV0FBRyxDQUFDWCxLQUFKLENBQVUsaUNBQVY7QUFDQTtBQUNEOztBQUNELFlBQU00TCxNQUFNLEdBQUd2SSxPQUFPLENBQUM5QyxPQUFSLENBQWdCO0FBQUVnSyxvQkFBRjtBQUFnQmxCO0FBQWhCLE9BQWhCLENBQWY7O0FBQ0EsVUFBSXVDLE1BQUosRUFBWTtBQUNWakwsV0FBRyxDQUFDWCxLQUFKLENBQVUsZ0JBQVY7QUFDQTtBQUNEOztBQUNELFlBQU1nTSxNQUFNLHFCQUFRTCxDQUFSO0FBQVdwQjtBQUFYLFFBQVo7O0FBQ0E1SixTQUFHLENBQUNYLEtBQUosQ0FBVSxhQUFWLEVBQXlCZ00sTUFBekI7QUFDQTNJLGFBQU8sQ0FBQzBJLE1BQVIsQ0FBZUMsTUFBZjtBQUNELEtBZkQ7QUFpQkEsS0FBQzNGLElBQUksQ0FBQzRGLFVBQUwsSUFBbUIsRUFBcEIsRUFBd0JsSyxPQUF4QixDQUFnQzJJLENBQUMsSUFBSTtBQUNuQyxZQUFNO0FBQUVyRixrQkFBRjtBQUFjNkcsaUJBQVMsRUFBRUM7QUFBekIsVUFBK0N6QixDQUFyRDtBQUNBLFlBQU13QixTQUFTLEdBQUdDLGlCQUFpQixDQUFDQyxHQUFsQixDQUFzQlYsZUFBdEIsQ0FBbEI7O0FBQ0EsVUFBSVcsQ0FBQyxDQUFDQyxPQUFGLENBQVVKLFNBQVYsRUFBcUJLLE1BQXJCLEtBQWdDSixpQkFBaUIsQ0FBQ0ksTUFBdEQsRUFBOEQ7QUFDNUQ1TCxXQUFHLENBQUNYLEtBQUosQ0FBVSw2QkFBVjtBQUNBO0FBQ0Q7O0FBQ0QsWUFBTTRMLE1BQU0sR0FBRzlILFVBQVUsQ0FBQ3ZELE9BQVgsQ0FBbUI7QUFBRTJMO0FBQUYsT0FBbkIsQ0FBZjs7QUFDQSxVQUFJTixNQUFKLEVBQVk7QUFDVmpMLFdBQUcsQ0FBQ1gsS0FBSixDQUFVLG1CQUFWO0FBQ0EsY0FBTTZMLEtBQUssR0FBR1osY0FBYyxDQUFDNUYsVUFBRCxFQUFhdUcsTUFBTSxDQUFDdkcsVUFBcEIsQ0FBNUI7O0FBQ0EsWUFBSXdHLEtBQUosRUFBVztBQUNUL0gsb0JBQVUsQ0FBQ2dJLE1BQVgsQ0FBa0JGLE1BQU0sQ0FBQ3BMLEdBQXpCLEVBQThCcUwsS0FBOUI7QUFDRDs7QUFDRDtBQUNEOztBQUNELFlBQU1HLE1BQU0scUJBQVF0QixDQUFSO0FBQVd3QjtBQUFYLFFBQVo7O0FBQ0F2TCxTQUFHLENBQUNYLEtBQUosQ0FBVSxnQkFBVixFQUE0QmdNLE1BQTVCO0FBQ0FsSSxnQkFBVSxDQUFDaUksTUFBWCxDQUFrQkMsTUFBbEI7QUFDRCxLQW5CRDtBQXFCQSxLQUFDM0YsSUFBSSxDQUFDbUcsWUFBTCxJQUFxQixFQUF0QixFQUEwQnpLLE9BQTFCLENBQWtDMEssQ0FBQyxJQUFJO0FBQ3JDLFlBQU1aLEtBQUssR0FBR1EsQ0FBQyxDQUFDSyxJQUFGLENBQ1pELENBRFksRUFFWixhQUZZLEVBR1osa0JBSFksRUFJWixpQkFKWSxFQUtaLGFBTFksRUFNWixhQU5ZLENBQWQ7O0FBUUEsWUFBTWIsTUFBTSxHQUFHckksWUFBWSxDQUFDaEQsT0FBYixDQUFxQnNMLEtBQXJCLENBQWY7O0FBQ0EsVUFBSUQsTUFBSixFQUFZO0FBQ1ZqTCxXQUFHLENBQUNYLEtBQUosQ0FBVSxxQkFBVjtBQUNBLGNBQU02TCxLQUFLLEdBQUdaLGNBQWMsQ0FBQ3dCLENBQUMsQ0FBQ3BILFVBQUgsRUFBZXVHLE1BQU0sQ0FBQ3ZHLFVBQXRCLENBQTVCOztBQUNBLFlBQUl3RyxLQUFKLEVBQVc7QUFDVHRJLHNCQUFZLENBQUN1SSxNQUFiLENBQW9CRixNQUFNLENBQUNwTCxHQUEzQixFQUFnQ3FMLEtBQWhDO0FBQ0Q7O0FBQ0Q7QUFDRDs7QUFDRGxMLFNBQUcsQ0FBQ1gsS0FBSixDQUFVLGtCQUFWO0FBQ0F1RCxrQkFBWSxDQUFDd0ksTUFBYixDQUFvQlUsQ0FBcEI7QUFDRCxLQXBCRDtBQXNCQTlMLE9BQUcsQ0FBQ1gsS0FBSixDQUFVLGNBQVY7QUFDRCxHQW5GWTs7QUFxRmIyTSwwQkFBd0IsR0FBRztBQUN6QixRQUFJLENBQUMsS0FBS3hILE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdkQsS0FBSixDQUFVLGNBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU1nTCxHQUFHLEdBQUc7QUFDVlgsZ0JBQVUsRUFBRSxFQURGO0FBRVZ4QixpQkFBVyxFQUFFLEVBRkg7QUFHVkssYUFBTyxFQUFFLEVBSEM7QUFJVjBCLGtCQUFZLEVBQUU7QUFKSixLQUFaO0FBT0EsVUFBTVAsVUFBVSxHQUFHbkksVUFBVSxDQUFDd0YsSUFBWCxHQUFrQnVELEtBQWxCLEVBQW5CO0FBQ0FaLGNBQVUsQ0FBQ2xLLE9BQVgsQ0FBbUIySSxDQUFDLElBQ2xCa0MsR0FBRyxDQUFDWCxVQUFKLENBQWVhLElBQWYsQ0FBb0JULENBQUMsQ0FBQ0ssSUFBRixDQUFPaEMsQ0FBUCxFQUFVLE1BQVYsRUFBa0IsV0FBbEIsRUFBK0IsWUFBL0IsQ0FBcEIsQ0FERjtBQUlBLFVBQU1ELFdBQVcsR0FBR1QsV0FBVyxDQUFDVixJQUFaLEdBQW1CdUQsS0FBbkIsRUFBcEI7QUFDQXBDLGVBQVcsQ0FBQzFJLE9BQVosQ0FBb0IySSxDQUFDLElBQ25Ca0MsR0FBRyxDQUFDbkMsV0FBSixDQUFnQnFDLElBQWhCLENBQ0VULENBQUMsQ0FBQ0ssSUFBRixDQUNFaEMsQ0FERixFQUVFLEtBRkYsRUFHRSxNQUhGLEVBSUUsYUFKRixFQUtFLFVBTEYsRUFNRSxNQU5GLEVBT0UsS0FQRixFQVFFLEtBUkYsRUFTRSxZQVRGLENBREYsQ0FERjtBQWdCQSxVQUFNSSxPQUFPLEdBQUd6SCxPQUFPLENBQUNpRyxJQUFSLEdBQWV1RCxLQUFmLEVBQWhCO0FBQ0EvQixXQUFPLENBQUMvSSxPQUFSLENBQWdCNEosQ0FBQyxJQUNmaUIsR0FBRyxDQUFDOUIsT0FBSixDQUFZZ0MsSUFBWixDQUNFVCxDQUFDLENBQUNLLElBQUYsQ0FBT2YsQ0FBUCxFQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUIsT0FBekIsRUFBa0MsY0FBbEMsRUFBa0QsWUFBbEQsQ0FERixDQURGO0FBTUEsVUFBTWEsWUFBWSxHQUFHakosWUFBWSxDQUFDK0YsSUFBYixHQUFvQnVELEtBQXBCLEVBQXJCO0FBQ0FMLGdCQUFZLENBQUN6SyxPQUFiLENBQXFCMEssQ0FBQyxJQUNwQkcsR0FBRyxDQUFDSixZQUFKLENBQWlCTSxJQUFqQixDQUNFVCxDQUFDLENBQUNLLElBQUYsQ0FDRUQsQ0FERixFQUVFLE1BRkYsRUFHRSxhQUhGLEVBSUUsa0JBSkYsRUFLRSxpQkFMRixFQU1FLGFBTkYsRUFPRSxhQVBGLEVBUUUsVUFSRixFQVNFLGNBVEYsRUFVRSxZQVZGLENBREYsQ0FERjtBQWlCQSxXQUFPMUMsSUFBSSxDQUFDZ0QsUUFBTCxDQUFjSCxHQUFkLENBQVA7QUFDRDs7QUFqSlksQ0FBZjs7QUFvSkEsSUFBSXhGLE1BQU0sQ0FBQzRGLGFBQVAsSUFBd0I1RixNQUFNLENBQUM2RixRQUFQLENBQWdCQyxNQUFoQixDQUF1QkMsbUJBQW5ELEVBQXdFO0FBQ3RFL0YsUUFBTSxDQUFDaUUsT0FBUCxDQUFlO0FBQ2IrQixnQkFBWSxDQUFDQyxPQUFELEVBQVU7QUFDcEIsVUFBSSxDQUFDLEtBQUtsSSxNQUFWLEVBQWtCO0FBQ2hCLGNBQU0sSUFBSXZELEtBQUosQ0FBVSxjQUFWLENBQU47QUFDRDs7QUFFRCxVQUFJd0YsTUFBTSxDQUFDa0csUUFBWCxFQUFxQjtBQUNuQjtBQUNEOztBQUVELFlBQU1DLE1BQU0sR0FBR0MsY0FBYyxDQUFDQyw2QkFBZixFQUFmO0FBQ0EsWUFBTUMsRUFBRSxHQUFHSCxNQUFNLENBQUNJLEtBQVAsQ0FBYUQsRUFBeEI7QUFFQUEsUUFBRSxDQUFDRSxlQUFILEdBQXFCQyxPQUFyQixDQUNFekcsTUFBTSxDQUFDMEcsZUFBUCxDQUF1QixDQUFDak4sR0FBRCxFQUFNa04sS0FBTixLQUFnQjtBQUNyQyxZQUFJbE4sR0FBSixFQUFTO0FBQ1BILGlCQUFPLENBQUNJLEtBQVIsQ0FBY0QsR0FBZDtBQUNBO0FBQ0Q7O0FBQ0RrTixhQUFLLEdBQUcxQixDQUFDLENBQUMyQixNQUFGLENBQVNELEtBQVQsRUFBZ0JFLENBQUMsSUFBS0EsQ0FBQyxDQUFDL04sSUFBRixLQUFXLFNBQVgsR0FBdUIsQ0FBdkIsR0FBMkIsQ0FBakQsQ0FBUjtBQUNBNk4sYUFBSyxDQUFDaE0sT0FBTixDQUFjNEcsVUFBVSxJQUFJO0FBQzFCLGNBQUksQ0FBQ3lCLFdBQVcsQ0FBQzhELFFBQVosQ0FBcUJ2RixVQUFVLENBQUN6SSxJQUFoQyxDQUFMLEVBQTRDO0FBQzFDO0FBQ0Q7O0FBQ0QsY0FBSW1OLE9BQU8sSUFBSWxELFdBQVcsQ0FBQytELFFBQVosQ0FBcUJ2RixVQUFVLENBQUN6SSxJQUFoQyxDQUFmLEVBQXNEO0FBQ3BEO0FBQ0Q7O0FBQ0QsZ0JBQU15RyxJQUFJLEdBQUc0RyxNQUFNLENBQUNZLElBQVAsQ0FBWXhGLFVBQVUsQ0FBQ3pJLElBQXZCLENBQWI7QUFDQXlHLGNBQUksQ0FBQ3lCLGFBQUwsR0FBcUJnRyxJQUFyQjtBQUNELFNBVEQ7QUFXQVYsVUFBRSxDQUFDRSxlQUFILEdBQXFCQyxPQUFyQixDQUNFekcsTUFBTSxDQUFDMEcsZUFBUCxDQUF1QixDQUFDak4sR0FBRCxFQUFNa04sS0FBTixLQUFnQjtBQUNyQyxjQUFJbE4sR0FBSixFQUFTO0FBQ1BILG1CQUFPLENBQUNJLEtBQVIsQ0FBY0QsR0FBZDtBQUNBO0FBQ0Q7O0FBRURGLGFBQUcsQ0FBQ1gsS0FBSixDQUFVLFVBQVY7QUFDQStOLGVBQUssQ0FBQ2hNLE9BQU4sQ0FBYzRHLFVBQVUsSUFBSTtBQUMxQixnQkFBSTBGLEtBQUssR0FBRyxFQUFaOztBQUNBLGdCQUFJbkUsU0FBUyxDQUFDZ0UsUUFBVixDQUFtQnZGLFVBQVUsQ0FBQ3pJLElBQTlCLENBQUosRUFBeUM7QUFDdkNtTyxtQkFBSyxHQUFHLDhCQUFSO0FBQ0Q7O0FBQ0QxTixlQUFHLENBQUNYLEtBQUosQ0FBVSxRQUFRMkksVUFBVSxDQUFDekksSUFBN0IsRUFBbUNtTyxLQUFuQztBQUNELFdBTkQ7QUFRQTFOLGFBQUcsQ0FBQ1gsS0FBSixDQUFVLFlBQVY7QUFFQWlLLG1CQUFTO0FBQ1YsU0FsQkQsQ0FERjtBQXFCRCxPQXRDRCxDQURGO0FBeUNEOztBQXREWSxHQUFmO0FBd0REOztBQUVEN0MsTUFBTSxDQUFDQyxPQUFQLENBQWUsTUFBTSxDQUFFLENBQXZCLEU7Ozs7Ozs7Ozs7O0FDMVJBbkksTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2lFLFNBQU8sRUFBQyxNQUFJQSxPQUFiO0FBQXFCa0wsZUFBYSxFQUFDLE1BQUlBLGFBQXZDO0FBQXFEQyxpQkFBZSxFQUFDLE1BQUlBO0FBQXpFLENBQWQ7QUFBeUcsSUFBSWpQLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJZ1AsWUFBSjtBQUFpQnRQLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNtUCxjQUFZLENBQUNoUCxDQUFELEVBQUc7QUFBQ2dQLGdCQUFZLEdBQUNoUCxDQUFiO0FBQWU7O0FBQWhDLENBQTlCLEVBQWdFLENBQWhFO0FBQW1FLElBQUl3RSxjQUFKLEVBQW1CRSxlQUFuQixFQUFtQ0ksWUFBbkMsRUFBZ0RMLGVBQWhEO0FBQWdFL0UsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQzJFLGdCQUFjLENBQUN4RSxDQUFELEVBQUc7QUFBQ3dFLGtCQUFjLEdBQUN4RSxDQUFmO0FBQWlCLEdBQXBDOztBQUFxQzBFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQixHQUExRTs7QUFBMkU4RSxjQUFZLENBQUM5RSxDQUFELEVBQUc7QUFBQzhFLGdCQUFZLEdBQUM5RSxDQUFiO0FBQWUsR0FBMUc7O0FBQTJHeUUsaUJBQWUsQ0FBQ3pFLENBQUQsRUFBRztBQUFDeUUsbUJBQWUsR0FBQ3pFLENBQWhCO0FBQWtCOztBQUFoSixDQUFqQyxFQUFtTCxDQUFuTDtBQUFzTCxJQUFJc0UsVUFBSjtBQUFlNUUsTUFBTSxDQUFDRyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUF2QyxFQUFxRSxDQUFyRTtBQUF3RSxJQUFJaVAsT0FBSjtBQUFZdlAsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ29QLFNBQU8sQ0FBQ2pQLENBQUQsRUFBRztBQUFDaVAsV0FBTyxHQUFDalAsQ0FBUjtBQUFVOztBQUF0QixDQUFqQyxFQUF5RCxDQUF6RDs7QUFZbG1CLE1BQU1rUCxpQkFBTixTQUFnQ0MsS0FBSyxDQUFDQyxVQUF0QyxDQUFpRDtBQUMvQzdDLFFBQU0sQ0FBQzhDLEdBQUQsRUFBTUMsUUFBTixFQUFnQjtBQUNwQkQsT0FBRyxDQUFDbk4sS0FBSixHQUFZK00sT0FBTyxDQUFDTSxHQUFSLENBQVksU0FBWixDQUFaO0FBQ0EsV0FBTyxNQUFNaEQsTUFBTixDQUFhOEMsR0FBYixFQUFrQkMsUUFBbEIsQ0FBUDtBQUNEOztBQUo4Qzs7QUFPMUMsTUFBTTFMLE9BQU8sR0FBRyxJQUFJc0wsaUJBQUosQ0FBc0IsU0FBdEIsQ0FBaEI7QUFFUHRMLE9BQU8sQ0FBQzRMLE9BQVIsQ0FBZ0I7QUFDZEMsV0FBUyxHQUFHO0FBQ1YsV0FBTyxLQUFLQyxVQUFMLEtBQW9CLFFBQXBCLEdBQ0gsS0FBS0MsWUFBTCxDQUFrQjVGLEtBRGYsR0FFSCxLQUFLNkYsaUJBQUwsRUFGSjtBQUdELEdBTGE7O0FBT2RBLG1CQUFpQixHQUFHO0FBQ2xCLFdBQU8vQyxDQUFDLENBQUNnRCxNQUFGLENBQ0wsS0FBS0MsY0FBTCxDQUFvQnJELFVBRGYsRUFFTCxDQUFDc0QsR0FBRCxFQUFNN0UsQ0FBTixLQUFZNkUsR0FBRyxHQUFHN0UsQ0FBQyxDQUFDbkIsS0FGZixFQUdMLENBSEssQ0FBUDtBQUtELEdBYmE7O0FBZWRpRyxXQUFTLEdBQUc7QUFDVixVQUFNO0FBQUVOLGdCQUFGO0FBQWNDLGtCQUFkO0FBQTRCRztBQUE1QixRQUErQyxJQUFyRDtBQUNBbE0sV0FBTyxDQUFDMkksTUFBUixDQUFlO0FBQ2JtRCxnQkFEYTtBQUViQyxrQkFGYTtBQUdiRyxvQkFIYTtBQUlicE8sWUFBTSxFQUFFO0FBSkssS0FBZjtBQU1EOztBQXZCYSxDQUFoQjtBQTBCTyxNQUFNb04sYUFBYSxHQUFHLFFBQXRCO0FBRUEsTUFBTUMsZUFBZSxHQUFHO0FBQzdCa0IsUUFBTSxFQUFFLFFBRHFCO0FBRTdCQyxVQUFRLEVBQUU7QUFGbUIsQ0FBeEI7QUFLUHRNLE9BQU8sQ0FBQ21FLE1BQVIsR0FBaUIsSUFBSWpJLFlBQUosQ0FBaUI7QUFDaEM7QUFDQW9DLE9BQUssRUFBRTtBQUNMK0MsUUFBSSxFQUFFbkYsWUFBWSxDQUFDcVE7QUFEZCxHQUZ5QjtBQU1oQ1QsWUFBVSxFQUFFO0FBQ1Z6SyxRQUFJLEVBQUVDLE1BREk7QUFFVjtBQUNBK0IsaUJBQWEsRUFBRSxDQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLFFBQXZCO0FBSEwsR0FOb0I7QUFZaENtSixNQUFJLEVBQUU7QUFDSnJLLFNBQUssRUFBRSxzQ0FESDtBQUVKZCxRQUFJLEVBQUVnQixPQUZGO0FBR0pDLGdCQUFZLEVBQUU7QUFIVixHQVowQjtBQWtCaENtSyxXQUFTLEVBQUU7QUFDVHRLLFNBQUssRUFBRSxpQ0FERTtBQUVUZCxRQUFJLEVBQUVhLElBRkc7QUFHVFgsWUFBUSxFQUFFO0FBSEQsR0FsQnFCO0FBd0JoQ2xFLFlBQVUsRUFBRTtBQUNWOEUsU0FBSyxFQUFFLGtDQURHO0FBRVZkLFFBQUksRUFBRWEsSUFGSTtBQUdWWCxZQUFRLEVBQUU7QUFIQSxHQXhCb0I7QUE4QmhDO0FBQ0F3SyxjQUFZLEVBQUU7QUFDWjFLLFFBQUksRUFBRXpDLE1BRE07QUFFWjJDLFlBQVEsRUFBRSxJQUZFOztBQUdabUwsVUFBTSxHQUFHO0FBQ1AsVUFBSSxDQUFDLEtBQUt6RyxLQUFOLElBQWUsS0FBS3BFLEtBQUwsQ0FBVyxZQUFYLEVBQXlCb0UsS0FBekIsS0FBbUMsUUFBdEQsRUFBZ0U7QUFDOUQsZUFBTyxVQUFQO0FBQ0Q7QUFDRjs7QUFQVyxHQS9Ca0I7QUF3Q2hDLHdCQUFzQjtBQUNwQjVFLFFBQUksRUFBRW5GLFlBQVksQ0FBQ3FRLE9BREM7QUFFcEJJLE9BQUcsRUFBRSxDQUZlO0FBR3BCQyxPQUFHLEVBQUUxQjtBQUhlLEdBeENVO0FBNkNoQyw2QkFBMkI7QUFDekI3SixRQUFJLEVBQUV3QyxLQURtQjtBQUV6QmdKLFlBQVEsRUFBRSxDQUZlOztBQUd6QkMsWUFBUSxHQUFHO0FBQ1QsYUFBT3BNLFVBQVUsQ0FBQ3dGLElBQVgsR0FBa0JDLEtBQWxCLEVBQVA7QUFDRDs7QUFMd0IsR0E3Q0s7QUFvRGhDLCtCQUE2QjtBQUMzQjlFLFFBQUksRUFBRXpDO0FBRHFCLEdBcERHO0FBdURoQyxtQ0FBaUM7QUFDL0J5QyxRQUFJLEVBQUVDLE1BRHlCO0FBRS9CRSxTQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZLLEdBdkREO0FBMkRoQyw2Q0FBMkM7QUFDekNMLFFBQUksRUFBRUMsTUFEbUM7QUFFekNFLFNBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBRmUsR0EzRFg7QUFnRWhDO0FBQ0F3SyxnQkFBYyxFQUFFO0FBQ2Q3SyxRQUFJLEVBQUV6QyxNQURRO0FBRWQyQyxZQUFRLEVBQUUsSUFGSTs7QUFHZG1MLFVBQU0sR0FBRztBQUNQLFVBQUksQ0FBQyxLQUFLekcsS0FBTixJQUFlLEtBQUtwRSxLQUFMLENBQVcsWUFBWCxFQUF5Qm9FLEtBQXpCLEtBQW1DLFVBQXRELEVBQWtFO0FBQ2hFLGVBQU8sVUFBUDtBQUNEO0FBQ0Y7O0FBUGEsR0FqRWdCO0FBMEVoQywrQkFBNkI7QUFDM0I1RSxRQUFJLEVBQUV3QyxLQURxQjtBQUUzQmdKLFlBQVEsRUFBRSxDQUZpQjs7QUFHM0JDLFlBQVEsR0FBRztBQUNULGFBQU9wTSxVQUFVLENBQUN3RixJQUFYLEdBQWtCQyxLQUFsQixFQUFQO0FBQ0Q7O0FBTDBCLEdBMUVHO0FBaUZoQyxpQ0FBK0I7QUFDN0I5RSxRQUFJLEVBQUV6QztBQUR1QixHQWpGQztBQW9GaEMscUNBQW1DO0FBQ2pDeUMsUUFBSSxFQUFFQyxNQUQyQjtBQUVqQ0UsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGTyxHQXBGSDtBQXdGaEMsdUNBQXFDO0FBQ25DTCxRQUFJLEVBQUVuRixZQUFZLENBQUNxUSxPQURnQjtBQUVuQ00sWUFBUSxFQUFFLENBRnlCO0FBR25DQyxZQUFRLEVBQUU1QjtBQUh5QixHQXhGTDtBQTZGaEMsK0NBQTZDO0FBQzNDN0osUUFBSSxFQUFFQyxNQURxQztBQUUzQ0UsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGaUI7QUE3RmIsQ0FBakIsQ0FBakI7O0FBbUdBLElBQUlzQyxNQUFNLENBQUM0RixhQUFQLElBQXdCNUYsTUFBTSxDQUFDNkYsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJpRCxtQkFBbkQsRUFBd0U7QUFDdEUvTSxTQUFPLENBQUNtRSxNQUFSLENBQWU2SSxNQUFmLENBQXNCbk0sZUFBdEI7QUFDRDs7QUFFRGIsT0FBTyxDQUFDbUUsTUFBUixDQUFlNkksTUFBZixDQUFzQjVCLFlBQXRCO0FBQ0FwTCxPQUFPLENBQUNtRSxNQUFSLENBQWU2SSxNQUFmLENBQXNCbE0sZUFBdEI7QUFDQWQsT0FBTyxDQUFDbUUsTUFBUixDQUFlNkksTUFBZixDQUFzQnBNLGNBQXRCO0FBQ0FaLE9BQU8sQ0FBQ21FLE1BQVIsQ0FBZTZJLE1BQWYsQ0FBc0I5TCxZQUFZLENBQUMsT0FBRCxDQUFsQztBQUNBbEIsT0FBTyxDQUFDbUUsTUFBUixDQUFlNkksTUFBZixDQUFzQjlMLFlBQVksQ0FBQyxhQUFELENBQWxDO0FBQ0FsQixPQUFPLENBQUNpTixZQUFSLENBQXFCak4sT0FBTyxDQUFDbUUsTUFBN0IsRTs7Ozs7Ozs7Ozs7QUNsS0EsSUFBSW5JLE1BQUo7QUFBV0YsTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRCxRQUFNLENBQUNJLENBQUQsRUFBRztBQUFDSixVQUFNLEdBQUNJLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0IsRUFBaUQsQ0FBakQ7QUFBb0QsSUFBSThELFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQTNDLEVBQTJFLENBQTNFO0FBQThFLElBQUk4USx3QkFBSjtBQUE2QnBSLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNpUiwwQkFBd0IsQ0FBQzlRLENBQUQsRUFBRztBQUFDOFEsNEJBQXdCLEdBQUM5USxDQUF6QjtBQUEyQjs7QUFBeEQsQ0FBOUIsRUFBd0YsQ0FBeEY7QUFBMkYsSUFBSU8sS0FBSjtBQUFVYixNQUFNLENBQUNHLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDVSxPQUFLLENBQUNQLENBQUQsRUFBRztBQUFDTyxTQUFLLEdBQUNQLENBQU47QUFBUTs7QUFBbEIsQ0FBN0IsRUFBaUQsQ0FBakQ7QUFBb0QsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSXNFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUN5RSxZQUFVLENBQUN0RSxDQUFELEVBQUc7QUFBQ3NFLGNBQVUsR0FBQ3RFLENBQVg7QUFBYTs7QUFBNUIsQ0FBdkMsRUFBcUUsQ0FBckU7QUFBd0UsSUFBSTRELE9BQUo7QUFBWWxFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFdBQVosRUFBd0I7QUFBQytELFNBQU8sQ0FBQzVELENBQUQsRUFBRztBQUFDNEQsV0FBTyxHQUFDNUQsQ0FBUjtBQUFVOztBQUF0QixDQUF4QixFQUFnRCxDQUFoRDtBQVFqZ0I7QUFDQTRELE9BQU8sQ0FBQ21OLEtBQVIsQ0FBY3hFLE1BQWQsQ0FBcUIsVUFBUzVHLE1BQVQsRUFBaUJxTCxLQUFqQixFQUF3QjtBQUMzQyxNQUFJQyxXQUFXLEdBQUcsRUFBbEI7O0FBQ0EsVUFBUUQsS0FBSyxDQUFDdEIsVUFBZDtBQUNFLFNBQUssUUFBTDtBQUNFN0MsT0FBQyxDQUFDcUUsS0FBRixDQUFRRixLQUFLLENBQUNyQixZQUFOLENBQW1CNUYsS0FBM0IsRUFBa0M3SCxLQUFLLElBQUk7QUFDekMsY0FBTWlQLFNBQVMsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWNMLEtBQUssQ0FBQ3JCLFlBQU4sQ0FBbUJsRCxVQUFqQyxDQUFsQjtBQUNBLGNBQU07QUFBRXpMLGFBQUcsRUFBRXNRLFdBQVA7QUFBb0JDO0FBQXBCLFlBQXNDSixTQUE1QztBQUNBRixtQkFBVyxDQUFDM0QsSUFBWixDQUFpQjtBQUNmZ0UscUJBRGU7QUFFZkMsdUJBRmU7QUFHZnJQO0FBSGUsU0FBakI7QUFLRCxPQVJEOztBQVNBOztBQUNGLFNBQUssVUFBTDtBQUNFOE8sV0FBSyxDQUFDbEIsY0FBTixDQUFxQnJELFVBQXJCLENBQWdDbEssT0FBaEMsQ0FDRSxVQUFtQztBQUFBLFlBQWxDO0FBQUV3SCxlQUFGO0FBQVMvSSxhQUFUO0FBQWN1UTtBQUFkLFNBQWtDOztBQUNqQzFFLFNBQUMsQ0FBQ3FFLEtBQUYsQ0FBUW5ILEtBQVIsRUFBZSxNQUFNO0FBQ25Ca0gscUJBQVcsQ0FBQzNELElBQVosQ0FBaUI7QUFBRWdFLHVCQUFXLEVBQUV0USxHQUFmO0FBQW9CdVE7QUFBcEIsV0FBakI7QUFDRCxTQUZEO0FBR0QsT0FMSDtBQVFBTixpQkFBVyxHQUFHcEUsQ0FBQyxDQUFDMkUsT0FBRixDQUFVUCxXQUFWLENBQWQ7QUFDQUEsaUJBQVcsQ0FBQzFPLE9BQVosQ0FBb0IsQ0FBQzBLLENBQUQsRUFBSS9LLEtBQUosS0FBYztBQUNoQytLLFNBQUMsQ0FBQy9LLEtBQUYsR0FBVUEsS0FBVjtBQUNELE9BRkQ7QUFHQTs7QUFDRjtBQUNFaEIsYUFBTyxDQUFDSSxLQUFSLENBQWMsd0NBQXdDMFAsS0FBSyxDQUFDdEIsVUFBNUQ7QUFDQTtBQTVCSjs7QUErQkEsUUFBTStCLFlBQVksR0FBR1IsV0FBVyxDQUFDckUsR0FBWixDQUFnQkssQ0FBQyxJQUFJO0FBQ3hDQSxLQUFDLENBQUNqTSxHQUFGLEdBQVFvUSxNQUFNLENBQUNNLEVBQVAsRUFBUjtBQUNBekUsS0FBQyxDQUFDdkwsTUFBRixHQUFXc1AsS0FBSyxDQUFDdFAsTUFBakI7QUFDQXVMLEtBQUMsQ0FBQzBFLE9BQUYsR0FBWVgsS0FBSyxDQUFDaFEsR0FBbEIsQ0FId0MsQ0FLeEM7QUFDQTtBQUNBOztBQUNBLFVBQU00USxZQUFZLEdBQUdoTyxPQUFPLENBQUM3QyxPQUFSLENBQWdCaVEsS0FBSyxDQUFDaFEsR0FBdEIsQ0FBckI7QUFDQWlNLEtBQUMsQ0FBQ2pILFNBQUYsR0FBYzRMLFlBQVksQ0FBQzVMLFNBQTNCO0FBRUEsVUFBTW1MLFNBQVMsR0FBRzdNLFVBQVUsQ0FBQ3ZELE9BQVgsQ0FBbUJrTSxDQUFDLENBQUNxRSxXQUFyQixDQUFsQjtBQUNBckUsS0FBQyxDQUFDNEUsY0FBRixHQUFtQlYsU0FBUyxDQUFDM0YsTUFBVixDQUFpQixhQUFqQixFQUFnQzNCLEtBQW5EO0FBQ0EsVUFBTWlJLGFBQWEsR0FBR1gsU0FBUyxDQUFDM0YsTUFBVixDQUFpQixXQUFqQixDQUF0Qjs7QUFDQSxRQUFJc0csYUFBSixFQUFtQjtBQUNqQixZQUFNQyxTQUFTLEdBQUdELGFBQWEsQ0FBQ2pJLEtBQWhDOztBQUNBLFVBQUlrSSxTQUFTLEdBQUc5RSxDQUFDLENBQUM0RSxjQUFsQixFQUFrQztBQUNoQyxjQUFNLHFEQUFOO0FBQ0Q7O0FBQ0QsVUFBSUUsU0FBUyxLQUFLOUUsQ0FBQyxDQUFDNEUsY0FBcEIsRUFBb0M7QUFDbEM7QUFDQTtBQUNBM1EsZUFBTyxDQUFDQyxHQUFSLENBQVksMENBQVo7QUFDRDs7QUFDRCxZQUFNNlEsUUFBUSxHQUFHcFMsTUFBTSxDQUFDNkMsSUFBUCxJQUFlb0ssQ0FBQyxDQUFDb0YsSUFBRixDQUFPclMsTUFBTSxDQUFDNkMsSUFBZCxDQUFoQzs7QUFDQSxVQUFJLENBQUM3QyxNQUFNLENBQUM2QyxJQUFSLElBQWdCdVAsUUFBUSxDQUFDakYsTUFBVCxLQUFvQixDQUF4QyxFQUEyQztBQUN6QyxjQUFNLHdEQUFOO0FBQ0Q7O0FBRURFLE9BQUMsQ0FBQ2lGLFNBQUYsR0FBYyxFQUFkOztBQUNBckYsT0FBQyxDQUFDcUUsS0FBRixDQUFRYSxTQUFSLEVBQW1CLE1BQU07QUFDdkIsY0FBTXZGLE1BQU0sR0FBRztBQUNia0YsWUFBRSxFQUFFTixNQUFNLENBQUNNLEVBQVAsRUFEUztBQUViUyxxQkFBVyxFQUFFbEYsQ0FBQyxDQUFDak0sR0FGRjtBQUdib1IsaUJBQU8sRUFBRSxJQUFJdE0sSUFBSixFQUhJO0FBSWJsRCxhQUFHLEVBQUVpSyxDQUFDLENBQUMyRSxPQUFGLENBQVVRLFFBQVYsRUFBb0IsQ0FBcEI7QUFKUSxTQUFmO0FBTUE5USxlQUFPLENBQUNtUixJQUFSLENBQWEsZUFBYixFQUE4QjdGLE1BQTlCO0FBQ0EsY0FBTThGLFFBQVEsR0FBR25PLE9BQU8sQ0FBQ29JLE1BQVIsQ0FBZUMsTUFBZixDQUFqQjtBQUNBUyxTQUFDLENBQUNpRixTQUFGLENBQVk1RSxJQUFaLENBQWlCZ0YsUUFBakI7QUFDRCxPQVZEOztBQVdBckYsT0FBQyxDQUFDc0YsZUFBRixHQUFvQnRGLENBQUMsQ0FBQ2lGLFNBQXRCO0FBQ0Q7O0FBRUQsV0FBT3BPLFdBQVcsQ0FBQ3lJLE1BQVosQ0FBbUJVLENBQW5CLENBQVA7QUFDRCxHQTdDb0IsQ0FBckI7QUErQ0FySixTQUFPLENBQUMwSSxNQUFSLENBQWUwRSxLQUFLLENBQUNoUSxHQUFyQixFQUEwQjtBQUFFMkssUUFBSSxFQUFFO0FBQUU4RjtBQUFGO0FBQVIsR0FBMUI7QUFDRCxDQWpGRCxFLENBbUZBOztBQUNBN04sT0FBTyxDQUFDbU4sS0FBUixDQUFjekUsTUFBZCxDQUNFLFVBQVMzRyxNQUFULFNBQTJDNk0sVUFBM0MsRUFBdURDLFFBQXZELEVBQWlFakssT0FBakUsRUFBMEU7QUFBQSxNQUF6RDtBQUFFeEgsT0FBRyxFQUFFMlEsT0FBUDtBQUFnQmpRO0FBQWhCLEdBQXlEOztBQUN4RSxNQUFJLENBQUM4USxVQUFVLENBQUM5RCxRQUFYLENBQW9CLFFBQXBCLENBQUwsRUFBb0M7QUFDbEM7QUFDRDs7QUFFRCxHQUFDbk8sS0FBRCxFQUFRdUQsV0FBUixFQUFxQnZCLE9BQXJCLENBQTZCNEUsSUFBSSxJQUFJO0FBQ25DQSxRQUFJLENBQUNtRixNQUFMLENBQ0U7QUFDRXFGLGFBREY7QUFFRWpRLFlBQU0sRUFBRTtBQUFFZ1IsWUFBSSxFQUFFLENBQUMsVUFBRCxFQUFhLFdBQWIsRUFBMEIsUUFBMUIsRUFBb0MsUUFBcEM7QUFBUjtBQUZWLEtBREYsRUFLRTtBQUFFL0csVUFBSSxFQUFFO0FBQUVqSztBQUFGO0FBQVIsS0FMRixFQU1FO0FBQUVpUixXQUFLLEVBQUU7QUFBVCxLQU5GO0FBUUQsR0FURDs7QUFXQSxNQUFJalIsTUFBTSxLQUFLLFdBQWYsRUFBNEI7QUFDMUI7QUFDRDs7QUFFRCxRQUFNa1IsS0FBSyxHQUFHclMsS0FBSyxDQUFDdUosSUFBTixDQUFXO0FBQUU2SDtBQUFGLEdBQVgsRUFBd0J0RSxLQUF4QixFQUFkOztBQUNBLFFBQU13RixVQUFVLEdBQUdoRyxDQUFDLENBQUNpRyxPQUFGLENBQVVqRyxDQUFDLENBQUNrRyxLQUFGLENBQVFILEtBQVIsRUFBZSxXQUFmLENBQVYsQ0FBbkI7O0FBRUF6TyxTQUFPLENBQUNtSSxNQUFSLENBQ0U7QUFBRXRMLE9BQUcsRUFBRTtBQUFFZ1MsU0FBRyxFQUFFSDtBQUFQLEtBQVA7QUFBNEJJLFVBQU0sRUFBRTtBQUFFQyxhQUFPLEVBQUU7QUFBWDtBQUFwQyxHQURGLEVBRUU7QUFBRXZILFFBQUksRUFBRTtBQUFFd0gsZ0JBQVUsRUFBRSxlQUFkO0FBQStCRixZQUFNLEVBQUUsSUFBSW5OLElBQUo7QUFBdkM7QUFBUixHQUZGLEVBR0U7QUFBRTZNLFNBQUssRUFBRTtBQUFULEdBSEY7QUFNQSxRQUFNMUIsV0FBVyxHQUFHbk4sV0FBVyxDQUFDZ0csSUFBWixDQUFpQjtBQUNuQzZILFdBRG1DO0FBRW5DblEsVUFBTSxFQUFFO0FBQUUwUixhQUFPLEVBQUU7QUFBWDtBQUYyQixHQUFqQixFQUdqQjdGLEtBSGlCLEVBQXBCOztBQUtBLE1BQUk0RCxXQUFXLENBQUNsRSxNQUFaLEtBQXVCLENBQTNCLEVBQThCO0FBQzVCO0FBQ0Q7O0FBRUQsUUFBTXFHLFdBQVcsR0FBR3ZHLENBQUMsQ0FBQ2lHLE9BQUYsQ0FBVWpHLENBQUMsQ0FBQ2tHLEtBQUYsQ0FBUTlCLFdBQVIsRUFBcUIsaUJBQXJCLENBQVYsQ0FBcEI7O0FBQ0EsUUFBTW9DLE9BQU8sR0FBR2xQLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYTtBQUMzQjlJLE9BQUcsRUFBRTtBQUFFZ1MsU0FBRyxFQUFFSTtBQUFQLEtBRHNCO0FBRTNCSCxVQUFNLEVBQUU7QUFBRUMsYUFBTyxFQUFFO0FBQVg7QUFGbUIsR0FBYixFQUdiN0YsS0FIYSxFQUFoQjs7QUFLQSxRQUFNNkUsU0FBUyxHQUFHckYsQ0FBQyxDQUFDa0csS0FBRixDQUFRTSxPQUFSLEVBQWlCLEtBQWpCLENBQWxCOztBQUVBdkMsMEJBQXdCLENBQUNvQixTQUFELEVBQVlQLE9BQVosRUFBcUJWLFdBQVcsQ0FBQyxDQUFELENBQWhDLENBQXhCO0FBQ0QsQ0FoREgsRUFpREU7QUFBRXFDLGVBQWEsRUFBRTtBQUFqQixDQWpERixFOzs7Ozs7Ozs7OztBQzdGQTVULE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM0VCxhQUFXLEVBQUMsTUFBSUEsV0FBakI7QUFBNkJDLGdCQUFjLEVBQUMsTUFBSUEsY0FBaEQ7QUFBK0RDLGFBQVcsRUFBQyxNQUFJQSxXQUEvRTtBQUEyRkMsbUJBQWlCLEVBQUMsTUFBSUE7QUFBakgsQ0FBZDtBQUFtSixJQUFJNVQsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkyVCxlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSTRELE9BQUo7QUFBWWxFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFdBQVosRUFBd0I7QUFBQytELFNBQU8sQ0FBQzVELENBQUQsRUFBRztBQUFDNEQsV0FBTyxHQUFDNUQsQ0FBUjtBQUFVOztBQUF0QixDQUF4QixFQUFnRCxDQUFoRDtBQUFtRCxJQUFJOEQsV0FBSjtBQUFnQnBFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNpRSxhQUFXLENBQUM5RCxDQUFELEVBQUc7QUFBQzhELGVBQVcsR0FBQzlELENBQVo7QUFBYzs7QUFBOUIsQ0FBOUMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSU8sS0FBSjtBQUFVYixNQUFNLENBQUNHLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDVSxPQUFLLENBQUNQLENBQUQsRUFBRztBQUFDTyxTQUFLLEdBQUNQLENBQU47QUFBUTs7QUFBbEIsQ0FBaEMsRUFBb0QsQ0FBcEQ7QUFBdUQsSUFBSXVFLFFBQUo7QUFBYTdFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUMwRSxVQUFRLENBQUN2RSxDQUFELEVBQUc7QUFBQ3VFLFlBQVEsR0FBQ3ZFLENBQVQ7QUFBVzs7QUFBeEIsQ0FBakMsRUFBMkQsQ0FBM0Q7QUFRL2lCLE1BQU11VCxXQUFXLEdBQUcsSUFBSUksZUFBSixDQUFvQjtBQUM3Q2pULE1BQUksRUFBRSx3QkFEdUM7QUFHN0NrVCxVQUFRLEVBQUVoUSxPQUFPLENBQUNtRSxNQUFSLENBQ1A4TCxJQURPLENBRU4sU0FGTSxFQUdOLGNBSE0sRUFJTixRQUpNLEVBS04sV0FMTSxFQU1OLFdBTk0sRUFPTixXQVBNLEVBUU4sTUFSTSxFQVNOLE9BVE0sRUFXUEMsU0FYTyxFQUhtQzs7QUFnQjdDQyxLQUFHLENBQUMvQyxLQUFELEVBQVE7QUFDVCxRQUFJLENBQUMsS0FBS3JMLE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdkQsS0FBSixDQUFVLGNBQVYsQ0FBTjtBQUNEOztBQUVEd0IsV0FBTyxDQUFDMkksTUFBUixDQUFleUUsS0FBZixFQUFzQjtBQUNwQmdELGlCQUFXLEVBQUUsS0FETztBQUVwQkMsWUFBTSxFQUFFLEtBRlk7QUFHcEJMLGNBQVEsRUFBRTtBQUhVLEtBQXRCO0FBS0Q7O0FBMUI0QyxDQUFwQixDQUFwQjtBQTZCQSxNQUFNSixjQUFjLEdBQUcsSUFBSUcsZUFBSixDQUFvQjtBQUNoRGpULE1BQUksRUFBRSwyQkFEMEM7QUFHaERrVCxVQUFRLEVBQUVyUCxRQUFRLENBQUN1UCxTQUFULEVBSHNDOztBQUtoREMsS0FBRyxPQUFVO0FBQUEsUUFBVDtBQUFFL1M7QUFBRixLQUFTOztBQUNYLFFBQUksQ0FBQyxLQUFLMkUsTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTTRPLEtBQUssR0FBR3BOLE9BQU8sQ0FBQzdDLE9BQVIsQ0FBZ0JDLEdBQWhCLENBQWQ7QUFDQWdRLFNBQUssQ0FBQ2hCLFNBQU47QUFDRDs7QUFaK0MsQ0FBcEIsQ0FBdkI7QUFlQSxNQUFNeUQsV0FBVyxHQUFHLElBQUlFLGVBQUosQ0FBb0I7QUFDN0NqVCxNQUFJLEVBQUUsNkJBRHVDO0FBRzdDa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCb1UsWUFBUSxFQUFFO0FBQ1JqUCxVQUFJLEVBQUVnQixPQURFO0FBRVJkLGNBQVEsRUFBRTtBQUZGO0FBRGUsR0FBakIsRUFNUHlMLE1BTk8sQ0FNQXJNLFFBTkEsRUFPUHVQLFNBUE8sRUFIbUM7O0FBWTdDQyxLQUFHLFFBQW9CO0FBQUEsUUFBbkI7QUFBRS9TLFNBQUY7QUFBT2tUO0FBQVAsS0FBbUI7O0FBQ3JCLFFBQUksQ0FBQyxLQUFLdk8sTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTTRPLEtBQUssR0FBR3BOLE9BQU8sQ0FBQzdDLE9BQVIsQ0FBZ0JDLEdBQWhCLENBQWQ7O0FBQ0EsUUFBSSxDQUFDZ1EsS0FBTCxFQUFZO0FBQ1YsWUFBTSxJQUFJNU8sS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU11SixJQUFJLEdBQUcsRUFBYjtBQUFBLFVBQ0VDLE1BQU0sR0FBRyxFQURYOztBQUdBLFFBQUlzSSxRQUFRLEtBQUt0TyxTQUFqQixFQUE0QjtBQUMxQixVQUFJc08sUUFBSixFQUFjO0FBQ1osWUFBSWxELEtBQUssQ0FBQ25MLFVBQVYsRUFBc0I7QUFDcEIsZ0JBQU0sSUFBSXpELEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRHVKLFlBQUksQ0FBQzlGLFVBQUwsR0FBa0IsSUFBSUMsSUFBSixFQUFsQjtBQUNBNkYsWUFBSSxDQUFDcEcsWUFBTCxHQUFvQixLQUFLSSxNQUF6QjtBQUNEOztBQUNELFVBQUksQ0FBQ3VPLFFBQUwsRUFBZTtBQUNiLFlBQUksQ0FBQ2xELEtBQUssQ0FBQ25MLFVBQVgsRUFBdUI7QUFDckIsZ0JBQU0sSUFBSXpELEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRHdKLGNBQU0sQ0FBQy9GLFVBQVAsR0FBb0IsSUFBcEI7QUFDQStGLGNBQU0sQ0FBQ3JHLFlBQVAsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOztBQUVELFVBQU1rTixRQUFRLEdBQUcsRUFBakI7O0FBQ0EsUUFBSWpRLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXRHLElBQVosRUFBa0JvQixNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUNoQzBGLGNBQVEsQ0FBQzlHLElBQVQsR0FBZ0JBLElBQWhCO0FBQ0Q7O0FBQ0QsUUFBSW5KLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXJHLE1BQVosRUFBb0JtQixNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNsQzBGLGNBQVEsQ0FBQzdHLE1BQVQsR0FBa0JBLE1BQWxCO0FBQ0Q7O0FBQ0QsUUFBSXBKLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWVEsUUFBWixFQUFzQjFGLE1BQXRCLEtBQWlDLENBQXJDLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBRURuSixXQUFPLENBQUMwSSxNQUFSLENBQWV0TCxHQUFmLEVBQW9CeVIsUUFBcEI7QUFDRDs7QUF4RDRDLENBQXBCLENBQXBCO0FBMkRBLE1BQU1pQixpQkFBaUIsR0FBRyxJQUFJQyxlQUFKLENBQW9CO0FBQ25EalQsTUFBSSxFQUFFLDhCQUQ2QztBQUduRGtULFVBQVEsRUFBRWhRLE9BQU8sQ0FBQ21FLE1BQVIsQ0FDUG1GLElBRE8sQ0FDRixRQURFLEVBRVAwRCxNQUZPLENBRUFyTSxRQUZBLEVBR1B1UCxTQUhPLEVBSHlDOztBQVFuREMsS0FBRyxRQUFrQjtBQUFBLFFBQWpCO0FBQUUvUyxTQUFGO0FBQU9VO0FBQVAsS0FBaUI7O0FBQ25CLFFBQUksQ0FBQyxLQUFLaUUsTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTTRPLEtBQUssR0FBR3BOLE9BQU8sQ0FBQzdDLE9BQVIsQ0FBZ0JDLEdBQWhCLENBQWQ7O0FBQ0EsUUFBSSxDQUFDZ1EsS0FBTCxFQUFZO0FBQ1YsWUFBTSxJQUFJNU8sS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUlWLE1BQU0sS0FBSyxNQUFmLEVBQXVCO0FBQ3JCLFlBQU0sSUFBSVUsS0FBSixDQUFVLFNBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU11SixJQUFJLEdBQUc7QUFBRWpLO0FBQUYsS0FBYjs7QUFFQSxRQUFJQSxNQUFNLEtBQUssU0FBZixFQUEwQjtBQUN4QmlLLFVBQUksQ0FBQzBFLFNBQUwsR0FBaUIsSUFBSXZLLElBQUosRUFBakI7QUFDQWhDLGlCQUFXLENBQUN3SSxNQUFaLENBQ0U7QUFBRXFGLGVBQU8sRUFBRTNRO0FBQVgsT0FERixFQUVFO0FBQUUySyxZQUFJLEVBQUU7QUFBRWpLLGdCQUFNLEVBQUU7QUFBVjtBQUFSLE9BRkYsRUFHRTtBQUFFaVIsYUFBSyxFQUFFO0FBQVQsT0FIRjtBQUtEOztBQUVEL08sV0FBTyxDQUFDMEksTUFBUixDQUFldEwsR0FBZixFQUFvQjtBQUFFMks7QUFBRixLQUFwQjtBQUNEOztBQWxDa0QsQ0FBcEIsQ0FBMUI7O0FBcUNQLElBQUkvRCxNQUFNLENBQUM0RixhQUFQLElBQXdCNUYsTUFBTSxDQUFDNkYsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJpRCxtQkFBbkQsRUFBd0U7QUFwSnhFalIsUUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ3dVLHVCQUFtQixFQUFDLE1BQUlBO0FBQXpCLEdBQWQ7QUFxSlMsUUFBTUEsbUJBQW1CLEdBQUcsSUFBSVIsZUFBSixDQUFvQjtBQUNyRGpULFFBQUksRUFBRSwyQkFEK0M7QUFHckRrVCxZQUFRLEVBQUVyUCxRQUFRLENBQUN1UCxTQUFULEVBSDJDOztBQUtyREMsT0FBRyxRQUFVO0FBQUEsVUFBVDtBQUFFL1M7QUFBRixPQUFTOztBQUNYLFVBQUksQ0FBQyxLQUFLMkUsTUFBVixFQUFrQjtBQUNoQixjQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsWUFBTTRPLEtBQUssR0FBR3BOLE9BQU8sQ0FBQzdDLE9BQVIsQ0FBZ0JDLEdBQWhCLENBQWQ7O0FBQ0EsVUFBSSxDQUFDZ1EsS0FBTCxFQUFZO0FBQ1YsY0FBTSxJQUFJNU8sS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEd0IsYUFBTyxDQUFDMEksTUFBUixDQUFldEwsR0FBZixFQUFvQjtBQUFFMkssWUFBSSxFQUFFO0FBQUUzRixtQkFBUyxFQUFFO0FBQWI7QUFBUixPQUFwQjtBQUNBbEMsaUJBQVcsQ0FBQ3dJLE1BQVosQ0FBbUI7QUFBRXFGLGVBQU8sRUFBRTNRO0FBQVgsT0FBbkIsRUFBcUM7QUFBRTJLLFlBQUksRUFBRTtBQUFFM0YsbUJBQVMsRUFBRTtBQUFiO0FBQVIsT0FBckM7QUFDQXpGLFdBQUssQ0FBQytMLE1BQU4sQ0FBYTtBQUFFcUYsZUFBTyxFQUFFM1E7QUFBWCxPQUFiLEVBQStCO0FBQUUySyxZQUFJLEVBQUU7QUFBRTNGLG1CQUFTLEVBQUU7QUFBYjtBQUFSLE9BQS9CO0FBQ0Q7O0FBbEJvRCxHQUFwQixDQUE1QjtBQW9CUixDOzs7Ozs7Ozs7OztBQ3pLRHRHLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNxUCxjQUFZLEVBQUMsTUFBSUE7QUFBbEIsQ0FBZDtBQUErQyxJQUFJbFAsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBRXpELE1BQU1nUCxZQUFZLEdBQUcsSUFBSWxQLFlBQUosQ0FBaUI7QUFDM0M0QixRQUFNLEVBQUU7QUFDTnVELFFBQUksRUFBRUMsTUFEQTtBQUVOK0IsaUJBQWEsRUFBRSxDQUNiLE1BRGEsRUFDTDtBQUNSLGFBRmEsRUFFRjtBQUVYO0FBQ0E7QUFFQSxjQVBhLEVBT0Q7QUFFWjtBQUNBLGVBVmEsRUFVQTtBQUNiLFlBWGEsRUFZYixRQVphLENBWUo7QUFaSSxLQUZUO0FBZ0JOZixnQkFBWSxFQUFFLE1BaEJSO0FBaUJOaEUsU0FBSyxFQUFFO0FBakJEO0FBRG1DLENBQWpCLENBQXJCLEM7Ozs7Ozs7Ozs7O0FDRlAsSUFBSTRCLFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQTlDLEVBQThFLENBQTlFO0FBQWlGLElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQWhDLEVBQW9ELENBQXBEO0FBQXVELElBQUlvRSxNQUFKO0FBQVcxRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDdUUsUUFBTSxDQUFDcEUsQ0FBRCxFQUFHO0FBQUNvRSxVQUFNLEdBQUNwRSxDQUFQO0FBQVM7O0FBQXBCLENBQWxDLEVBQXdELENBQXhEO0FBQTJELElBQUlxRSxNQUFKO0FBQVczRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDd0UsUUFBTSxDQUFDckUsQ0FBRCxFQUFHO0FBQUNxRSxVQUFNLEdBQUNyRSxDQUFQO0FBQVM7O0FBQXBCLENBQWxDLEVBQXdELENBQXhEO0FBQTJELElBQUk0RCxPQUFKO0FBQVlsRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUMrRCxTQUFPLENBQUM1RCxDQUFELEVBQUc7QUFBQzRELFdBQU8sR0FBQzVELENBQVI7QUFBVTs7QUFBdEIsQ0FBekIsRUFBaUQsQ0FBakQ7QUFNMVQ0SCxNQUFNLENBQUN3TSxPQUFQLENBQWUsZUFBZixFQUFnQyxVQUFTQyxLQUFULEVBQWdCO0FBQzlDLE1BQUksQ0FBQyxLQUFLMU8sTUFBVixFQUFrQjtBQUNoQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLENBQUMwTyxLQUFELElBQVVBLEtBQUssQ0FBQ0gsUUFBTixLQUFtQnRPLFNBQWpDLEVBQTRDO0FBQzFDLFdBQU9oQyxPQUFPLENBQUNrRyxJQUFSLEVBQVA7QUFDRDs7QUFFRCxTQUFPbEcsT0FBTyxDQUFDa0csSUFBUixDQUFhO0FBQUVqRSxjQUFVLEVBQUU7QUFBRXFOLGFBQU8sRUFBRWpOLE9BQU8sQ0FBQ29PLEtBQUssQ0FBQ0gsUUFBUDtBQUFsQjtBQUFkLEdBQWIsQ0FBUDtBQUNELENBVkQ7QUFZQXRNLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSxhQUFmLEVBQThCLGdCQUFzQjtBQUFBLE1BQWI7QUFBRXpDO0FBQUYsR0FBYTs7QUFDbEQsTUFBSSxDQUFDLEtBQUtoTSxNQUFWLEVBQWtCO0FBQ2hCLFdBQU8sSUFBUDtBQUNEOztBQUVELE1BQUksQ0FBQ2dNLE9BQUwsRUFBYztBQUNaLFdBQU8sSUFBUDtBQUNEOztBQUVELFNBQU8sQ0FBQzdOLFdBQVcsQ0FBQ2dHLElBQVosQ0FBaUI7QUFBRTZIO0FBQUYsR0FBakIsQ0FBRCxFQUFnQ3BSLEtBQUssQ0FBQ3VKLElBQU4sQ0FBVztBQUFFNkg7QUFBRixHQUFYLENBQWhDLENBQVA7QUFDRCxDQVZEO0FBWUEvSixNQUFNLENBQUN3TSxPQUFQLENBQWUsa0JBQWYsRUFBbUMsaUJBQXFCO0FBQUEsTUFBWjtBQUFFNVM7QUFBRixHQUFZOztBQUN0RCxNQUFJLENBQUMsS0FBS21FLE1BQVYsRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDbkUsTUFBTCxFQUFhO0FBQ1gsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDNEMsTUFBTSxDQUFDMEYsSUFBUCxDQUFZO0FBQUV0STtBQUFGLEdBQVosQ0FBRCxFQUEwQjZDLE1BQU0sQ0FBQ3lGLElBQVAsQ0FBWTtBQUFFdEk7QUFBRixHQUFaLENBQTFCLENBQVA7QUFDRCxDQVZEO0FBWUFvRyxNQUFNLENBQUN3TSxPQUFQLENBQWUsZ0JBQWYsRUFBaUMsaUJBQXVCO0FBQUEsTUFBZDtBQUFFOUI7QUFBRixHQUFjO0FBQ3RELFNBQU8xTyxPQUFPLENBQUNrRyxJQUFSLENBQ0w7QUFBRXBJLFVBQU0sRUFBRSxTQUFWO0FBQXFCME8sUUFBSSxFQUFFO0FBQTNCLEdBREssRUFFTDtBQUFFa0UsVUFBTSxFQUFFO0FBQUV0VCxTQUFHLEVBQUUsQ0FBUDtBQUFVb1AsVUFBSSxFQUFFO0FBQWhCO0FBQVYsR0FGSyxDQUFQO0FBSUQsQ0FMRCxFOzs7Ozs7Ozs7OztBQzFDQTFRLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM2SyxhQUFXLEVBQUMsTUFBSUE7QUFBakIsQ0FBZDtBQUE2QyxJQUFJMUssWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl3RSxjQUFKLEVBQW1CRSxlQUFuQjtBQUFtQ2hGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUMyRSxnQkFBYyxDQUFDeEUsQ0FBRCxFQUFHO0FBQUN3RSxrQkFBYyxHQUFDeEUsQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUMwRSxpQkFBZSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxtQkFBZSxHQUFDMUUsQ0FBaEI7QUFBa0I7O0FBQTFFLENBQXBDLEVBQWdILENBQWhIO0FBR3JKLE1BQU13SyxXQUFXLEdBQUcsSUFBSTJFLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixjQUFyQixDQUFwQjtBQUVQNUUsV0FBVyxDQUFDZ0YsT0FBWixDQUFvQixFQUFwQixFLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQWhGLFdBQVcsQ0FBQytKLGFBQVosR0FBNEIsQ0FBQyxhQUFELENBQTVCO0FBRUEvSixXQUFXLENBQUNnSyxLQUFaLEdBQW9CLENBQUMsUUFBRCxFQUFXLFNBQVgsRUFBc0IsUUFBdEIsRUFBZ0MsU0FBaEMsQ0FBcEI7QUFFQWhLLFdBQVcsQ0FBQ3pDLE1BQVosR0FBcUIsSUFBSWpJLFlBQUosQ0FBaUI7QUFDcEM0SCxVQUFRLEVBQUU7QUFDUnpDLFFBQUksRUFBRWdCO0FBREUsR0FEMEI7QUFLcEN2RixNQUFJLEVBQUU7QUFDSnVFLFFBQUksRUFBRUMsTUFERjtBQUVKc0wsT0FBRyxFQUFFLEdBRkQ7QUFHSnBMLFNBQUssRUFBRSxzQkFISDtBQUlKbEQsU0FBSyxFQUFFLElBSkg7QUFLSnVHLFVBQU0sRUFBRSxJQUxKOztBQU1KNkgsVUFBTSxHQUFHO0FBQ1AsVUFBSSxLQUFLNUssS0FBTCxJQUFjOEUsV0FBVyxDQUFDVixJQUFaLENBQWlCO0FBQUVwSixZQUFJLEVBQUUsS0FBS21KO0FBQWIsT0FBakIsRUFBdUNFLEtBQXZDLEtBQWlELENBQW5FLEVBQXNFO0FBQ3BFLGVBQU8sV0FBUDtBQUNEO0FBQ0Y7O0FBVkcsR0FMOEI7QUFrQnBDMEssYUFBVyxFQUFFO0FBQ1h4UCxRQUFJLEVBQUVDLE1BREs7QUFFWHFMLE9BQUcsRUFBRSxDQUZNO0FBR1hDLE9BQUcsRUFBRTtBQUhNLEdBbEJ1QjtBQXdCcEN2TCxNQUFJLEVBQUU7QUFDSkEsUUFBSSxFQUFFQyxNQURGO0FBRUorQixpQkFBYSxFQUFFdUQsV0FBVyxDQUFDZ0s7QUFGdkIsR0F4QjhCO0FBNkJwQ2pFLEtBQUcsRUFBRTtBQUNIdEwsUUFBSSxFQUFFeVAsTUFESDtBQUVIdlAsWUFBUSxFQUFFO0FBRlAsR0E3QitCO0FBa0NwQ3FMLEtBQUcsRUFBRTtBQUNIdkwsUUFBSSxFQUFFeVAsTUFESDtBQUVIdlAsWUFBUSxFQUFFO0FBRlA7QUFsQytCLENBQWpCLENBQXJCO0FBd0NBcUYsV0FBVyxDQUFDekMsTUFBWixDQUFtQnVCLFVBQW5CLENBQThCQyxRQUE5QixDQUF1QztBQUNyQ1MsSUFBRSxFQUFFO0FBQ0YySyxhQUFTLEVBQUU7QUFEVDtBQURpQyxDQUF2QztBQU1BbkssV0FBVyxDQUFDekMsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCcE0sY0FBMUI7QUFDQWdHLFdBQVcsQ0FBQ3pDLE1BQVosQ0FBbUI2SSxNQUFuQixDQUEwQmxNLGVBQTFCO0FBQ0E4RixXQUFXLENBQUNxRyxZQUFaLENBQXlCckcsV0FBVyxDQUFDekMsTUFBckMsRTs7Ozs7Ozs7Ozs7QUNoRUEsSUFBSXlDLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQWhDLEVBQWdFLENBQWhFO0FBQW1FLElBQUk2RCxPQUFKO0FBQVluRSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDZ0UsU0FBTyxDQUFDN0QsQ0FBRCxFQUFHO0FBQUM2RCxXQUFPLEdBQUM3RCxDQUFSO0FBQVU7O0FBQXRCLENBQXBDLEVBQTRELENBQTVEO0FBRy9Gd0ssV0FBVyxDQUFDdUcsS0FBWixDQUFrQnhFLE1BQWxCLENBQXlCLFVBQVM1RyxNQUFULEVBQWlCaVAsVUFBakIsRUFBNkI7QUFDcEQsUUFBTTtBQUFFNVQsT0FBRyxFQUFFK0osWUFBUDtBQUFxQjlGO0FBQXJCLE1BQThCMlAsVUFBcEM7O0FBQ0EsTUFBSTNQLElBQUksS0FBSyxTQUFiLEVBQXdCO0FBQ3RCLEtBQUMsSUFBRCxFQUFPLEtBQVAsRUFBYzFDLE9BQWQsQ0FBc0JzSCxLQUFLLElBQUloRyxPQUFPLENBQUMwSSxNQUFSLENBQWU7QUFBRXhCLGtCQUFGO0FBQWdCbEI7QUFBaEIsS0FBZixDQUEvQjtBQUNEO0FBQ0YsQ0FMRCxFOzs7Ozs7Ozs7OztBQ0hBbkssTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2tWLGtCQUFnQixFQUFDLE1BQUlBLGdCQUF0QjtBQUF1Q0Msa0JBQWdCLEVBQUMsTUFBSUE7QUFBNUQsQ0FBZDtBQUE2RixJQUFJaFYsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkyVCxlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSTZELE9BQUo7QUFBWW5FLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNnRSxTQUFPLENBQUM3RCxDQUFELEVBQUc7QUFBQzZELFdBQU8sR0FBQzdELENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSXdLLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQWhDLEVBQWdFLENBQWhFO0FBQW1FLElBQUl1RSxRQUFKO0FBQWE3RSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDMEUsVUFBUSxDQUFDdkUsQ0FBRCxFQUFHO0FBQUN1RSxZQUFRLEdBQUN2RSxDQUFUO0FBQVc7O0FBQXhCLENBQXBDLEVBQThELENBQTlEO0FBT3RiLE1BQU02VSxnQkFBZ0IsR0FBRyxJQUFJbEIsZUFBSixDQUFvQjtBQUNsRGpULE1BQUksRUFBRSw0QkFENEM7QUFHbERrVCxVQUFRLEVBQUVwSixXQUFXLENBQUN6QyxNQUFaLENBQ1A4TCxJQURPLENBQ0YsV0FERSxFQUNXLFdBRFgsRUFFUGpELE1BRk8sQ0FHTixJQUFJOVEsWUFBSixDQUFpQjtBQUNmaVYsaUJBQWEsRUFBRTtBQUNiOVAsVUFBSSxFQUFFd0MsS0FETztBQUVidEMsY0FBUSxFQUFFO0FBRkcsS0FEQTtBQU1mLHVCQUFtQjtBQUNqQkYsVUFBSSxFQUFFbkYsWUFBWSxDQUFDa1YsS0FBYixDQUNKO0FBQ0UvUCxZQUFJLEVBQUVDLE1BRFI7QUFFRXNFLG9CQUFZLEVBQUU7QUFGaEIsT0FESSxFQUtKO0FBQ0V2RSxZQUFJLEVBQUVuRixZQUFZLENBQUNxUSxPQURyQjtBQUVFM0csb0JBQVksRUFBRTtBQUZoQixPQUxJLEVBU0o7QUFDRXZFLFlBQUksRUFBRXlQLE1BRFI7QUFFRWxMLG9CQUFZLEVBQUU7QUFGaEIsT0FUSSxFQWFKO0FBQ0V2RSxZQUFJLEVBQUVnQixPQURSO0FBRUV1RCxvQkFBWSxFQUFFO0FBRmhCLE9BYkk7QUFEVztBQU5KLEdBQWpCLENBSE0sRUErQlBzSyxTQS9CTyxFQUh3Qzs7QUFvQ2xEQyxLQUFHLENBQUNhLFVBQUQsRUFBYTtBQUNkLFFBQUksQ0FBQyxLQUFLalAsTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTTtBQUFFMlM7QUFBRixRQUFvQkgsVUFBMUI7QUFDQSxVQUFNN0osWUFBWSxHQUFHUCxXQUFXLENBQUMrQixNQUFaLENBQ25CTSxDQUFDLENBQUNnSCxJQUFGLENBQU9lLFVBQVAsRUFBbUIsZUFBbkIsQ0FEbUIsRUFFbkI7QUFBRVosaUJBQVcsRUFBRTtBQUFmLEtBRm1CLENBQXJCO0FBS0FlLGlCQUFhLENBQUN4UyxPQUFkLENBQXNCc0gsS0FBSyxJQUFJaEcsT0FBTyxDQUFDMEksTUFBUixDQUFlO0FBQUV4QixrQkFBRjtBQUFnQmxCO0FBQWhCLEtBQWYsQ0FBL0I7QUFDRDs7QUFoRGlELENBQXBCLENBQXpCO0FBbURBLE1BQU1pTCxnQkFBZ0IsR0FBRyxJQUFJbkIsZUFBSixDQUFvQjtBQUNsRGpULE1BQUksRUFBRSw0QkFENEM7QUFHbERrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJvVSxZQUFRLEVBQUU7QUFDUmpQLFVBQUksRUFBRWdCLE9BREU7QUFFUmQsY0FBUSxFQUFFO0FBRkY7QUFEZSxHQUFqQixFQU1QeUwsTUFOTyxDQU1Bck0sUUFOQSxFQU9QdVAsU0FQTyxFQUh3Qzs7QUFZbERDLEtBQUcsT0FBb0I7QUFBQSxRQUFuQjtBQUFFL1MsU0FBRjtBQUFPa1Q7QUFBUCxLQUFtQjs7QUFDckIsUUFBSSxDQUFDLEtBQUt2TyxNQUFWLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSXZELEtBQUosQ0FBVSxjQUFWLENBQU47QUFDRDs7QUFDRCxVQUFNd1MsVUFBVSxHQUFHcEssV0FBVyxDQUFDekosT0FBWixDQUFvQkMsR0FBcEIsQ0FBbkI7O0FBQ0EsUUFBSSxDQUFDNFQsVUFBTCxFQUFpQjtBQUNmLFlBQU0sSUFBSXhTLEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNdUosSUFBSSxHQUFHLEVBQWI7QUFBQSxVQUNFQyxNQUFNLEdBQUcsRUFEWDs7QUFHQSxRQUFJc0ksUUFBUSxLQUFLdE8sU0FBakIsRUFBNEI7QUFDMUIsVUFBSXNPLFFBQUosRUFBYztBQUNaLFlBQUlVLFVBQVUsQ0FBQy9PLFVBQWYsRUFBMkI7QUFDekIsZ0JBQU0sSUFBSXpELEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRHVKLFlBQUksQ0FBQzlGLFVBQUwsR0FBa0IsSUFBSUMsSUFBSixFQUFsQjtBQUNBNkYsWUFBSSxDQUFDcEcsWUFBTCxHQUFvQixLQUFLSSxNQUF6QjtBQUNEOztBQUNELFVBQUksQ0FBQ3VPLFFBQUwsRUFBZTtBQUNiLFlBQUksQ0FBQ1UsVUFBVSxDQUFDL08sVUFBaEIsRUFBNEI7QUFDMUIsZ0JBQU0sSUFBSXpELEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRHdKLGNBQU0sQ0FBQy9GLFVBQVAsR0FBb0IsSUFBcEI7QUFDQStGLGNBQU0sQ0FBQ3JHLFlBQVAsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOztBQUVELFVBQU1rTixRQUFRLEdBQUcsRUFBakI7O0FBQ0EsUUFBSWpRLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXRHLElBQVosRUFBa0JvQixNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUNoQzBGLGNBQVEsQ0FBQzlHLElBQVQsR0FBZ0JBLElBQWhCO0FBQ0Q7O0FBQ0QsUUFBSW5KLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXJHLE1BQVosRUFBb0JtQixNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNsQzBGLGNBQVEsQ0FBQzdHLE1BQVQsR0FBa0JBLE1BQWxCO0FBQ0Q7O0FBQ0QsUUFBSXBKLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWVEsUUFBWixFQUFzQjFGLE1BQXRCLEtBQWlDLENBQXJDLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBRUR2QyxlQUFXLENBQUM4QixNQUFaLENBQW1CdEwsR0FBbkIsRUFBd0J5UixRQUF4QjtBQUNEOztBQXZEaUQsQ0FBcEIsQ0FBekIsQzs7Ozs7Ozs7Ozs7QUMxRFAsSUFBSWpJLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQWpDLEVBQWlFLENBQWpFO0FBQW9FLElBQUltQixHQUFKO0FBQVF6QixNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDbUIsT0FBRyxHQUFDbkIsQ0FBSjtBQUFNOztBQUFsQixDQUFsQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJaVYsa0JBQUo7QUFBdUJ2VixNQUFNLENBQUNHLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDb1Ysb0JBQWtCLENBQUNqVixDQUFELEVBQUc7QUFBQ2lWLHNCQUFrQixHQUFDalYsQ0FBbkI7QUFBcUI7O0FBQTVDLENBQW5ELEVBQWlHLENBQWpHO0FBSTVLLE1BQU1rVixZQUFZLEdBQUcsQ0FDbkI7QUFDRXhVLE1BQUksRUFBRSxhQURSO0FBRUUrVCxhQUFXLEVBQUUsd0RBRmY7QUFHRXhQLE1BQUksRUFBRSxTQUhSO0FBSUVzTCxLQUFHLEVBQUUsQ0FKUDtBQUtFN0ksVUFBUSxFQUFFO0FBTFosQ0FEbUIsQ0FBckI7QUFVQXVOLGtCQUFrQixDQUFDM0gsSUFBbkIsQ0FBd0IsTUFBTTtBQUM1QjRILGNBQVksQ0FBQzNTLE9BQWIsQ0FBcUIwQyxJQUFJLElBQUk7QUFDM0IsVUFBTW1ILE1BQU0sR0FBRzVCLFdBQVcsQ0FBQ3pKLE9BQVosQ0FBb0I7QUFBRUwsVUFBSSxFQUFFdUUsSUFBSSxDQUFDdkU7QUFBYixLQUFwQixDQUFmOztBQUNBLFFBQUkwTCxNQUFKLEVBQVk7QUFDVjtBQUNEOztBQUNEakwsT0FBRyxDQUFDa1IsSUFBSiwwQ0FBMkNwTixJQUFJLENBQUN2RSxJQUFoRDs7QUFDQSxRQUFJO0FBQ0Y4SixpQkFBVyxDQUFDK0IsTUFBWixDQUFtQnRILElBQW5CO0FBQ0QsS0FGRCxDQUVFLE9BQU8zRCxLQUFQLEVBQWM7QUFDZEgsU0FBRyxDQUFDRyxLQUFKLDZCQUErQjJELElBQUksQ0FBQ3ZFLElBQXBDLG9DQUFrRVcsR0FBbEU7QUFDRDtBQUNGLEdBWEQ7QUFZRCxDQWJELEU7Ozs7Ozs7Ozs7O0FDZEEsSUFBSW1KLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQWpDLEVBQWlFLENBQWpFO0FBRWhCNEgsTUFBTSxDQUFDd00sT0FBUCxDQUFlLG9CQUFmLEVBQXFDLFlBQVc7QUFDOUMsTUFBSSxDQUFDLEtBQUt6TyxNQUFWLEVBQWtCO0FBQ2hCLFdBQU8sSUFBUDtBQUNEOztBQUVELFNBQU82RSxXQUFXLENBQUNWLElBQVosRUFBUDtBQUNELENBTkQsRTs7Ozs7Ozs7Ozs7QUNGQXBLLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNrRSxTQUFPLEVBQUMsTUFBSUEsT0FBYjtBQUFxQnNSLGdCQUFjLEVBQUMsTUFBSUE7QUFBeEMsQ0FBZDtBQUF1RSxJQUFJclYsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl3RSxjQUFKLEVBQW1CTyxTQUFuQixFQUE2QkwsZUFBN0I7QUFBNkNoRixNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDMkUsZ0JBQWMsQ0FBQ3hFLENBQUQsRUFBRztBQUFDd0Usa0JBQWMsR0FBQ3hFLENBQWY7QUFBaUIsR0FBcEM7O0FBQXFDK0UsV0FBUyxDQUFDL0UsQ0FBRCxFQUFHO0FBQUMrRSxhQUFTLEdBQUMvRSxDQUFWO0FBQVksR0FBOUQ7O0FBQStEMEUsaUJBQWUsQ0FBQzFFLENBQUQsRUFBRztBQUFDMEUsbUJBQWUsR0FBQzFFLENBQWhCO0FBQWtCOztBQUFwRyxDQUFwQyxFQUEwSSxDQUExSTtBQUE2SSxJQUFJd0ssV0FBSjtBQUFnQjlLLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUMySyxhQUFXLENBQUN4SyxDQUFELEVBQUc7QUFBQ3dLLGVBQVcsR0FBQ3hLLENBQVo7QUFBYzs7QUFBOUIsQ0FBOUMsRUFBOEUsQ0FBOUU7QUFRdFYsTUFBTTZELE9BQU8sR0FBRyxJQUFJc0wsS0FBSyxDQUFDQyxVQUFWLENBQXFCLFNBQXJCLENBQWhCO0FBRVB2TCxPQUFPLENBQUMyTCxPQUFSLENBQWdCO0FBQ2R6SixPQUFLLEdBQUc7QUFDTixRQUFJQSxLQUFLLEdBQUcsS0FBS3JGLElBQWpCO0FBQ0EsVUFBTW1KLEtBQUssR0FBRzNFLE1BQU0sQ0FBQyxLQUFLMkUsS0FBTixDQUFwQjs7QUFDQSxRQUFJOUQsS0FBSyxLQUFLOEQsS0FBZCxFQUFxQjtBQUNuQjlELFdBQUssZ0JBQVM4RCxLQUFULE1BQUw7QUFDRDs7QUFDRCxXQUFPOUQsS0FBUDtBQUNELEdBUmE7O0FBVWQ2TyxZQUFVLEdBQUc7QUFDWCxXQUFPcEssV0FBVyxDQUFDekosT0FBWixDQUFvQixLQUFLZ0ssWUFBekIsQ0FBUDtBQUNELEdBWmE7O0FBY2RxSyxnQkFBYyxHQUFHO0FBQ2YsVUFBTWxLLENBQUMsR0FBRyxLQUFLMEosVUFBTCxFQUFWO0FBQ0EsV0FBTzFKLENBQUMsSUFBSUEsQ0FBQyxDQUFDeEssSUFBZDtBQUNELEdBakJhOztBQW1CZDJVLFdBQVMsR0FBRztBQUNWLHFCQUFVLEtBQUtELGNBQUwsRUFBVixlQUFvQyxLQUFLclAsS0FBTCxFQUFwQztBQUNEOztBQXJCYSxDQUFoQjtBQXdCTyxNQUFNb1AsY0FBYyxHQUFHO0FBQzVCaEYsU0FBTyxFQUFFclEsWUFBWSxDQUFDcVEsT0FETTtBQUU1QmpMLFFBQU0sRUFBRUEsTUFGb0I7QUFHNUJ3UCxRQUFNLEVBQUVBLE1BSG9CO0FBSTVCek8sU0FBTyxFQUFFQTtBQUptQixDQUF2Qjs7QUFPUHBDLE9BQU8sQ0FBQ3lSLGVBQVIsR0FBMEIsVUFBU1YsVUFBVCxFQUFxQi9LLEtBQXJCLEVBQTRCMEwsaUJBQTVCLEVBQStDO0FBQ3ZFLFFBQU10USxJQUFJLEdBQUdrUSxjQUFjLENBQUNQLFVBQVUsQ0FBQzNQLElBQVosQ0FBM0I7O0FBRUEsTUFBSXNRLGlCQUFpQixJQUFJQSxpQkFBaUIsS0FBS3RRLElBQS9DLEVBQXFEO0FBQ25EO0FBQ0Q7O0FBRUQsUUFBTXVRLFdBQVcsR0FBRztBQUFFdlE7QUFBRixHQUFwQjs7QUFDQSxNQUFJMlAsVUFBVSxDQUFDckUsR0FBZixFQUFvQjtBQUNsQmlGLGVBQVcsQ0FBQ2pGLEdBQVosR0FBa0JxRSxVQUFVLENBQUNyRSxHQUE3QjtBQUNEOztBQUNELE1BQUlxRSxVQUFVLENBQUNwRSxHQUFmLEVBQW9CO0FBQ2xCZ0YsZUFBVyxDQUFDaEYsR0FBWixHQUFrQm9FLFVBQVUsQ0FBQ3BFLEdBQTdCO0FBQ0Q7O0FBQ0QsUUFBTXpJLE1BQU0sR0FBRztBQUFFOEIsU0FBSyxFQUFFMkw7QUFBVCxHQUFmO0FBQ0EsUUFBTTVMLEdBQUcsR0FBRyxJQUFJOUosWUFBSixDQUFpQmlJLE1BQWpCLEVBQXlCME4sVUFBekIsRUFBWjtBQUVBN0wsS0FBRyxDQUFDZ0ssUUFBSixDQUFhO0FBQUUvSjtBQUFGLEdBQWI7O0FBRUEsTUFBSSxDQUFDRCxHQUFHLENBQUM4TCxPQUFKLEVBQUwsRUFBb0I7QUFDbEIsV0FBTzlMLEdBQUcsQ0FBQytMLGdCQUFKLEVBQVA7QUFDRDs7QUFFRCxNQUFJOVIsT0FBTyxDQUFDaUcsSUFBUixDQUFhO0FBQUVpQixnQkFBWSxFQUFFNkosVUFBVSxDQUFDNVQsR0FBM0I7QUFBZ0M2STtBQUFoQyxHQUFiLEVBQXNERSxLQUF0RCxLQUFnRSxDQUFwRSxFQUF1RTtBQUNyRSxXQUFPLENBQUM7QUFBRXJKLFVBQUksRUFBRSxPQUFSO0FBQWlCdUUsVUFBSSxFQUFFO0FBQXZCLEtBQUQsQ0FBUDtBQUNEO0FBQ0YsQ0ExQkQ7O0FBNEJBLE1BQU1xUSxlQUFlLEdBQUcsWUFBVztBQUNqQyxNQUFJLEtBQUt0VCxHQUFMLEtBQWEsT0FBakIsRUFBMEI7QUFDeEI7QUFDRDs7QUFDRCxRQUFNK0ksWUFBWSxHQUFHLEtBQUt0RixLQUFMLENBQVcsY0FBWCxFQUEyQm9FLEtBQWhEO0FBQ0EsUUFBTStLLFVBQVUsR0FBR3BLLFdBQVcsQ0FBQ3pKLE9BQVosQ0FBb0JnSyxZQUFwQixDQUFuQjtBQUNBLFFBQU1sQixLQUFLLEdBQUcsS0FBS0EsS0FBbkI7QUFDQSxRQUFNK0wsTUFBTSxHQUFHL1IsT0FBTyxDQUFDeVIsZUFBUixDQUF3QlYsVUFBeEIsRUFBb0MvSyxLQUFwQyxDQUFmOztBQUVBLE1BQUkrTCxNQUFKLEVBQVk7QUFDVixTQUFLQyxtQkFBTCxDQUF5QkQsTUFBekI7QUFDQSxXQUFPLEtBQVA7QUFDRDtBQUNGLENBYkQ7O0FBZUEvUixPQUFPLENBQUNrRSxNQUFSLEdBQWlCLElBQUlqSSxZQUFKLENBQWlCO0FBQ2hDWSxNQUFJLEVBQUU7QUFDSnVFLFFBQUksRUFBRUMsTUFERjs7QUFFSk0sYUFBUyxHQUFHO0FBQ1YsVUFBSSxDQUFDLEtBQUtFLEtBQU4sS0FBZ0IsS0FBS1UsUUFBTCxJQUFpQndCLE1BQU0sQ0FBQ2tHLFFBQXhDLENBQUosRUFBdUQ7QUFDckQsZUFBTzVJLE1BQU0sQ0FBQyxLQUFLTyxLQUFMLENBQVcsT0FBWCxFQUFvQm9FLEtBQXJCLENBQU4sQ0FBa0NpTSxLQUFsQyxDQUF3QyxDQUF4QyxFQUEyQyxFQUEzQyxDQUFQO0FBQ0Q7QUFDRixLQU5HOztBQU9KdEYsT0FBRyxFQUFFLEdBUEQ7QUFRSnBMLFNBQUssRUFBRTtBQVJILEdBRDBCO0FBWWhDeUUsT0FBSyxFQUFFO0FBQ0w1RSxRQUFJLEVBQUVuRixZQUFZLENBQUNrVixLQUFiLENBQ0o7QUFDRS9QLFVBQUksRUFBRUM7QUFEUixLQURJLEVBSUo7QUFDRUQsVUFBSSxFQUFFbkYsWUFBWSxDQUFDcVE7QUFEckIsS0FKSSxFQU9KO0FBQ0VsTCxVQUFJLEVBQUV5UDtBQURSLEtBUEksRUFVSjtBQUNFelAsVUFBSSxFQUFFZ0I7QUFEUixLQVZJO0FBREQ7QUFaeUIsQ0FBakIsQ0FBakI7QUE4QkFwQyxPQUFPLENBQUNrRSxNQUFSLENBQWUwQixZQUFmLENBQTRCNkwsZUFBNUI7QUFDQXpSLE9BQU8sQ0FBQ2tFLE1BQVIsQ0FBZTZJLE1BQWYsQ0FBc0JwTSxjQUF0QjtBQUNBWCxPQUFPLENBQUNrRSxNQUFSLENBQWU2SSxNQUFmLENBQXNCN0wsU0FBUyxDQUFDLGFBQUQsQ0FBL0I7QUFDQWxCLE9BQU8sQ0FBQ2tFLE1BQVIsQ0FBZTZJLE1BQWYsQ0FBc0JsTSxlQUF0QjtBQUNBYixPQUFPLENBQUNnTixZQUFSLENBQXFCaE4sT0FBTyxDQUFDa0UsTUFBN0IsRTs7Ozs7Ozs7Ozs7QUN0SEFySSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDb1csY0FBWSxFQUFDLE1BQUlBLFlBQWxCO0FBQStCQyxjQUFZLEVBQUMsTUFBSUE7QUFBaEQsQ0FBZDtBQUE2RSxJQUFJckMsZUFBSjtBQUFvQmpVLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUM4VCxpQkFBZSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxtQkFBZSxHQUFDM1QsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQTFDLEVBQWtGLENBQWxGO0FBQXFGLElBQUlGLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJNkQsT0FBSjtBQUFZbkUsTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDZ0UsU0FBTyxDQUFDN0QsQ0FBRCxFQUFHO0FBQUM2RCxXQUFPLEdBQUM3RCxDQUFSO0FBQVU7O0FBQXRCLENBQTNCLEVBQW1ELENBQW5EO0FBQXNELElBQUl3SyxXQUFKO0FBQWdCOUssTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQzJLLGFBQVcsQ0FBQ3hLLENBQUQsRUFBRztBQUFDd0ssZUFBVyxHQUFDeEssQ0FBWjtBQUFjOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJdUUsUUFBSjtBQUFhN0UsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQzBFLFVBQVEsQ0FBQ3ZFLENBQUQsRUFBRztBQUFDdUUsWUFBUSxHQUFDdkUsQ0FBVDtBQUFXOztBQUF4QixDQUFwQyxFQUE4RCxDQUE5RDtBQUFpRSxJQUFJaVcsNkJBQUo7QUFBa0N2VyxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDb1csK0JBQTZCLENBQUNqVyxDQUFELEVBQUc7QUFBQ2lXLGlDQUE2QixHQUFDalcsQ0FBOUI7QUFBZ0M7O0FBQWxFLENBQWpDLEVBQXFHLENBQXJHO0FBUTlnQixNQUFNK1YsWUFBWSxHQUFHLElBQUlwQyxlQUFKLENBQW9CO0FBQzlDalQsTUFBSSxFQUFFLHdCQUR3QztBQUc5Q2tULFVBQVEsRUFBRS9QLE9BQU8sQ0FBQ2tFLE1BQVIsQ0FBZThMLElBQWYsQ0FBb0IsV0FBcEIsRUFBaUMsV0FBakMsRUFBOENDLFNBQTlDLEVBSG9DOztBQUs5Q0MsS0FBRyxDQUFDdkksTUFBRCxFQUFTO0FBQ1YsUUFBSSxDQUFDLEtBQUs3RixNQUFWLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSXZELEtBQUosQ0FBVSxjQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNd1MsVUFBVSxHQUFHcEssV0FBVyxDQUFDekosT0FBWixDQUFvQnlLLE1BQU0sQ0FBQ1QsWUFBM0IsQ0FBbkI7O0FBQ0EsUUFBSSxDQUFDNkosVUFBTCxFQUFpQjtBQUNmLFlBQU0sSUFBSXhTLEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRCxVQUFNd1QsTUFBTSxHQUFHL1IsT0FBTyxDQUFDeVIsZUFBUixDQUF3QlYsVUFBeEIsRUFBb0NwSixNQUFNLENBQUMzQixLQUEzQyxDQUFmOztBQUNBLFFBQUkrTCxNQUFKLEVBQVk7QUFDVixZQUFNLElBQUl4VCxLQUFKLENBQ0p3VCxNQUFNLENBQUNoSixHQUFQLENBQVdzSixDQUFDLElBQUlELDZCQUE2QixDQUFDQyxDQUFELENBQTdDLEVBQWtEQyxJQUFsRCxDQUF1RCxJQUF2RCxDQURJLENBQU47QUFHRDs7QUFFRHRTLFdBQU8sQ0FBQzBJLE1BQVIsQ0FBZWYsTUFBZixFQUF1QjtBQUFFd0ksaUJBQVcsRUFBRTtBQUFmLEtBQXZCO0FBQ0Q7O0FBdkI2QyxDQUFwQixDQUFyQjtBQTBCQSxNQUFNZ0MsWUFBWSxHQUFHLElBQUlyQyxlQUFKLENBQW9CO0FBQzlDalQsTUFBSSxFQUFFLHdCQUR3QztBQUc5Q2tULFVBQVEsRUFBRS9QLE9BQU8sQ0FBQ2tFLE1BQVIsQ0FDUG1GLElBRE8sQ0FDRixNQURFLEVBRVAwRCxNQUZPLENBRUFyTSxRQUZBLEVBR1BxTSxNQUhPLENBSU4sSUFBSTlRLFlBQUosQ0FBaUI7QUFDZm9VLFlBQVEsRUFBRTtBQUNSalAsVUFBSSxFQUFFZ0IsT0FERTtBQUVSZCxjQUFRLEVBQUU7QUFGRjtBQURLLEdBQWpCLENBSk0sRUFXUDJPLFNBWE8sRUFIb0M7O0FBZ0I5Q0MsS0FBRyxPQUEwQjtBQUFBLFFBQXpCO0FBQUUvUyxTQUFGO0FBQU9OLFVBQVA7QUFBYXdUO0FBQWIsS0FBeUI7O0FBQzNCLFFBQUksQ0FBQyxLQUFLdk8sTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTW9KLE1BQU0sR0FBRzNILE9BQU8sQ0FBQzlDLE9BQVIsQ0FBZ0JDLEdBQWhCLENBQWY7O0FBQ0EsUUFBSSxDQUFDd0ssTUFBTCxFQUFhO0FBQ1gsWUFBTSxJQUFJcEosS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU11SixJQUFJLEdBQUcsRUFBYjtBQUFBLFVBQ0VDLE1BQU0sR0FBRyxFQURYOztBQUVBLFFBQUlsTCxJQUFJLEtBQUtrRixTQUFiLEVBQXdCO0FBQ3RCK0YsVUFBSSxDQUFDakwsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQsUUFBSXdULFFBQVEsS0FBS3RPLFNBQWpCLEVBQTRCO0FBQzFCLFVBQUlzTyxRQUFKLEVBQWM7QUFDWixZQUFJMUksTUFBTSxDQUFDM0YsVUFBWCxFQUF1QjtBQUNyQixnQkFBTSxJQUFJekQsS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEdUosWUFBSSxDQUFDOUYsVUFBTCxHQUFrQixJQUFJQyxJQUFKLEVBQWxCO0FBQ0E2RixZQUFJLENBQUNwRyxZQUFMLEdBQW9CLEtBQUtJLE1BQXpCO0FBQ0Q7O0FBRUQsVUFBSSxDQUFDdU8sUUFBTCxFQUFlO0FBQ2IsWUFBSSxDQUFDMUksTUFBTSxDQUFDM0YsVUFBWixFQUF3QjtBQUN0QixnQkFBTSxJQUFJekQsS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEd0osY0FBTSxDQUFDL0YsVUFBUCxHQUFvQixJQUFwQjtBQUNBK0YsY0FBTSxDQUFDckcsWUFBUCxHQUFzQixJQUF0QjtBQUNEO0FBQ0Y7O0FBRUQsVUFBTWtOLFFBQVEsR0FBRyxFQUFqQjs7QUFDQSxRQUFJalEsTUFBTSxDQUFDeVAsSUFBUCxDQUFZdEcsSUFBWixFQUFrQm9CLE1BQWxCLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDMEYsY0FBUSxDQUFDOUcsSUFBVCxHQUFnQkEsSUFBaEI7QUFDRDs7QUFDRCxRQUFJbkosTUFBTSxDQUFDeVAsSUFBUCxDQUFZckcsTUFBWixFQUFvQm1CLE1BQXBCLEdBQTZCLENBQWpDLEVBQW9DO0FBQ2xDMEYsY0FBUSxDQUFDN0csTUFBVCxHQUFrQkEsTUFBbEI7QUFDRDs7QUFDRCxRQUFJcEosTUFBTSxDQUFDeVAsSUFBUCxDQUFZUSxRQUFaLEVBQXNCMUYsTUFBdEIsS0FBaUMsQ0FBckMsRUFBd0M7QUFDdEM7QUFDRDs7QUFFRGxKLFdBQU8sQ0FBQ3lJLE1BQVIsQ0FBZXRMLEdBQWYsRUFBb0J5UixRQUFwQjtBQUNEOztBQWhFNkMsQ0FBcEIsQ0FBckIsQzs7Ozs7Ozs7Ozs7QUNsQ1AsSUFBSTVPLE9BQUo7QUFBWW5FLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ2dFLFNBQU8sQ0FBQzdELENBQUQsRUFBRztBQUFDNkQsV0FBTyxHQUFDN0QsQ0FBUjtBQUFVOztBQUF0QixDQUE1QixFQUFvRCxDQUFwRDtBQUVaNEgsTUFBTSxDQUFDd00sT0FBUCxDQUFlLGVBQWYsRUFBZ0MsWUFBVztBQUN6QyxNQUFJLENBQUMsS0FBS3pPLE1BQVYsRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDOUIsT0FBTyxDQUFDaUcsSUFBUixFQUFELENBQVA7QUFDRCxDQU5ELEU7Ozs7Ozs7Ozs7O0FDRkFwSyxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDbUUsYUFBVyxFQUFDLE1BQUlBO0FBQWpCLENBQWQ7QUFBNkMsSUFBSWhFLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJZ1AsWUFBSjtBQUFpQnRQLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNtUCxjQUFZLENBQUNoUCxDQUFELEVBQUc7QUFBQ2dQLGdCQUFZLEdBQUNoUCxDQUFiO0FBQWU7O0FBQWhDLENBQXZDLEVBQXlFLENBQXpFO0FBQTRFLElBQUk0RCxPQUFKO0FBQVlsRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDK0QsU0FBTyxDQUFDNUQsQ0FBRCxFQUFHO0FBQUM0RCxXQUFPLEdBQUM1RCxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUkrRSxTQUFKLEVBQWNELFlBQWQsRUFBMkJKLGVBQTNCO0FBQTJDaEYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2tGLFdBQVMsQ0FBQy9FLENBQUQsRUFBRztBQUFDK0UsYUFBUyxHQUFDL0UsQ0FBVjtBQUFZLEdBQTFCOztBQUEyQjhFLGNBQVksQ0FBQzlFLENBQUQsRUFBRztBQUFDOEUsZ0JBQVksR0FBQzlFLENBQWI7QUFBZSxHQUExRDs7QUFBMkQwRSxpQkFBZSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxtQkFBZSxHQUFDMUUsQ0FBaEI7QUFBa0I7O0FBQWhHLENBQWpDLEVBQW1JLENBQW5JO0FBQXNJLElBQUl5RSxlQUFKLEVBQW9CRyxjQUFwQjtBQUFtQ2xGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUM0RSxpQkFBZSxDQUFDekUsQ0FBRCxFQUFHO0FBQUN5RSxtQkFBZSxHQUFDekUsQ0FBaEI7QUFBa0IsR0FBdEM7O0FBQXVDNEUsZ0JBQWMsQ0FBQzVFLENBQUQsRUFBRztBQUFDNEUsa0JBQWMsR0FBQzVFLENBQWY7QUFBaUI7O0FBQTFFLENBQXBDLEVBQWdILENBQWhIO0FBQW1ILElBQUltRSxPQUFKO0FBQVl6RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDc0UsU0FBTyxDQUFDbkUsQ0FBRCxFQUFHO0FBQUNtRSxXQUFPLEdBQUNuRSxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUlzRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNHLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDeUUsWUFBVSxDQUFDdEUsQ0FBRCxFQUFHO0FBQUNzRSxjQUFVLEdBQUN0RSxDQUFYO0FBQWE7O0FBQTVCLENBQXZDLEVBQXFFLENBQXJFO0FBVXJyQixNQUFNOEQsV0FBVyxHQUFHLElBQUlxTCxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsY0FBckIsQ0FBcEI7QUFFUHRMLFdBQVcsQ0FBQzBMLE9BQVosQ0FBb0I7QUFDbEI2RCxTQUFPLEdBQUc7QUFDUixXQUFPbFAsT0FBTyxDQUFDMkYsSUFBUixDQUFhO0FBQUU5SSxTQUFHLEVBQUU7QUFBRWdTLFdBQUcsRUFBRSxLQUFLZDtBQUFaO0FBQVAsS0FBYixFQUErQzdFLEtBQS9DLEVBQVA7QUFDRCxHQUhpQjs7QUFJbEIyRCxPQUFLLEdBQUc7QUFDTixXQUFPcE4sT0FBTyxDQUFDN0MsT0FBUixDQUFnQjtBQUFFQyxTQUFHLEVBQUUsS0FBSzJRO0FBQVosS0FBaEIsQ0FBUDtBQUNELEdBTmlCOztBQU9sQlIsV0FBUyxHQUFHO0FBQ1YsV0FBTzdNLFVBQVUsQ0FBQ3ZELE9BQVgsQ0FBbUI7QUFBRUMsU0FBRyxFQUFFLEtBQUtzUTtBQUFaLEtBQW5CLENBQVA7QUFDRDs7QUFUaUIsQ0FBcEI7QUFZQXhOLFdBQVcsQ0FBQ2lFLE1BQVosR0FBcUIsSUFBSWpJLFlBQUosQ0FBaUI7QUFDcEM7QUFDQTtBQUNBb0MsT0FBSyxFQUFFO0FBQ0wrQyxRQUFJLEVBQUVuRixZQUFZLENBQUNxUSxPQURkO0FBRUxJLE9BQUcsRUFBRSxDQUZBO0FBR0x4SyxTQUFLLEVBQUU7QUFIRixHQUg2QjtBQVNwQztBQUNBO0FBQ0E4TCxnQkFBYyxFQUFFO0FBQ2Q1TSxRQUFJLEVBQUVuRixZQUFZLENBQUNxUSxPQURMO0FBRWRJLE9BQUcsRUFBRSxDQUZTO0FBR2R4SyxTQUFLLEVBQUU7QUFITyxHQVhvQjtBQWlCcENxUSxrQkFBZ0IsRUFBRTtBQUNoQnJRLFNBQUssRUFBRSw0Q0FEUztBQUVoQmQsUUFBSSxFQUFFYSxJQUZVO0FBR2hCWCxZQUFRLEVBQUU7QUFITSxHQWpCa0I7QUF1QnBDa1IsWUFBVSxFQUFFO0FBQ1Z0USxTQUFLLEVBQUUsaURBREc7QUFFVmQsUUFBSSxFQUFFYSxJQUZJO0FBR1ZYLFlBQVEsRUFBRSxJQUhBO0FBSVZqRCxTQUFLLEVBQUU7QUFKRyxHQXZCd0I7QUE4QnBDVCxXQUFTLEVBQUU7QUFDVHNFLFNBQUssRUFBRSxjQURFO0FBRVRkLFFBQUksRUFBRUMsTUFGRztBQUdUQyxZQUFRLEVBQUUsSUFIRDtBQUlUQyxTQUFLLEVBQUU7QUFKRSxHQTlCeUI7QUFxQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQW1OLGlCQUFlLEVBQUU7QUFDZnROLFFBQUksRUFBRXdDLEtBRFM7QUFFZnZCLGdCQUFZLEVBQUUsRUFGQztBQUdmSCxTQUFLLGtCQUhVO0FBSWY3RCxTQUFLLEVBQUU7QUFKUSxHQTFDbUI7QUFnRHBDLHVCQUFxQjtBQUNuQitDLFFBQUksRUFBRUMsTUFEYTtBQUVuQkUsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGUDtBQUduQlMsU0FBSztBQUhjO0FBaERlLENBQWpCLENBQXJCOztBQXVEQSxJQUFJNkIsTUFBTSxDQUFDNEYsYUFBUCxJQUF3QjVGLE1BQU0sQ0FBQzZGLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQXVCaUQsbUJBQW5ELEVBQXdFO0FBQ3RFN00sYUFBVyxDQUFDaUUsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCbk0sZUFBMUI7QUFDRDs7QUFFRFgsV0FBVyxDQUFDaUUsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCaE0sY0FBMUI7QUFDQWQsV0FBVyxDQUFDaUUsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCbE0sZUFBMUIsRSxDQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBWixXQUFXLENBQUNpRSxNQUFaLENBQW1CNkksTUFBbkIsQ0FBMEI5TCxZQUFZLENBQUMsU0FBRCxDQUF0QztBQUNBaEIsV0FBVyxDQUFDaUUsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCN0wsU0FBUyxDQUFDLE9BQUQsRUFBVSxLQUFWLENBQW5DO0FBQ0FqQixXQUFXLENBQUNpRSxNQUFaLENBQW1CNkksTUFBbkIsQ0FBMEI3TCxTQUFTLENBQUMsWUFBRCxDQUFuQztBQUNBakIsV0FBVyxDQUFDaUUsTUFBWixDQUFtQjZJLE1BQW5CLENBQTBCN0wsU0FBUyxDQUFDLFNBQUQsQ0FBbkM7QUFDQWpCLFdBQVcsQ0FBQ2lFLE1BQVosQ0FBbUI2SSxNQUFuQixDQUEwQjdMLFNBQVMsQ0FBQyxjQUFELENBQW5DLEUsQ0FDQTs7QUFDQWpCLFdBQVcsQ0FBQ2lFLE1BQVosQ0FBbUI2SSxNQUFuQixDQUEwQjVCLFlBQTFCO0FBQ0FsTCxXQUFXLENBQUMrTSxZQUFaLENBQXlCL00sV0FBVyxDQUFDaUUsTUFBckMsRTs7Ozs7Ozs7Ozs7QUNoR0EsSUFBSWpFLFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQTNDLEVBQTJFLENBQTNFO0FBQThFLElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0JBQVosRUFBNkI7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQTdCLEVBQWlELENBQWpEO0FBQW9ELElBQUkrRCxZQUFKO0FBQWlCckUsTUFBTSxDQUFDRyxJQUFQLENBQVksbUNBQVosRUFBZ0Q7QUFBQ2tFLGNBQVksQ0FBQy9ELENBQUQsRUFBRztBQUFDK0QsZ0JBQVksR0FBQy9ELENBQWI7QUFBZTs7QUFBaEMsQ0FBaEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSXNXLG1CQUFKO0FBQXdCNVcsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ3lXLHFCQUFtQixDQUFDdFcsQ0FBRCxFQUFHO0FBQUNzVyx1QkFBbUIsR0FBQ3RXLENBQXBCO0FBQXNCOztBQUE5QyxDQUE5QixFQUE4RSxDQUE5RTtBQUFpRixJQUFJdVcsY0FBSixFQUFtQkMscUJBQW5CO0FBQXlDOVcsTUFBTSxDQUFDRyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQzBXLGdCQUFjLENBQUN2VyxDQUFELEVBQUc7QUFBQ3VXLGtCQUFjLEdBQUN2VyxDQUFmO0FBQWlCLEdBQXBDOztBQUFxQ3dXLHVCQUFxQixDQUFDeFcsQ0FBRCxFQUFHO0FBQUN3Vyx5QkFBcUIsR0FBQ3hXLENBQXRCO0FBQXdCOztBQUF0RixDQUFoQyxFQUF3SCxDQUF4SDtBQVEvZDtBQUNBOEQsV0FBVyxDQUFDaU4sS0FBWixDQUFrQnpFLE1BQWxCLENBQXlCLFVBQ3ZCM0csTUFEdUIsUUFHdkI2TSxVQUh1QixFQUl2QkMsUUFKdUIsRUFLdkJqSyxPQUx1QixFQU12QjtBQUFBLE1BSkE7QUFBRW1KO0FBQUYsR0FJQTs7QUFDQSxNQUFJLENBQUNhLFVBQVUsQ0FBQzlELFFBQVgsQ0FBb0IsWUFBcEIsQ0FBTCxFQUF3QztBQUN0QztBQUNEOztBQUVENkgsZ0JBQWMsQ0FBQzVFLE9BQUQsQ0FBZDtBQUNBNkUsdUJBQXFCLENBQUM3RSxPQUFELENBQXJCO0FBQ0QsQ0FiRCxFLENBZUE7O0FBQ0E3TixXQUFXLENBQUNpTixLQUFaLENBQWtCekUsTUFBbEIsQ0FDRSxVQUFTM0csTUFBVCxFQUFpQjBKLEdBQWpCLEVBQXNCbUQsVUFBdEIsRUFBa0NDLFFBQWxDLEVBQTRDakssT0FBNUMsRUFBcUQ7QUFDbkQsTUFDRSxFQUNFZ0ssVUFBVSxDQUFDOUQsUUFBWCxDQUFvQixXQUFwQixLQUNDOEQsVUFBVSxDQUFDOUQsUUFBWCxDQUFvQixRQUFwQixLQUFpQ1csR0FBRyxDQUFDM04sTUFBSixJQUFjLFNBRmxELENBREYsRUFLRTtBQUNBO0FBQ0Q7O0FBRUQsUUFBTStVLFNBQVMsR0FBRyxLQUFLQyxTQUFMLEVBQWxCO0FBQ0EsUUFBTUMsWUFBWSxHQUFHLEVBQXJCOztBQUVBLE1BQUlGLFNBQVMsQ0FBQ3ZFLFNBQVYsSUFBdUJ1RSxTQUFTLENBQUN2RSxTQUFWLENBQW9CbkYsTUFBcEIsR0FBNkIsQ0FBeEQsRUFBMkQ7QUFDekQsVUFBTXNHLE9BQU8sR0FBR2xQLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYTtBQUMzQjlJLFNBQUcsRUFBRTtBQUFFZ1MsV0FBRyxFQUFFeUQsU0FBUyxDQUFDdkU7QUFBakI7QUFEc0IsS0FBYixFQUViN0UsS0FGYSxFQUFoQjtBQUdBc0osZ0JBQVksQ0FBQ3JKLElBQWIsQ0FBa0IsR0FBRytGLE9BQU8sQ0FBQ1ksTUFBUixDQUFlMkMsQ0FBQyxJQUFJLENBQUNBLENBQUMsQ0FBQ2hVLEdBQXZCLENBQXJCO0FBQ0Q7O0FBRUQsUUFBTWlVLGlCQUFpQixHQUFHSixTQUFTLENBQUN2RSxTQUFWLENBQW9CbkYsTUFBOUMsQ0FwQm1ELENBc0JuRDtBQUNBOztBQUNBLE1BQ0U0SixZQUFZLENBQUM1SixNQUFiLEdBQXNCLENBQXRCLElBQ0EwSixTQUFTLENBQUM1RSxjQUFWLElBQTRCLENBRDVCLElBRUEsQ0FBQzRFLFNBQVMsQ0FBQ0wsZ0JBSGIsRUFJRTtBQUNBLFVBQU1VLFdBQVcsR0FBRy9TLFlBQVksQ0FBQ2hELE9BQWIsQ0FBcUIwVixTQUFTLENBQUNsRixhQUEvQixDQUFwQjs7QUFDQSxRQUFJdUYsV0FBVyxDQUFDQyxXQUFaLEtBQTRCLE9BQWhDLEVBQXlDO0FBQ3ZDalQsaUJBQVcsQ0FBQ3dJLE1BQVosQ0FBbUJtSyxTQUFTLENBQUN6VixHQUE3QixFQUFrQztBQUNoQzJLLFlBQUksRUFBRTtBQUFFeUssMEJBQWdCLEVBQUUsSUFBSXRRLElBQUo7QUFBcEI7QUFEMEIsT0FBbEM7QUFHRDtBQUNGLEdBbkNrRCxDQXFDbkQ7QUFDQTs7O0FBQ0EsTUFBSTZRLFlBQVksQ0FBQzVKLE1BQWIsS0FBd0IsQ0FBeEIsSUFBNkIwSixTQUFTLENBQUNMLGdCQUEzQyxFQUE2RDtBQUMzRCxVQUFNVSxXQUFXLEdBQUcvUyxZQUFZLENBQUNoRCxPQUFiLENBQXFCMFYsU0FBUyxDQUFDbEYsYUFBL0IsQ0FBcEI7O0FBQ0EsUUFBSXVGLFdBQVcsQ0FBQ0MsV0FBWixLQUE0QixPQUFoQyxFQUF5QztBQUN2Q2pULGlCQUFXLENBQUN3SSxNQUFaLENBQW1CbUssU0FBUyxDQUFDelYsR0FBN0IsRUFBa0M7QUFDaEM0SyxjQUFNLEVBQUU7QUFBRXdLLDBCQUFnQixFQUFFO0FBQXBCO0FBRHdCLE9BQWxDO0FBR0Q7QUFDRixHQTlDa0QsQ0FnRG5EOzs7QUFDQSxNQUFJUyxpQkFBaUIsR0FBR0osU0FBUyxDQUFDNUUsY0FBbEMsRUFBa0Q7QUFDaEQ7QUFDRCxHQW5Ea0QsQ0FxRG5EOzs7QUFDQSxNQUFJdFIsS0FBSyxDQUFDdUosSUFBTixDQUFXO0FBQUVxSSxlQUFXLEVBQUVzRSxTQUFTLENBQUN6VjtBQUF6QixHQUFYLEVBQTJDK0ksS0FBM0MsS0FBcUQsQ0FBekQsRUFBNEQ7QUFDMUQ7QUFDRCxHQXhEa0QsQ0EwRG5EOzs7QUFDQXVNLHFCQUFtQixDQUFDRyxTQUFELENBQW5CO0FBQ0QsQ0E3REgsRUE4REU7QUFBRW5ELGVBQWEsRUFBRTtBQUFqQixDQTlERixFOzs7Ozs7Ozs7OztBQ3pCQTVULE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNxWCxxQkFBbUIsRUFBQyxNQUFJQSxtQkFBekI7QUFBNkNDLG9CQUFrQixFQUFDLE1BQUlBO0FBQXBFLENBQWQ7QUFBdUcsSUFBSTVXLE1BQUo7QUFBV1gsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0ssVUFBTSxHQUFDTCxDQUFQO0FBQVM7O0FBQXJCLENBQTlCLEVBQXFELENBQXJEO0FBQXdELElBQUkyVCxlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUYsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0JBQVosRUFBNkI7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUE3QixFQUE2RCxDQUE3RDtBQUFnRSxJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFqQyxFQUF5RCxDQUF6RDtBQUE0RCxJQUFJNEQsT0FBSjtBQUFZbEUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQytELFNBQU8sQ0FBQzVELENBQUQsRUFBRztBQUFDNEQsV0FBTyxHQUFDNUQsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQVE1ZixNQUFNZ1gsbUJBQW1CLEdBQUcsSUFBSXJELGVBQUosQ0FBb0I7QUFDckRqVCxNQUFJLEVBQUUsZ0NBRCtDO0FBR3JEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCcVMsZUFBVyxFQUFFO0FBQ1hsTixVQUFJLEVBQUVDLE1BREs7QUFFWEUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGZixLQURZO0FBS3pCdEQsT0FBRyxFQUFFO0FBQ0hpRCxVQUFJLEVBQUVDO0FBREgsS0FMb0I7QUFRekIyRSxTQUFLLEVBQUU7QUFDTDVFLFVBQUksRUFBRUM7QUFERCxLQVJrQjtBQVd6QmdTLFVBQU0sRUFBRTtBQUNOalMsVUFBSSxFQUFFZ0IsT0FEQTtBQUVOZCxjQUFRLEVBQUU7QUFGSixLQVhpQjtBQWV6QmdTLGNBQVUsRUFBRTtBQUNWbFMsVUFBSSxFQUFFZ0IsT0FESTtBQUVWZCxjQUFRLEVBQUU7QUFGQTtBQWZhLEdBQWpCLEVBbUJQMk8sU0FuQk8sRUFIMkM7O0FBd0JyREMsS0FBRyxPQUFrRDtBQUFBLFFBQWpEO0FBQUU1QixpQkFBRjtBQUFlblEsU0FBZjtBQUFvQjZILFdBQXBCO0FBQTJCcU4sWUFBM0I7QUFBbUNDO0FBQW5DLEtBQWlEO0FBQ25ELFVBQU1WLFNBQVMsR0FBRzNTLFdBQVcsQ0FBQy9DLE9BQVosQ0FBb0JvUixXQUFwQixDQUFsQjs7QUFDQSxRQUFJLENBQUNzRSxTQUFMLEVBQWdCO0FBQ2QsWUFBTSxJQUFJclUsS0FBSixDQUFVLHdCQUFWLENBQU47QUFDRCxLQUprRCxDQUtuRDs7O0FBRUEsVUFBTXdILEdBQUcsR0FBR2xCLElBQUksQ0FBQzBPLEtBQUwsQ0FBV3ZOLEtBQVgsQ0FBWjtBQUNBLFFBQUl5QyxNQUFNLEdBQUc7QUFBRSxzQkFBU3RLLEdBQVQsSUFBaUI0SDtBQUFuQixLQUFiO0FBQ0EsVUFBTTZJLFFBQVEsR0FBR3lFLE1BQU0sR0FBRztBQUFFRyxXQUFLLEVBQUUvSztBQUFULEtBQUgsR0FBdUI7QUFBRVgsVUFBSSxFQUFFVztBQUFSLEtBQTlDO0FBRUF4SSxlQUFXLENBQUN3SSxNQUFaLENBQW1CNkYsV0FBbkIsRUFBZ0NNLFFBQWhDLEVBQTBDO0FBQ3hDdUIsaUJBQVcsRUFBRSxLQUQyQjtBQUV4Q0MsWUFBTSxFQUFFLEtBRmdDO0FBR3hDTCxjQUFRLEVBQUUsS0FIOEI7QUFJeEMwRCxpQkFBVyxFQUFFLEtBSjJCO0FBS3hDQyx3QkFBa0IsRUFBRTtBQUxvQixLQUExQzs7QUFRQSxRQUFJM1AsTUFBTSxDQUFDNFAsUUFBUCxJQUFtQixDQUFDTCxVQUF4QixFQUFvQztBQUNsQzlXLFlBQU0sQ0FBQ0gsWUFBUCxDQUFvQjtBQUNsQnVYLFlBQUksRUFBRSxLQUFLQyxVQURPO0FBRWxCdkYsbUJBRmtCO0FBR2xCc0UsaUJBSGtCO0FBSWxCelUsV0FKa0I7QUFLbEI2SCxhQUFLLEVBQUVELEdBTFc7QUFNbEIrTixpQkFBUyxFQUFFbEIsU0FBUyxDQUFDNVAsSUFBVixJQUFrQjRQLFNBQVMsQ0FBQzVQLElBQVYsQ0FBZTdFLEdBQWYsQ0FOWDtBQU9sQmtWO0FBUGtCLE9BQXBCO0FBU0Q7QUFDRjs7QUF0RG9ELENBQXBCLENBQTVCO0FBeURBLE1BQU1ELGtCQUFrQixHQUFHLElBQUl0RCxlQUFKLENBQW9CO0FBQ3BEalQsTUFBSSxFQUFFLCtCQUQ4QztBQUdwRGtULFVBQVEsRUFBRSxJQUFJOVQsWUFBSixDQUFpQjtBQUN6QjhYLGNBQVUsRUFBRTtBQUNWN1IsV0FBSyxFQUFFLGlCQURHO0FBRVZkLFVBQUksRUFBRUMsTUFGSTtBQUdWRSxXQUFLLEVBQUU7QUFIRyxLQURhO0FBTXpCK00sZUFBVyxFQUFFO0FBQ1hsTixVQUFJLEVBQUVDLE1BREs7QUFFWEUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGZixLQU5ZO0FBVXpCNUQsVUFBTSxFQUFFO0FBQ05xRSxXQUFLLEVBQUUsNkJBREQ7QUFFTmQsVUFBSSxFQUFFQyxNQUZBO0FBR05FLFdBQUssRUFBRSxlQUhEO0FBSU5ELGNBQVEsRUFBRTtBQUpKO0FBVmlCLEdBQWpCLEVBZ0JQMk8sU0FoQk8sRUFIMEM7O0FBcUJwREMsS0FBRyxRQUFzQztBQUFBLFFBQXJDO0FBQUU2RCxnQkFBRjtBQUFjekYsaUJBQWQ7QUFBMkJ6UTtBQUEzQixLQUFxQzs7QUFDdkMsUUFBSSxDQUFDa0csTUFBTSxDQUFDNFAsUUFBWixFQUFzQjtBQUNwQjtBQUNEOztBQUVELFVBQU1mLFNBQVMsR0FBRzNTLFdBQVcsQ0FBQy9DLE9BQVosQ0FBb0JvUixXQUFwQixDQUFsQjtBQUNBLFVBQU1nQixVQUFVLEdBQUd6UixNQUFNLElBQUksUUFBN0I7O0FBQ0EsUUFBSSxDQUFDK1UsU0FBTCxFQUFnQjtBQUNkLFlBQU0sSUFBSXJVLEtBQUosQ0FBVSxxQkFBVixDQUFOO0FBQ0Q7O0FBRUQrQixXQUFPLENBQUNtSSxNQUFSLENBQ0U7QUFBRTZGO0FBQUYsS0FERixFQUVFO0FBQ0V4RyxVQUFJLEVBQUU7QUFDSnNILGNBQU0sRUFBRSxJQUFJbk4sSUFBSixFQURKO0FBRUpxTixrQkFBVSxFQUFFQSxVQUZSO0FBR0p5RTtBQUhJO0FBRFIsS0FGRjtBQVdBOVQsZUFBVyxDQUFDd0ksTUFBWixDQUFtQjZGLFdBQW5CLEVBQWdDO0FBQzlCeEcsVUFBSSxFQUFFO0FBQ0pqSyxjQUFNLEVBQUV5UixVQURKO0FBRUoxUixpQkFBUyxFQUFFbVc7QUFGUDtBQUR3QixLQUFoQztBQU9BLFVBQU01RyxLQUFLLEdBQUdwTixPQUFPLENBQUM3QyxPQUFSLENBQWdCMFYsU0FBUyxDQUFDOUUsT0FBMUIsQ0FBZDtBQUNBLFVBQU1rRyxjQUFjLEdBQUcvVCxXQUFXLENBQUMvQyxPQUFaLENBQW9CO0FBQ3pDK1csVUFBSSxFQUFFLENBQ0o7QUFDRTlXLFdBQUcsRUFBRTtBQUFFZ1MsYUFBRyxFQUFFaEMsS0FBSyxDQUFDUztBQUFiO0FBRFAsT0FESSxFQUlKO0FBQUUvUCxjQUFNLEVBQUU7QUFBRXNSLGFBQUcsRUFBRSxDQUFDLE1BQUQsRUFBUyxTQUFUO0FBQVA7QUFBVixPQUpJO0FBRG1DLEtBQXBCLENBQXZCLENBOUJ1QyxDQXVDdkM7O0FBQ0EsUUFBSSxDQUFDNkUsY0FBTCxFQUFxQjtBQUNuQmpVLGFBQU8sQ0FBQzBJLE1BQVIsQ0FDRTtBQUFFbUYsb0JBQVksRUFBRVU7QUFBaEIsT0FERixFQUVFO0FBQUV4RyxZQUFJLEVBQUU7QUFBRWpLLGdCQUFNLEVBQUV5UixVQUFWO0FBQXNCbFMsb0JBQVUsRUFBRSxJQUFJNkUsSUFBSjtBQUFsQztBQUFSLE9BRkY7QUFJRDtBQUNGOztBQW5FbUQsQ0FBcEIsQ0FBM0IsQzs7Ozs7Ozs7Ozs7QUNqRVAsSUFBSWlTLE1BQUo7QUFBV3JZLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQytYLFVBQU0sR0FBQy9YLENBQVA7QUFBUzs7QUFBckIsQ0FBckIsRUFBNEMsQ0FBNUM7QUFBK0MsSUFBSThELFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQWpDLEVBQWlFLENBQWpFO0FBQW9FLElBQUkrRCxZQUFKO0FBQWlCckUsTUFBTSxDQUFDRyxJQUFQLENBQVksbUNBQVosRUFBZ0Q7QUFBQ2tFLGNBQVksQ0FBQy9ELENBQUQsRUFBRztBQUFDK0QsZ0JBQVksR0FBQy9ELENBQWI7QUFBZTs7QUFBaEMsQ0FBaEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBdkMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSXNXLG1CQUFKO0FBQXdCNVcsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3lXLHFCQUFtQixDQUFDdFcsQ0FBRCxFQUFHO0FBQUNzVyx1QkFBbUIsR0FBQ3RXLENBQXBCO0FBQXNCOztBQUE5QyxDQUFwQyxFQUFvRixDQUFwRjtBQUF1RixJQUFJZ1ksSUFBSjtBQUFTdFksTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ2dZLFFBQUksR0FBQ2hZLENBQUw7QUFBTzs7QUFBbkIsQ0FBOUMsRUFBbUUsQ0FBbkU7O0FBUTFiLE1BQU1pWSxpQkFBaUIsR0FBRyxDQUFDOVcsR0FBRCxFQUFNK1csS0FBTixFQUFhcEIsV0FBYixLQUE2QjtBQUNyRDtBQUNBLE1BQUksQ0FBQ29CLEtBQUssQ0FBQzlCLGdCQUFYLEVBQTZCO0FBQzNCO0FBQ0Q7O0FBRUQsUUFBTStCLEdBQUcsR0FBR0osTUFBTSxFQUFsQjtBQUNBLFFBQU1LLFdBQVcsR0FBR0wsTUFBTSxDQUFDRyxLQUFLLENBQUM5QixnQkFBUCxDQUExQjtBQUNBLFFBQU1pQyxTQUFTLEdBQUdELFdBQVcsQ0FBQ0UsR0FBWixDQUFnQnhCLFdBQVcsQ0FBQ3lCLGdCQUE1QixFQUE4QyxTQUE5QyxDQUFsQjtBQUNBLFFBQU1DLEtBQUssR0FBR0wsR0FBRyxDQUFDTSxhQUFKLENBQWtCSixTQUFsQixDQUFkOztBQUVBLE1BQUksQ0FBQ0csS0FBTCxFQUFZO0FBQ1Y7QUFDRDs7QUFFRCxVQUFRMUIsV0FBVyxDQUFDNEIsZUFBcEI7QUFDRSxTQUFLLE1BQUw7QUFDRTVVLGlCQUFXLENBQUN3SSxNQUFaLENBQW1CNEwsS0FBSyxDQUFDbFgsR0FBekIsRUFBOEI7QUFDNUIySyxZQUFJLEVBQUU7QUFBRTBLLG9CQUFVLEVBQUUsSUFBSXZRLElBQUosRUFBZDtBQUEwQnBFLGdCQUFNLEVBQUU7QUFBbEM7QUFEc0IsT0FBOUI7QUFHQXlDLGFBQU8sQ0FBQ21JLE1BQVIsQ0FDRTtBQUFFdEwsV0FBRyxFQUFFO0FBQUVnUyxhQUFHLEVBQUVrRixLQUFLLENBQUMzRjtBQUFiO0FBQVAsT0FERixFQUVFO0FBQ0U1RyxZQUFJLEVBQUU7QUFDSndILG9CQUFVLEVBQUUsbUJBRFI7QUFFSkYsZ0JBQU0sRUFBRSxJQUFJbk4sSUFBSjtBQUZKO0FBRFIsT0FGRixFQVFFO0FBQUU2TSxhQUFLLEVBQUU7QUFBVCxPQVJGO0FBVUE7O0FBQ0YsU0FBSyxRQUFMO0FBQ0UyRCx5QkFBbUIsQ0FBQzRCLEtBQUQsQ0FBbkI7QUFDQTtBQUVGO0FBRUE7QUFDQTs7QUFFQTtBQUNFL1csU0FBRyxDQUFDRyxLQUFKLGdEQUMwQ3dWLFdBQVcsQ0FBQzRCLGVBRHREO0FBMUJKO0FBOEJELENBN0NEOztBQStDQSxNQUFNQyxzQkFBc0IsR0FBRyxDQUFDeFgsR0FBRCxFQUFNK1csS0FBTixFQUFhcEIsV0FBYixLQUE2QjtBQUMxRCxRQUFNcUIsR0FBRyxHQUFHSixNQUFNLEVBQWxCO0FBQ0E1VCxTQUFPLENBQUMyRixJQUFSLENBQWE7QUFBRTlJLE9BQUcsRUFBRTtBQUFFZ1MsU0FBRyxFQUFFa0YsS0FBSyxDQUFDaEc7QUFBYjtBQUFQLEdBQWIsRUFBZ0QzUCxPQUFoRCxDQUF3RHFXLE1BQU0sSUFBSTtBQUNoRSxVQUFNUixXQUFXLEdBQUdMLE1BQU0sQ0FBQ2EsTUFBTSxDQUFDeEMsZ0JBQVIsQ0FBMUI7QUFDQSxVQUFNaUMsU0FBUyxHQUFHRCxXQUFXLENBQUNFLEdBQVosQ0FBZ0J4QixXQUFXLENBQUN5QixnQkFBNUIsRUFBOEMsU0FBOUMsQ0FBbEI7QUFDQSxVQUFNQyxLQUFLLEdBQUdMLEdBQUcsQ0FBQ00sYUFBSixDQUFrQkosU0FBbEIsQ0FBZDs7QUFDQSxRQUFJLENBQUNHLEtBQUQsSUFBVUksTUFBTSxDQUFDQyxnQkFBUCxJQUEyQi9CLFdBQVcsQ0FBQ2dDLFdBQXJELEVBQWtFO0FBQ2hFO0FBQ0Q7O0FBQ0QzVSxXQUFPLENBQUNtSSxNQUFSLENBQWVzTSxNQUFNLENBQUM1WCxHQUF0QixFQUEyQjtBQUN6QjJLLFVBQUksRUFBRTtBQUNKd0gsa0JBQVUsRUFBRSxxQkFEUjtBQUVKRixjQUFNLEVBQUUsSUFBSW5OLElBQUo7QUFGSjtBQURtQixLQUEzQjtBQU1BaEMsZUFBVyxDQUFDd0ksTUFBWixDQUFtQjRMLEtBQUssQ0FBQ2xYLEdBQXpCLEVBQThCO0FBQzVCK1gsV0FBSyxFQUFFO0FBQ0w3RyxpQkFBUyxFQUFFMEcsTUFBTSxDQUFDNVgsR0FEYixDQUVMO0FBQ0E7QUFDQTs7QUFKSztBQURxQixLQUE5QjtBQVFELEdBckJEO0FBc0JELENBeEJEOztBQTBCQWdYLElBQUksQ0FBQ00sR0FBTCxDQUFTO0FBQ1A1WCxNQUFJLEVBQUUsc0JBREM7QUFFUHNZLFVBQVEsRUFBRSxJQUZIO0FBR1BDLE1BQUksRUFBRSxVQUFTOVgsR0FBVCxFQUFjO0FBQ2xCLFVBQU1rTCxLQUFLLEdBQUc7QUFDWjNLLFlBQU0sRUFBRSxTQURJO0FBRVpGLFlBQU0sRUFBRTtBQUFFMFIsZUFBTyxFQUFFO0FBQVgsT0FGSTtBQUdabUQsZ0JBQVUsRUFBRTtBQUFFbkQsZUFBTyxFQUFFO0FBQVg7QUFIQSxLQUFkO0FBTUFwUCxlQUFXLENBQUNnRyxJQUFaLENBQWlCdUMsS0FBakIsRUFBd0I5SixPQUF4QixDQUFnQzJWLEtBQUssSUFBSTtBQUN2QyxZQUFNcEIsV0FBVyxHQUFHL1MsWUFBWSxDQUFDaEQsT0FBYixDQUFxQm1YLEtBQUssQ0FBQzNHLGFBQTNCLENBQXBCOztBQUVBLGNBQVF1RixXQUFXLENBQUNDLFdBQXBCO0FBQ0UsYUFBSyxPQUFMO0FBQ0VrQiwyQkFBaUIsQ0FBQzlXLEdBQUQsRUFBTStXLEtBQU4sRUFBYXBCLFdBQWIsQ0FBakI7QUFDQTs7QUFDRixhQUFLLFlBQUw7QUFDRTZCLGdDQUFzQixDQUFDeFgsR0FBRCxFQUFNK1csS0FBTixFQUFhcEIsV0FBYixDQUF0QjtBQUNBOztBQUNGO0FBQ0UzVixhQUFHLENBQUNHLEtBQUosNENBQ3NDd1YsV0FBVyxDQUFDQyxXQURsRDtBQVJKO0FBWUQsS0FmRDtBQWdCRDtBQTFCTSxDQUFULEU7Ozs7Ozs7Ozs7O0FDakZBLElBQUltQyxnQkFBSjtBQUFxQnhaLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNxWixrQkFBZ0IsQ0FBQ2xaLENBQUQsRUFBRztBQUFDa1osb0JBQWdCLEdBQUNsWixDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBL0MsRUFBeUYsQ0FBekY7QUFBNEYsSUFBSTZELE9BQUo7QUFBWW5FLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNnRSxTQUFPLENBQUM3RCxDQUFELEVBQUc7QUFBQzZELFdBQU8sR0FBQzdELENBQVI7QUFBVTs7QUFBdEIsQ0FBdkMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSStELFlBQUo7QUFBaUJyRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDa0UsY0FBWSxDQUFDL0QsQ0FBRCxFQUFHO0FBQUMrRCxnQkFBWSxHQUFDL0QsQ0FBYjtBQUFlOztBQUFoQyxDQUFuRCxFQUFxRixDQUFyRjtBQUF3RixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJc0UsVUFBSjtBQUFlNUUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUExQyxFQUF3RSxDQUF4RTtBQUEyRSxJQUFJOEQsV0FBSjtBQUFnQnBFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNpRSxhQUFXLENBQUM5RCxDQUFELEVBQUc7QUFBQzhELGVBQVcsR0FBQzlELENBQVo7QUFBYzs7QUFBOUIsQ0FBOUIsRUFBOEQsQ0FBOUQ7QUFPN2RrWixnQkFBZ0IsQ0FBQyxXQUFELEVBQWMsZ0JBQXVCO0FBQUEsTUFBZDtBQUFFNUc7QUFBRixHQUFjO0FBQ25ELFNBQU87QUFDTHhJLFFBQUksR0FBRztBQUNMLGFBQU8zRixPQUFPLENBQUMyRixJQUFSLENBQWF3SSxRQUFiLENBQVA7QUFDRCxLQUhJOztBQUtMNkcsWUFBUSxFQUFFLENBQ1I7QUFDRXJQLFVBQUksUUFBa0I7QUFBQSxZQUFqQjtBQUFFcUk7QUFBRixTQUFpQjtBQUNwQixlQUFPck8sV0FBVyxDQUFDZ0csSUFBWixDQUFpQjtBQUN0QjlJLGFBQUcsRUFBRW1SO0FBRGlCLFNBQWpCLENBQVA7QUFHRCxPQUxIOztBQU1FZ0gsY0FBUSxFQUFFLENBQ1I7QUFDRXJQLFlBQUksUUFBa0I7QUFBQSxjQUFqQjtBQUFFd0g7QUFBRixXQUFpQjtBQUNwQixpQkFBT2hOLFVBQVUsQ0FBQ3dGLElBQVgsQ0FBZ0J3SCxXQUFoQixDQUFQO0FBQ0QsU0FISDs7QUFJRTZILGdCQUFRLEVBQUUsQ0FDUjtBQUNFclAsY0FBSSxRQUFnQjtBQUFBLGdCQUFmO0FBQUU0QztBQUFGLGFBQWU7QUFDbEIsbUJBQU83SSxPQUFPLENBQUNpRyxJQUFSLENBQWE7QUFBRTlJLGlCQUFHLEVBQUU7QUFBRWdTLG1CQUFHLEVBQUV0RztBQUFQO0FBQVAsYUFBYixDQUFQO0FBQ0Q7O0FBSEgsU0FEUTtBQUpaLE9BRFEsRUFhUjtBQUNFNUMsWUFBSSxRQUFvQjtBQUFBLGNBQW5CO0FBQUV5SDtBQUFGLFdBQW1CO0FBQ3RCLGlCQUFPeE4sWUFBWSxDQUFDK0YsSUFBYixDQUFrQnlILGFBQWxCLENBQVA7QUFDRDs7QUFISCxPQWJRO0FBTlosS0FEUTtBQUxMLEdBQVA7QUFrQ0QsQ0FuQ2UsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNQQTdSLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUN5WixtQkFBaUIsRUFBQyxNQUFJQTtBQUF2QixDQUFkO0FBQXlELElBQUkvVSxNQUFKO0FBQVczRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDd0UsUUFBTSxDQUFDckUsQ0FBRCxFQUFHO0FBQUNxRSxVQUFNLEdBQUNyRSxDQUFQO0FBQVM7O0FBQXBCLENBQS9CLEVBQXFELENBQXJEO0FBQXdELElBQUlxWix1QkFBSjtBQUE0QjNaLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUN3Wix5QkFBdUIsQ0FBQ3JaLENBQUQsRUFBRztBQUFDcVosMkJBQXVCLEdBQUNyWixDQUF4QjtBQUEwQjs7QUFBdEQsQ0FBdkMsRUFBK0YsQ0FBL0Y7QUFBa0csSUFBSW9FLE1BQUo7QUFBVzFFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUN1RSxRQUFNLENBQUNwRSxDQUFELEVBQUc7QUFBQ29FLFVBQU0sR0FBQ3BFLENBQVA7QUFBUzs7QUFBcEIsQ0FBL0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBakMsRUFBeUQsQ0FBekQ7O0FBS2xVLE1BQU1vWixpQkFBaUIsR0FBRyxVQU8zQjtBQUFBLE1BUDRCO0FBQ2hDdFksUUFEZ0M7QUFFaENxUSxhQUZnQztBQUdoQ21JLFNBQUssR0FBRzFULFNBSHdCO0FBSWhDMlQsU0FBSyxHQUFHM1QsU0FKd0I7QUFLaEM0VCxnQkFBWSxHQUFHNVQsU0FMaUI7QUFNaEM2VCxrQkFBYyxHQUFHN1Q7QUFOZSxHQU81QjtBQUNKLE1BQUk4VCxhQUFhLEdBQUcsSUFBcEI7QUFBQSxNQUNFQyxXQUFXLEdBQUcsSUFEaEI7QUFBQSxNQUVFQyxVQUFVLEdBQUcsSUFGZjtBQUFBLE1BR0VDLFVBQVUsR0FBRyxJQUhmO0FBS0FyWCxRQUFNLENBQUNzWCxnQkFBUCxDQUF3QmhaLElBQXhCLEVBQThCO0FBQzVCcVEsYUFBUyxFQUFFO0FBQ1Q0SSxTQUFHLEdBQUc7QUFDSixZQUFJLENBQUNMLGFBQUwsRUFBb0I7QUFDbEJBLHVCQUFhLEdBQUd2SSxTQUFTLENBQUM2SSxhQUFWLEVBQWhCO0FBQ0Q7O0FBRUQsZUFBT04sYUFBUDtBQUNEOztBQVBRLEtBRGlCO0FBVTVCckcsV0FBTyxFQUFFO0FBQ1AwRyxTQUFHLEdBQUc7QUFDSixZQUFJLENBQUNKLFdBQUwsRUFBa0I7QUFDaEJBLHFCQUFXLEdBQUd4VixPQUFPLENBQUMyRixJQUFSLENBQWE7QUFBRTlJLGVBQUcsRUFBRTtBQUFFZ1MsaUJBQUcsRUFBRWxTLElBQUksQ0FBQ29SO0FBQVo7QUFBUCxXQUFiLEVBQStDN0UsS0FBL0MsRUFBZDs7QUFFQSxjQUFJbU0sWUFBSixFQUFrQjtBQUNoQkYsaUJBQUssR0FBR2xWLE1BQU0sQ0FBQ3JELE9BQVAsQ0FBZXlZLFlBQWYsQ0FBUjtBQUNBRCxpQkFBSyxHQUFHRCxLQUFLLENBQUNXLE1BQU4sQ0FBYW5RLElBQWIsQ0FBa0JvUSxDQUFDLElBQUlBLENBQUMsQ0FBQ2xaLEdBQUYsS0FBVXlZLGNBQWpDLENBQVI7QUFDRDs7QUFFREUscUJBQVcsQ0FBQ3BYLE9BQVosQ0FBb0JxVyxNQUFNLElBQUk7QUFDNUJBLGtCQUFNLENBQUNVLEtBQVAsR0FBZXpNLENBQUMsQ0FBQytELE1BQUYsQ0FBUyxFQUFULEVBQWEwSSxLQUFiLENBQWY7QUFDQVYsa0JBQU0sQ0FBQ1csS0FBUCxHQUFlMU0sQ0FBQyxDQUFDK0QsTUFBRixDQUFTLEVBQVQsRUFBYTJJLEtBQWIsQ0FBZjtBQUNBRixtQ0FBdUIsQ0FBQ1QsTUFBRCxFQUFTQSxNQUFNLENBQUNXLEtBQWhCLEVBQXVCWCxNQUFNLENBQUNVLEtBQTlCLEVBQXFDeFksSUFBckMsQ0FBdkI7QUFDRCxXQUpEO0FBS0Q7O0FBRUQsZUFBTzZZLFdBQVA7QUFDRDs7QUFsQk0sS0FWbUI7QUE4QjVCUSxVQUFNLEVBQUU7QUFDTkosU0FBRyxHQUFHO0FBQ0osWUFBSSxDQUFDSCxVQUFMLEVBQWlCO0FBQ2ZBLG9CQUFVLEdBQUd4VixNQUFNLENBQUMwRixJQUFQLENBQVk7QUFBRXRJLGtCQUFNLEVBQUVWLElBQUksQ0FBQ0U7QUFBZixXQUFaLEVBQWtDcU0sS0FBbEMsRUFBYjtBQUNBdU0sb0JBQVUsQ0FBQ3JYLE9BQVgsQ0FBbUIrVyxLQUFLLElBQUk7QUFDMUIsZ0JBQUlXLE1BQU0sR0FBRyxJQUFiO0FBQ0F6WCxrQkFBTSxDQUFDNFgsY0FBUCxDQUFzQmQsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDckNTLGlCQUFHLEdBQUc7QUFDSixvQkFBSSxDQUFDRSxNQUFMLEVBQWE7QUFDWEEsd0JBQU0sR0FBRzVWLE1BQU0sQ0FBQ3lGLElBQVAsQ0FBWTtBQUFFdVEsMkJBQU8sRUFBRWYsS0FBSyxDQUFDdFk7QUFBakIsbUJBQVosRUFBb0NxTSxLQUFwQyxFQUFUO0FBQ0Q7O0FBRUQsdUJBQU80TSxNQUFQO0FBQ0Q7O0FBUG9DLGFBQXZDO0FBU0QsV0FYRDtBQVlEOztBQUVELGVBQU9MLFVBQVA7QUFDRDs7QUFuQkssS0E5Qm9CO0FBbUQ1QkssVUFBTSxFQUFFO0FBQ05GLFNBQUcsR0FBRztBQUNKLFlBQUksQ0FBQ0YsVUFBTCxFQUFpQjtBQUNmQSxvQkFBVSxHQUFHeFYsTUFBTSxDQUFDeUYsSUFBUCxDQUFZO0FBQUV0SSxrQkFBTSxFQUFFVixJQUFJLENBQUNFO0FBQWYsV0FBWixFQUFrQ3FNLEtBQWxDLEVBQWI7QUFDRDs7QUFFRCxlQUFPd00sVUFBUDtBQUNEOztBQVBLO0FBbkRvQixHQUE5QjtBQTZERCxDQTFFTSxDOzs7Ozs7Ozs7OztBQ0xQLElBQUl2UCxhQUFKOztBQUFrQjVLLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHNDQUFaLEVBQW1EO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNzSyxpQkFBYSxHQUFDdEssQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBbkQsRUFBaUYsQ0FBakY7QUFBbEJOLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUMyVyxxQkFBbUIsRUFBQyxNQUFJQSxtQkFBekI7QUFBNkN4RiwwQkFBd0IsRUFBQyxNQUFJQTtBQUExRSxDQUFkO0FBQW1ILElBQUlpSCxNQUFKO0FBQVdyWSxNQUFNLENBQUNHLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUMrWCxVQUFNLEdBQUMvWCxDQUFQO0FBQVM7O0FBQXJCLENBQXJCLEVBQTRDLENBQTVDO0FBQStDLElBQUk0RCxPQUFKO0FBQVlsRSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDK0QsU0FBTyxDQUFDNUQsQ0FBRCxFQUFHO0FBQUM0RCxXQUFPLEdBQUM1RCxDQUFSO0FBQVU7O0FBQXRCLENBQXBDLEVBQTRELENBQTVEO0FBQStELElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFNBQVosRUFBc0I7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQXRCLEVBQTBDLENBQTFDO0FBQTZDLElBQUlpRSxZQUFKO0FBQWlCdkUsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ29FLGNBQVksQ0FBQ2pFLENBQUQsRUFBRztBQUFDaUUsZ0JBQVksR0FBQ2pFLENBQWI7QUFBZTs7QUFBaEMsQ0FBN0MsRUFBK0UsQ0FBL0U7QUFBa0YsSUFBSWtFLFlBQUo7QUFBaUJ4RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDcUUsY0FBWSxDQUFDbEUsQ0FBRCxFQUFHO0FBQUNrRSxnQkFBWSxHQUFDbEUsQ0FBYjtBQUFlOztBQUFoQyxDQUE3QyxFQUErRSxDQUEvRTtBQUFrRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFqQyxFQUF5RCxDQUF6RDtBQUE0RCxJQUFJb0UsTUFBSjtBQUFXMUUsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUEvQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ3dFLFFBQU0sQ0FBQ3JFLENBQUQsRUFBRztBQUFDcUUsVUFBTSxHQUFDckUsQ0FBUDtBQUFTOztBQUFwQixDQUEvQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJaVgsa0JBQUo7QUFBdUJ2WCxNQUFNLENBQUNHLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDb1gsb0JBQWtCLENBQUNqWCxDQUFELEVBQUc7QUFBQ2lYLHNCQUFrQixHQUFDalgsQ0FBbkI7QUFBcUI7O0FBQTVDLENBQXRDLEVBQW9GLENBQXBGO0FBQXVGLElBQUlxWix1QkFBSixFQUE0QmlCLHFCQUE1QjtBQUFrRDVhLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUN3Wix5QkFBdUIsQ0FBQ3JaLENBQUQsRUFBRztBQUFDcVosMkJBQXVCLEdBQUNyWixDQUF4QjtBQUEwQixHQUF0RDs7QUFBdURzYSx1QkFBcUIsQ0FBQ3RhLENBQUQsRUFBRztBQUFDc2EseUJBQXFCLEdBQUN0YSxDQUF0QjtBQUF3Qjs7QUFBeEcsQ0FBMUMsRUFBb0osRUFBcEo7QUFBd0osSUFBSW9aLGlCQUFKO0FBQXNCMVosTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VaLG1CQUFpQixDQUFDcFosQ0FBRCxFQUFHO0FBQUNvWixxQkFBaUIsR0FBQ3BaLENBQWxCO0FBQW9COztBQUExQyxDQUFsQyxFQUE4RSxFQUE5RTtBQUFrRixJQUFJSixNQUFKO0FBQVdGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsUUFBTSxDQUFDSSxDQUFELEVBQUc7QUFBQ0osVUFBTSxHQUFDSSxDQUFQO0FBQVM7O0FBQXBCLENBQTNCLEVBQWlELEVBQWpEO0FBQXFELElBQUl1YSxjQUFKO0FBQW1CN2EsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQzBhLGdCQUFjLENBQUN2YSxDQUFELEVBQUc7QUFBQ3VhLGtCQUFjLEdBQUN2YSxDQUFmO0FBQWlCOztBQUFwQyxDQUFqQyxFQUF1RSxFQUF2RTtBQUEyRSxJQUFJbUIsR0FBSjtBQUFRekIsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ21CLE9BQUcsR0FBQ25CLENBQUo7QUFBTTs7QUFBbEIsQ0FBL0IsRUFBbUQsRUFBbkQ7QUFBdUQsSUFBSXlELGFBQUo7QUFBa0IvRCxNQUFNLENBQUNHLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDeUQsaUJBQWEsR0FBQ3pELENBQWQ7QUFBZ0I7O0FBQTVCLENBQXRDLEVBQW9FLEVBQXBFO0FBdUJuN0MsTUFBTXdhLGNBQWMsMllBQXBCOztBQWFPLE1BQU1sRSxtQkFBbUIsR0FBR0csU0FBUyxJQUFJO0FBQzlDLE1BQUlsVyxLQUFLLENBQUN1SixJQUFOLENBQVc7QUFBRXFJLGVBQVcsRUFBRXNFLFNBQVMsQ0FBQ3pWO0FBQXpCLEdBQVgsRUFBMkMrSSxLQUEzQyxLQUFxRCxDQUF6RCxFQUE0RDtBQUMxRDtBQUNEOztBQUVELFFBQU1zSixPQUFPLEdBQUdvRCxTQUFTLENBQUNwRCxPQUFWLEVBQWhCO0FBRUEsUUFBTXJDLEtBQUssR0FBR3lGLFNBQVMsQ0FBQ3pGLEtBQVYsRUFBZDtBQUNBLFFBQU1HLFNBQVMsR0FBR3NGLFNBQVMsQ0FBQ3RGLFNBQVYsRUFBbEI7QUFDQSxRQUFNN0YsT0FBTyxHQUFHNkYsU0FBUyxDQUFDNkksYUFBVixFQUFoQjtBQUNBLFFBQU07QUFBRXJJLFdBQUY7QUFBV0wsZUFBWDtBQUF3QjVQLFVBQXhCO0FBQWdDc0U7QUFBaEMsTUFBOEN5USxTQUFwRDtBQUVBcEQsU0FBTyxDQUFDOVEsT0FBUixDQUFnQnFXLE1BQU0sSUFBSTtBQUN4QkEsVUFBTSxDQUFDL1IsSUFBUCxHQUFjK1IsTUFBTSxDQUFDL1IsSUFBUCxJQUFlLEVBQTdCOztBQUNBK1IsVUFBTSxDQUFDNkIsR0FBUCxHQUFhLENBQUN6WSxHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQzNCK08sWUFBTSxDQUFDL1IsSUFBUCxDQUFZN0UsR0FBWixJQUFtQjZILEtBQW5CO0FBQ0QsS0FGRDs7QUFHQStPLFVBQU0sQ0FBQ21CLEdBQVAsR0FBYS9YLEdBQUcsSUFBSTtBQUNsQixhQUFPNFcsTUFBTSxDQUFDL1IsSUFBUCxDQUFZN0UsR0FBWixDQUFQO0FBQ0QsS0FGRDtBQUdELEdBUkQsRUFaOEMsQ0FzQjlDO0FBQ0E7O0FBQ0EsUUFBTXdLLE1BQU0sR0FBRztBQUFFM0YsUUFBSSxvQkFBTzRQLFNBQVMsQ0FBQzVQLElBQWpCLENBQU47QUFBK0JzVCxVQUFNLEVBQUUsRUFBdkM7QUFBMkM5RztBQUEzQyxHQUFmO0FBQ0EsTUFBSXFILGFBQWEsR0FBRztBQUNsQnJILFdBRGtCO0FBRWxCbEMsYUFBUyxFQUFFN0YsT0FGTzs7QUFJbEJ5TyxPQUFHLENBQUNZLENBQUQsRUFBSTtBQUNMLGFBQU9uTyxNQUFNLENBQUMzRixJQUFQLENBQVk4VCxDQUFaLENBQVA7QUFDRCxLQU5pQjs7QUFRbEJGLE9BQUcsQ0FBQ0UsQ0FBRCxFQUFJM2EsQ0FBSixFQUFPO0FBQ1J3TSxZQUFNLENBQUMzRixJQUFQLENBQVk4VCxDQUFaLElBQWlCM2EsQ0FBakI7QUFDRCxLQVZpQjs7QUFZbEI0YSxZQUFRLENBQUN2RyxLQUFELEVBQVE7QUFDZCxZQUFNeE4sSUFBSSxHQUFHd04sS0FBSyxHQUFHQSxLQUFLLENBQUN4TixJQUFULEdBQWdCLE1BQU0sRUFBeEM7QUFDQSxZQUFNeVMsS0FBSyxHQUFHO0FBQUV6UyxZQUFGO0FBQVFvVCxjQUFNLEVBQUU7QUFBaEIsT0FBZDtBQUNBek4sWUFBTSxDQUFDMk4sTUFBUCxDQUFjN00sSUFBZCxDQUFtQmdNLEtBQW5CO0FBQ0EsYUFBTztBQUNMUyxXQUFHLENBQUNZLENBQUQsRUFBSTtBQUNMLGlCQUFPckIsS0FBSyxDQUFDelMsSUFBTixDQUFXOFQsQ0FBWCxDQUFQO0FBQ0QsU0FISTs7QUFLTEYsV0FBRyxDQUFDRSxDQUFELEVBQUkzYSxDQUFKLEVBQU87QUFDUnNaLGVBQUssQ0FBQ3pTLElBQU4sQ0FBVzhULENBQVgsSUFBZ0IzYSxDQUFoQjtBQUNELFNBUEk7O0FBU0w2YSxnQkFBUSxPQUFzRDtBQUFBLGNBQXJEO0FBQUVuYSxnQkFBRjtBQUFRb2EsdUJBQVI7QUFBcUJDLDZCQUFyQjtBQUF3Q2xVLGdCQUFJLEdBQUc7QUFBL0MsV0FBcUQ7O0FBQzVELGNBQUk7QUFDRixnQkFBSSxDQUFDbkcsSUFBRCxJQUFTLENBQUNvYSxXQUFWLElBQXlCLENBQUNDLGlCQUE5QixFQUFpRDtBQUMvQzVaLGlCQUFHLENBQUNHLEtBQUosQ0FBVWtaLGNBQVY7QUFDQXJaLGlCQUFHLENBQUNHLEtBQUosZ0JBQ1VvSCxJQUFJLENBQUNDLFNBQUwsQ0FDTjtBQUFFakksb0JBQUY7QUFBUW9hLDJCQUFSO0FBQXFCQztBQUFyQixlQURNLEVBRU4sSUFGTSxFQUdOLElBSE0sQ0FEVjtBQU9BLG9CQUFNLGdCQUFOO0FBQ0Q7O0FBRUQsa0JBQU1DLHNCQUFzQixHQUFHN1ksUUFBUSxDQUFDNFksaUJBQUQsQ0FBdkM7O0FBQ0EsZ0JBQ0VyRyxNQUFNLENBQUN1RyxLQUFQLENBQWFELHNCQUFiLEtBQ0FBLHNCQUFzQixHQUFHLENBRjNCLEVBR0U7QUFDQTlaLHFCQUFPLENBQUNJLEtBQVIsa0ZBQzRFWixJQUQ1RTtBQUdEOztBQUVELGtCQUFNNlksS0FBSyxHQUFHO0FBQ1o3WSxrQkFEWTtBQUVab2EseUJBRlk7QUFHWkMsK0JBQWlCLEVBQUVDO0FBSFAsYUFBZDtBQUtBMUIsaUJBQUssQ0FBQ1csTUFBTixDQUFhM00sSUFBYixtQkFBdUJpTSxLQUF2QjtBQUE4QjFTO0FBQTlCO0FBQ0EscUNBQ0swUyxLQURMO0FBRUVRLGlCQUFHLENBQUNZLENBQUQsRUFBSTtBQUNMLHVCQUFPOVQsSUFBSSxDQUFDOFQsQ0FBRCxDQUFYO0FBQ0QsZUFKSDs7QUFLRUYsaUJBQUcsQ0FBQ0UsQ0FBRCxFQUFJM2EsQ0FBSixFQUFPO0FBQ1I2RyxvQkFBSSxDQUFDOFQsQ0FBRCxDQUFKLEdBQVUzYSxDQUFWO0FBQ0Q7O0FBUEg7QUFTRCxXQXRDRCxDQXNDRSxPQUFPc0IsS0FBUCxFQUFjO0FBQ2QyViw4QkFBa0IsQ0FBQzFWLElBQW5CLENBQXdCO0FBQ3RCcVcsd0JBQVUsRUFBRSxXQURVO0FBRXRCekYseUJBQVcsRUFBRXNFLFNBQVMsQ0FBQ3pWO0FBRkQsYUFBeEI7QUFJRDtBQUNGOztBQXRESSxPQUFQO0FBd0REOztBQXhFaUIsR0FBcEI7O0FBMkVBLE1BQUk7QUFDRnlDLGlCQUFhLENBQUNnVCxTQUFTLENBQUN6VixHQUFYLENBQWIsR0FBK0IsSUFBL0I7QUFDQXBCLFVBQU0sQ0FBQytDLFFBQVAsQ0FBZ0IrWCxhQUFoQixFQUErQnBQLE9BQS9CO0FBQ0QsR0FIRCxDQUdFLE9BQU9qSyxHQUFQLEVBQVk7QUFDWkgsV0FBTyxDQUFDSSxLQUFSO0FBQ0FKLFdBQU8sQ0FBQ0ksS0FBUixDQUFjRCxHQUFkO0FBQ0E0VixzQkFBa0IsQ0FBQzFWLElBQW5CLENBQXdCO0FBQ3RCcVcsZ0JBQVUsRUFBRSxXQURVO0FBRXRCekYsaUJBQVcsRUFBRXNFLFNBQVMsQ0FBQ3pWO0FBRkQsS0FBeEI7QUFJQTtBQUNEOztBQUVELE1BQUksQ0FBQ3dMLE1BQU0sQ0FBQzJOLE1BQVIsSUFBa0IzTixNQUFNLENBQUMyTixNQUFQLENBQWNwTixNQUFkLEtBQXlCLENBQS9DLEVBQWtEO0FBQ2hELFVBQU0sMkNBQU47QUFDRDs7QUFFRFAsUUFBTSxDQUFDMk4sTUFBUCxDQUFjNVgsT0FBZCxDQUFzQitXLEtBQUssSUFBSTtBQUM3QixRQUFJLENBQUNBLEtBQUssQ0FBQ1csTUFBUCxJQUFpQlgsS0FBSyxDQUFDVyxNQUFOLENBQWFsTixNQUFiLEtBQXdCLENBQTdDLEVBQWdEO0FBQzlDLFlBQU0sNENBQU47QUFDRDs7QUFFRHVNLFNBQUssQ0FBQ1csTUFBTixDQUFhMVgsT0FBYixDQUFxQixXQUE4QztBQUFBLFVBQTdDO0FBQUU3QixZQUFGO0FBQVFvYSxtQkFBUjtBQUFxQkM7QUFBckIsT0FBNkM7O0FBQ2pFO0FBQ0EsVUFBSSxDQUFDcmEsSUFBRCxJQUFTLENBQUNvYSxXQUFWLElBQXlCLENBQUNDLGlCQUE5QixFQUFpRDtBQUMvQzVaLFdBQUcsQ0FBQ0csS0FBSixDQUFVa1osY0FBVjtBQUNBLGNBQU0sZUFBTjtBQUNEO0FBQ0YsS0FORDtBQU9ELEdBWkQsRUFySDhDLENBbUk5Qzs7QUFDQWhPLFFBQU0sQ0FBQ3hHLFNBQVAsR0FBbUJBLFNBQW5CLENBcEk4QyxDQXNJOUM7QUFDQTs7QUFDQSxRQUFNeEUsTUFBTSxHQUFHaVYsU0FBUyxDQUFDelYsR0FBekI7QUFDQXdMLFFBQU0sQ0FBQ3hMLEdBQVAsR0FBYVEsTUFBYjtBQUNBZ0wsUUFBTSxDQUFDMkYsV0FBUCxHQUFxQnNFLFNBQVMsQ0FBQ3pWLEdBQS9CLENBMUk4QyxDQTJJOUM7O0FBQ0F3TCxRQUFNLENBQUM4RSxXQUFQLEdBQXFCQSxXQUFyQjtBQUNBOUUsUUFBTSxDQUFDbUYsT0FBUCxHQUFpQkEsT0FBakI7QUFDQW5GLFFBQU0sQ0FBQzlLLE1BQVAsR0FBZ0JBLE1BQWhCLENBOUk4QyxDQWdKOUM7O0FBQ0E4SyxRQUFNLENBQUMwRixTQUFQLEdBQW1CckYsQ0FBQyxDQUFDa0csS0FBRixDQUFRdkcsTUFBTSxDQUFDNkcsT0FBZixFQUF3QixLQUF4QixDQUFuQixDQWpKOEMsQ0FrSjlDO0FBQ0E7O0FBQ0EsUUFBTTZILEdBQUcsR0FBR3JPLENBQUMsQ0FBQ3NPLElBQUYsQ0FBT3RPLENBQUMsQ0FBQ0MsT0FBRixDQUFVTixNQUFNLENBQUMwRixTQUFqQixDQUFQLEVBQW9DbkYsTUFBaEQ7O0FBQ0EsTUFBSW1PLEdBQUcsS0FBSzFPLE1BQU0sQ0FBQzZHLE9BQVAsQ0FBZXRHLE1BQXZCLElBQWlDbU8sR0FBRyxLQUFLN0gsT0FBTyxDQUFDdEcsTUFBckQsRUFBNkQ7QUFDM0QsVUFBTSxJQUFJM0ssS0FBSixDQUFVLHNCQUFWLENBQU47QUFDRCxHQXZKNkMsQ0F5SjlDO0FBQ0E7OztBQUNBb0ssUUFBTSxDQUFDNkcsT0FBUCxDQUFlOVEsT0FBZixDQUF1QixXQUFtQjtBQUFBLFFBQWxCO0FBQUV2QixTQUFGO0FBQU82RjtBQUFQLEtBQWtCO0FBQ3hDMUMsV0FBTyxDQUFDbUksTUFBUixDQUNFdEwsR0FERixFQUVFO0FBQUUySyxVQUFJLEVBQUU7QUFBRW5LLGNBQUY7QUFBVXFGO0FBQVY7QUFBUixLQUZGLEVBR0U7QUFDRW1OLGlCQUFXLEVBQUUsS0FEZjtBQUVFQyxZQUFNLEVBQUUsS0FGVjtBQUdFTCxjQUFRLEVBQUUsS0FIWjtBQUlFMEQsaUJBQVcsRUFBRSxLQUpmO0FBS0VDLHdCQUFrQixFQUFFO0FBTHRCLEtBSEY7QUFXRCxHQVpELEVBM0o4QyxDQXlLOUM7O0FBQ0EsTUFBSTZELFVBQVUsR0FBRyxDQUFqQjtBQUNBLE1BQUlDLGFBQWEsR0FBRyxDQUFwQjtBQUNBLE1BQUk3QixZQUFKO0FBRUEsUUFBTThCLFlBQVksR0FBRztBQUNuQnRILGVBQVcsRUFBRSxLQURNO0FBRW5CQyxVQUFNLEVBQUUsS0FGVztBQUduQkwsWUFBUSxFQUFFLEtBSFM7QUFJbkIwRCxlQUFXLEVBQUUsS0FKTTtBQUtuQkMsc0JBQWtCLEVBQUU7QUFMRCxHQUFyQjtBQVFBLE1BQUlnRSxjQUFjLEdBQUdsWCxNQUFNLENBQUN1RSxhQUFQLEdBQXVCNFMseUJBQXZCLEVBQXJCO0FBQ0EsTUFBSUMsUUFBUSxHQUFHclgsTUFBTSxDQUFDd0UsYUFBUCxHQUF1QjRTLHlCQUF2QixFQUFmO0FBQ0EsTUFBSUUsUUFBUSxHQUFHclgsTUFBTSxDQUFDdUUsYUFBUCxHQUF1QjRTLHlCQUF2QixFQUFmO0FBQ0EsTUFBSUcsY0FBSjtBQUNBLE1BQUlDLGNBQUo7QUFFQXBQLFFBQU0sQ0FBQzJOLE1BQVAsQ0FBYzVYLE9BQWQsQ0FBc0IsQ0FBQytXLEtBQUQsRUFBUXBYLEtBQVIsS0FDcEJ1WixRQUFRLENBQUNsUCxNQUFULENBQ0VNLENBQUMsQ0FBQytELE1BQUYsQ0FDRTtBQUNFcFAsVUFERjtBQUVFVSxTQUZGO0FBR0VsQixPQUFHLEVBQUVvUSxNQUFNLENBQUNNLEVBQVAsRUFIUDtBQUlFdkwsYUFBUyxFQUFFLElBQUlMLElBQUosRUFKYjtBQUtFZSxRQUFJLEVBQUU7QUFMUixHQURGLEVBUUV5UyxLQVJGLENBREYsRUFXRWdDLFlBWEYsQ0FERjtBQWdCQUssZ0JBQWMsR0FBRy9ULE1BQU0sQ0FBQ2lVLFNBQVAsQ0FBaUJKLFFBQVEsQ0FBQ0ssT0FBMUIsRUFBbUNMLFFBQW5DLEdBQWpCO0FBRUEsUUFBTU0sUUFBUSxHQUFHSixjQUFjLENBQUNLLGNBQWYsR0FBZ0NwUCxHQUFoQyxDQUFvQ3FQLEdBQUcsSUFBSUEsR0FBRyxDQUFDamIsR0FBL0MsQ0FBakI7QUFDQXdMLFFBQU0sQ0FBQ3VQLFFBQVAsR0FBa0JBLFFBQWxCO0FBQ0FOLFVBQVEsR0FBR3JYLE1BQU0sQ0FBQ3dFLGFBQVAsR0FBdUI0Uyx5QkFBdkIsRUFBWDtBQUVBaFAsUUFBTSxDQUFDMk4sTUFBUCxDQUFjNVgsT0FBZCxDQUFzQixDQUFDK1csS0FBRCxFQUFRcFgsS0FBUixLQUFrQjtBQUN0QyxVQUFNbVksT0FBTyxHQUFHMEIsUUFBUSxDQUFDN1osS0FBRCxDQUF4QjtBQUNBLFVBQU07QUFBRW1SO0FBQUYsUUFBYzdHLE1BQXBCO0FBRUFrUCxZQUFRLEdBQUdyWCxNQUFNLENBQUN1RSxhQUFQLEdBQXVCNFMseUJBQXZCLEVBQVg7QUFDQSxRQUFJVSxjQUFjLEdBQUdoWSxZQUFZLENBQUMwRSxhQUFiLEdBQTZCNFMseUJBQTdCLEVBQXJCO0FBQ0EsUUFBSVcsY0FBYyxHQUFHbFksWUFBWSxDQUFDMkUsYUFBYixHQUE2QjRTLHlCQUE3QixFQUFyQjtBQUVBbEMsU0FBSyxDQUFDVyxNQUFOLENBQWExWCxPQUFiLENBQXFCZ1gsS0FBSyxJQUFJO0FBQzVCLFVBQUl2SSxLQUFLLENBQUNoTCxTQUFWLEVBQXFCO0FBQ25CdVQsYUFBSyxDQUFDd0IsaUJBQU4sR0FBMEIsS0FBSyxFQUEvQixDQURtQixDQUNnQjtBQUNwQzs7QUFFRE0sbUJBQWEsSUFBSTlCLEtBQUssQ0FBQ3dCLGlCQUF2Qjs7QUFFQSxZQUFNcUIsT0FBTyxHQUFHdlAsQ0FBQyxDQUFDK0QsTUFBRixDQUNkO0FBQ0VwUCxjQURGO0FBRUU2WSxlQUZGO0FBR0VuWSxhQUFLLEVBQUVrWixVQUhUO0FBSUVwYSxXQUFHLEVBQUVvUSxNQUFNLENBQUNNLEVBQVAsRUFKUDtBQUtFdkwsaUJBQVMsRUFBRSxJQUFJTCxJQUFKLEVBTGI7QUFNRWUsWUFBSSxFQUFFO0FBTlIsT0FEYyxFQVNkMFMsS0FUYyxDQUFoQjs7QUFZQW1DLGNBQVEsQ0FBQ25QLE1BQVQsQ0FBZ0I2UCxPQUFoQixFQUF5QmQsWUFBekI7QUFFQUYsZ0JBQVU7QUFDWCxLQXRCRDtBQXdCQVEsa0JBQWMsR0FBR2hVLE1BQU0sQ0FBQ2lVLFNBQVAsQ0FBaUJILFFBQVEsQ0FBQ0ksT0FBMUIsRUFBbUNKLFFBQW5DLEdBQWpCO0FBQ0EsVUFBTVcsUUFBUSxHQUFHVCxjQUFjLENBQUNJLGNBQWYsR0FBZ0NwUCxHQUFoQyxDQUFvQ3FQLEdBQUcsSUFBSUEsR0FBRyxDQUFDamIsR0FBL0MsQ0FBakI7QUFFQXFiLFlBQVEsQ0FBQzlaLE9BQVQsQ0FBaUIrWixPQUFPLElBQUk7QUFDMUIsVUFBSSxDQUFDOVAsTUFBTSxDQUFDaU4sY0FBWixFQUE0QjtBQUMxQkQsb0JBQVksR0FBR2EsT0FBZjtBQUNBN04sY0FBTSxDQUFDaU4sY0FBUCxHQUF3QjZDLE9BQXhCO0FBQ0Q7O0FBRURqSixhQUFPLENBQUM5USxPQUFSLENBQWdCO0FBQUEsWUFBQztBQUFFdkIsYUFBRyxFQUFFc1I7QUFBUCxTQUFEO0FBQUEsZUFDZDRKLGNBQWMsQ0FBQzNQLE1BQWYsQ0FBc0I7QUFDcEIrRixrQkFEb0I7QUFFcEJnSyxpQkFGb0I7QUFHcEJqQyxpQkFIb0I7QUFJcEI3WSxnQkFKb0I7QUFLcEJtUSxpQkFMb0I7QUFNcEIzUSxhQUFHLEVBQUVvUSxNQUFNLENBQUNNLEVBQVAsRUFOZTtBQU9wQnZMLG1CQUFTLEVBQUUsSUFBSUwsSUFBSixFQVBTO0FBUXBCZSxjQUFJLEVBQUU7QUFSYyxTQUF0QixDQURjO0FBQUEsT0FBaEI7QUFZRCxLQWxCRDtBQW9CQSxVQUFNMFYsa0JBQWtCLEdBQUczVSxNQUFNLENBQUNpVSxTQUFQLENBQ3pCSyxjQUFjLENBQUNKLE9BRFUsRUFFekJJLGNBRnlCLEdBQTNCO0FBSUEsVUFBTU0sY0FBYyxHQUFHRCxrQkFBa0IsQ0FDdENQLGNBRG9CLEdBRXBCcFAsR0FGb0IsQ0FFaEJxUCxHQUFHLElBQUlBLEdBQUcsQ0FBQ2piLEdBRkssQ0FBdkI7QUFJQXFiLFlBQVEsQ0FBQzlaLE9BQVQsQ0FBaUIrWixPQUFPLElBQ3RCZixjQUFjLENBQUN6UixJQUFmLENBQW9CO0FBQUU5SSxTQUFHLEVBQUVzYjtBQUFQLEtBQXBCLEVBQ0dHLE1BREgsR0FFR0MsU0FGSCxDQUVhO0FBQUUvUSxVQUFJLEVBQUU7QUFBRTZRLHNCQUFGO0FBQWtCaFcsaUJBQVMsRUFBRSxJQUFJVixJQUFKO0FBQTdCO0FBQVIsS0FGYixDQURGO0FBTUF1TixXQUFPLENBQUM5USxPQUFSLENBQWdCO0FBQUEsVUFBQztBQUFFdkIsV0FBRyxFQUFFc1I7QUFBUCxPQUFEO0FBQUEsYUFDZDZKLGNBQWMsQ0FBQzVQLE1BQWYsQ0FBc0I7QUFDcEIrRixnQkFEb0I7QUFFcEIrSCxlQUZvQjtBQUdwQjdZLGNBSG9CO0FBSXBCbVEsZUFKb0I7QUFLcEIzUSxXQUFHLEVBQUVvUSxNQUFNLENBQUNNLEVBQVAsRUFMZTtBQU1wQjdLLFlBQUksRUFBRSxFQU5jO0FBT3BCVixpQkFBUyxFQUFFLElBQUlMLElBQUo7QUFQUyxPQUF0QixDQURjO0FBQUEsS0FBaEI7QUFZQSxVQUFNNlcsb0JBQW9CLEdBQUcvVSxNQUFNLENBQUNpVSxTQUFQLENBQzNCTSxjQUFjLENBQUNMLE9BRFksRUFFM0JLLGNBRjJCLEdBQTdCO0FBSUEsVUFBTVMsY0FBYyxHQUFHRCxvQkFBb0IsQ0FDeENYLGNBRG9CLEdBRXBCcFAsR0FGb0IsQ0FFaEJxUCxHQUFHLElBQUlBLEdBQUcsQ0FBQ2piLEdBRkssQ0FBdkI7QUFJQXlhLFlBQVEsQ0FBQzNSLElBQVQsQ0FBYztBQUFFOUksU0FBRyxFQUFFcVo7QUFBUCxLQUFkLEVBQ0dvQyxNQURILEdBRUdDLFNBRkgsQ0FFYTtBQUFFL1EsVUFBSSxFQUFFO0FBQUUwUSxnQkFBRjtBQUFZTyxzQkFBWjtBQUE0QnBXLGlCQUFTLEVBQUUsSUFBSVYsSUFBSjtBQUF2QztBQUFSLEtBRmI7QUFHRCxHQTVGRDtBQThGQThCLFFBQU0sQ0FBQ2lVLFNBQVAsQ0FBaUJOLGNBQWMsQ0FBQ08sT0FBaEMsRUFBeUNQLGNBQXpDO0FBQ0EzVCxRQUFNLENBQUNpVSxTQUFQLENBQWlCSixRQUFRLENBQUNLLE9BQTFCLEVBQW1DTCxRQUFuQyxJQWpUOEMsQ0FtVDlDO0FBQ0E7O0FBQ0FqUCxRQUFNLENBQUNxUSxlQUFQLEdBQXlCOUUsTUFBTSxHQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUjZCLEdBUzVCTyxHQVRzQixDQVNsQitDLGFBQWEsR0FBRyxLQVRFLEVBU0ssU0FUTCxFQVV0QnlCLE1BVnNCLEVBQXpCLENBclQ4QyxDQWlVOUM7QUFDQTs7QUFDQSxTQUFPdFEsTUFBTSxDQUFDNkcsT0FBZDtBQUNBLFNBQU83RyxNQUFNLENBQUMyTixNQUFkLENBcFU4QyxDQXNVOUM7QUFDQTtBQUNBOztBQUNBNVosT0FBSyxDQUFDZ00sTUFBTixDQUFhQyxNQUFiLEVBQXFCO0FBQ25Cd0gsZUFBVyxFQUFFLEtBRE07QUFFbkJDLFVBQU0sRUFBRSxLQUZXO0FBR25CTCxZQUFRLEVBQUUsS0FIUztBQUluQjBELGVBQVcsRUFBRSxLQUpNO0FBS25CQyxzQkFBa0IsRUFBRTtBQUxELEdBQXJCLEVBelU4QyxDQWlWOUM7O0FBQ0F6VCxhQUFXLENBQUN3SSxNQUFaLENBQW1CbUssU0FBUyxDQUFDelYsR0FBN0IsRUFBa0M7QUFBRTJLLFFBQUksRUFBRTtBQUFFbks7QUFBRjtBQUFSLEdBQWxDLEVBbFY4QyxDQW9WOUM7QUFDQTtBQUNBO0FBRUE7O0FBQ0EsUUFBTXViLGVBQWUsR0FBR2xRLENBQUMsQ0FBQ21RLFVBQUYsQ0FDdEJ2RyxTQUFTLENBQUNsRSxlQURZLEVBRXRCa0UsU0FBUyxDQUFDdkUsU0FGWSxDQUF4Qjs7QUFLQXBCLDBCQUF3QixDQUFDaU0sZUFBRCxFQUFrQnBMLE9BQWxCLEVBQTJCOEUsU0FBM0IsQ0FBeEIsQ0E5VjhDLENBZ1c5QztBQUNBO0FBQ0E7O0FBRUEsUUFBTTtBQUFFMVQsZ0JBQUY7QUFBZ0JELGVBQWhCO0FBQTZCRTtBQUE3QixNQUE4Q3BELE1BQXBEOztBQUNBLE1BQUksQ0FBQ2tELFdBQVcsSUFBSUMsWUFBZixJQUErQkMsWUFBaEMsS0FBaUR3VyxZQUFyRCxFQUFtRTtBQUNqRSxVQUFNMVksSUFBSSxHQUFHUCxLQUFLLENBQUNRLE9BQU4sQ0FBY1MsTUFBZCxDQUFiO0FBRUE0WCxxQkFBaUIsQ0FBQztBQUNoQnRZLFVBRGdCO0FBRWhCcVEsZUFGZ0I7QUFHaEJxSSxrQkFIZ0I7QUFJaEJDLG9CQUFjLEVBQUVqTixNQUFNLENBQUNpTjtBQUpQLEtBQUQsQ0FBakI7QUFPQSxVQUFNd0QsU0FBUyxHQUFHbmMsSUFBSSxDQUFDcVosTUFBTCxDQUFZclEsSUFBWixDQUFpQm9ULENBQUMsSUFBSUEsQ0FBQyxDQUFDbGMsR0FBRixLQUFVd1ksWUFBaEMsQ0FBbEI7QUFDQSxVQUFNMkQsU0FBUyxHQUFHRixTQUFTLENBQUNoRCxNQUFWLENBQWlCblEsSUFBakIsQ0FDaEJvUSxDQUFDLElBQUlBLENBQUMsQ0FBQ2xaLEdBQUYsS0FBVXdMLE1BQU0sQ0FBQ2lOLGNBRE4sQ0FBbEI7QUFJQWEseUJBQXFCLENBQUN4WixJQUFELEVBQU9xYyxTQUFQLEVBQWtCRixTQUFsQixDQUFyQjs7QUFFQSxRQUFJbmEsV0FBSixFQUFpQjtBQUNmQSxpQkFBVyxDQUFDaEMsSUFBRCxDQUFYO0FBQ0Q7O0FBQ0QsUUFBSWlDLFlBQUosRUFBa0I7QUFDaEJBLGtCQUFZLENBQUNqQyxJQUFELEVBQU9tYyxTQUFQLENBQVo7QUFDRDs7QUFDRCxRQUFJamEsWUFBSixFQUFrQjtBQUNoQkEsa0JBQVksQ0FBQ2xDLElBQUQsRUFBT21jLFNBQVAsRUFBa0JFLFNBQWxCLENBQVo7QUFDRDtBQUNGLEdBL1g2QyxDQWlZOUM7QUFDQTtBQUNBOzs7QUFFQSxRQUFNL0UsV0FBVyxHQUFHTCxNQUFNLEdBQ3ZCTyxHQURpQixDQUNialUsTUFBTSxDQUFDK1ksb0JBRE0sRUFFakJOLE1BRmlCLEVBQXBCO0FBSUF6WSxRQUFNLENBQUNpSSxNQUFQLENBQWNFLE1BQU0sQ0FBQ2lOLGNBQXJCLEVBQXFDO0FBQ25DOU4sUUFBSSxFQUFFO0FBQ0p5TTtBQURJO0FBRDZCLEdBQXJDO0FBTUEsU0FBTzNVLGFBQWEsQ0FBQ2dULFNBQVMsQ0FBQ3pWLEdBQVgsQ0FBcEI7QUFDRCxDQWhaTTs7QUFrWkEsU0FBUzhQLHdCQUFULENBQWtDb0IsU0FBbEMsRUFBNkNQLE9BQTdDLEVBQXNEOEUsU0FBdEQsRUFBaUU7QUFDdEU7QUFDQSxRQUFNNEcsY0FBYyxHQUFHelosT0FBTyxDQUFDa0csSUFBUixDQUNyQjtBQUFFOUksT0FBRyxFQUFFO0FBQUVzYyxTQUFHLEVBQUUzTDtBQUFQLEtBQVA7QUFBeUJqUSxVQUFNLEVBQUU7QUFBakMsR0FEcUIsRUFFckI7QUFBRTZiLFFBQUksRUFBRTtBQUFFbE4sZUFBUyxFQUFFO0FBQWI7QUFBUixHQUZxQixDQUF2QjtBQUlBLFFBQU07QUFBRWlCO0FBQUYsTUFBa0JtRixTQUF4QjtBQUNBLFFBQU0rRyxhQUFhLEdBQUdILGNBQWMsQ0FBQ3pRLEdBQWYsQ0FBbUIsTUFBTSxFQUF6QixDQUF0QjtBQUNBLFFBQU02USxnQkFBZ0IsR0FBR0osY0FBYyxDQUFDelEsR0FBZixDQUFtQjhRLENBQUMsSUFBSUEsQ0FBQyxDQUFDMWMsR0FBMUIsQ0FBekI7QUFDQXdjLGVBQWEsQ0FBQ2xRLElBQWQsQ0FBbUIsRUFBbkI7QUFDQSxRQUFNcVEsZUFBZSxHQUFHN1osV0FBVyxDQUFDZ0csSUFBWixDQUFpQjtBQUN2QzlJLE9BQUcsRUFBRTtBQUFFc2MsU0FBRyxFQUFFN0csU0FBUyxDQUFDelY7QUFBakIsS0FEa0M7QUFFdkNVLFVBQU0sRUFBRSxTQUYrQjtBQUd2QzJVLGNBQVUsRUFBRTtBQUNWbkQsYUFBTyxFQUFFO0FBREMsS0FIMkI7QUFNdkMxUixVQUFNLEVBQUU7QUFBRTBSLGFBQU8sRUFBRTtBQUFYLEtBTitCO0FBT3ZDNUI7QUFQdUMsR0FBakIsRUFRckJqRSxLQVJxQixFQUF4QjtBQVNBc1EsaUJBQWUsQ0FBQ3BiLE9BQWhCLENBQXdCMlYsS0FBSyxJQUFJO0FBQy9CLFFBQUlBLEtBQUssQ0FBQ3ZHLE9BQU4sS0FBa0JBLE9BQXRCLEVBQStCO0FBQzdCNkwsbUJBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUJsUSxJQUFqQixDQUFzQjRLLEtBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0xzRixtQkFBYSxDQUFDQyxnQkFBZ0IsQ0FBQ0csT0FBakIsQ0FBeUIxRixLQUFLLENBQUN2RyxPQUEvQixJQUEwQyxDQUEzQyxDQUFiLENBQTJEckUsSUFBM0QsQ0FBZ0U0SyxLQUFoRTtBQUNEO0FBQ0YsR0FORCxFQW5Cc0UsQ0EyQnRFOztBQUNBLE1BQUl5RixlQUFlLENBQUM1USxNQUFoQixLQUEyQixDQUEvQixFQUFrQztBQUNoQyxRQUFJbUYsU0FBUyxDQUFDbkYsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN4QjVJLGFBQU8sQ0FBQ21JLE1BQVIsQ0FDRTtBQUFFdEwsV0FBRyxFQUFFO0FBQUVnUyxhQUFHLEVBQUVkO0FBQVA7QUFBUCxPQURGLEVBRUU7QUFBRXZHLFlBQUksRUFBRTtBQUFFc0gsZ0JBQU0sRUFBRSxJQUFJbk4sSUFBSixFQUFWO0FBQXNCcU4sb0JBQVUsRUFBRTtBQUFsQztBQUFSLE9BRkYsRUFHRTtBQUFFUixhQUFLLEVBQUU7QUFBVCxPQUhGO0FBS0Q7O0FBRUQ7QUFDRDs7QUFFRCxPQUFLLElBQUlrTCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHTCxhQUFhLENBQUN6USxNQUFsQyxFQUEwQzhRLENBQUMsRUFBM0MsRUFBK0M7QUFDN0MsVUFBTUMsT0FBTyxHQUFHTixhQUFhLENBQUNLLENBQUQsQ0FBN0I7O0FBRUEsUUFBSUMsT0FBTyxDQUFDL1EsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QjtBQUNELEtBTDRDLENBTzdDO0FBQ0E7OztBQUNBLFVBQU1nUixpQkFBaUIsR0FBR3hELGNBQWMsQ0FDdEN1RCxPQUFPLENBQUNsUixHQUFSLENBQVlzTCxLQUFLLElBQUk7QUFDbkIsYUFBTztBQUNMck8sYUFBSyxFQUFFcU8sS0FERjtBQUVMOEYsY0FBTSxFQUFFOUYsS0FBSyxDQUFDckc7QUFGVCxPQUFQO0FBSUQsS0FMRCxDQURzQyxDQUF4Qzs7QUFTQSxTQUFLLElBQUlnTSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHM0wsU0FBUyxDQUFDbkYsTUFBOUIsRUFBc0M4USxDQUFDLEVBQXZDLEVBQTJDO0FBQ3pDLFlBQU12TCxRQUFRLEdBQUdKLFNBQVMsQ0FBQzJMLENBQUQsQ0FBMUI7QUFDQSxZQUFNM0YsS0FBSyxHQUFHNkYsaUJBQWlCLEVBQS9CLENBRnlDLENBSXpDOztBQUNBLFlBQU1FLFNBQVMsR0FBRztBQUFFMUwsdUJBQWUsRUFBRUQ7QUFBbkIsT0FBbEI7O0FBQ0EsVUFBSW1FLFNBQVMsQ0FBQ3ZFLFNBQVYsQ0FBb0J4RCxRQUFwQixDQUE2QjRELFFBQTdCLENBQUosRUFBNEM7QUFDMUMyTCxpQkFBUyxDQUFDL0wsU0FBVixHQUFzQkksUUFBdEI7QUFDRDs7QUFDRHhPLGlCQUFXLENBQUN3SSxNQUFaLENBQW1CNEwsS0FBSyxDQUFDbFgsR0FBekIsRUFBOEI7QUFBRWlkO0FBQUYsT0FBOUI7QUFFQTlaLGFBQU8sQ0FBQ21JLE1BQVIsQ0FBZWdHLFFBQWYsRUFBeUI7QUFDdkIzRyxZQUFJLEVBQUU7QUFDSndHLHFCQUFXLEVBQUUrRixLQUFLLENBQUNsWDtBQURmO0FBRGlCLE9BQXpCO0FBS0Q7O0FBRUQ7QUFDRDtBQUNGLEM7Ozs7Ozs7Ozs7O0FDcGdCRHRCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNZLE9BQUssRUFBQyxNQUFJQTtBQUFYLENBQWQ7QUFBaUMsSUFBSVQsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlpUCxPQUFKO0FBQVl2UCxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDb1AsU0FBTyxDQUFDalAsQ0FBRCxFQUFHO0FBQUNpUCxXQUFPLEdBQUNqUCxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUlnUCxZQUFKO0FBQWlCdFAsTUFBTSxDQUFDRyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ21QLGNBQVksQ0FBQ2hQLENBQUQsRUFBRztBQUFDZ1AsZ0JBQVksR0FBQ2hQLENBQWI7QUFBZTs7QUFBaEMsQ0FBdkMsRUFBeUUsQ0FBekU7QUFBNEUsSUFBSStFLFNBQUosRUFBY0QsWUFBZCxFQUEyQkosZUFBM0I7QUFBMkNoRixNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDa0YsV0FBUyxDQUFDL0UsQ0FBRCxFQUFHO0FBQUMrRSxhQUFTLEdBQUMvRSxDQUFWO0FBQVksR0FBMUI7O0FBQTJCOEUsY0FBWSxDQUFDOUUsQ0FBRCxFQUFHO0FBQUM4RSxnQkFBWSxHQUFDOUUsQ0FBYjtBQUFlLEdBQTFEOztBQUEyRDBFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQjs7QUFBaEcsQ0FBakMsRUFBbUksQ0FBbkk7QUFBc0ksSUFBSXlFLGVBQUosRUFBb0JHLGNBQXBCO0FBQW1DbEYsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQzRFLGlCQUFlLENBQUN6RSxDQUFELEVBQUc7QUFBQ3lFLG1CQUFlLEdBQUN6RSxDQUFoQjtBQUFrQixHQUF0Qzs7QUFBdUM0RSxnQkFBYyxDQUFDNUUsQ0FBRCxFQUFHO0FBQUM0RSxrQkFBYyxHQUFDNUUsQ0FBZjtBQUFpQjs7QUFBMUUsQ0FBcEMsRUFBZ0gsQ0FBaEg7QUFBbUgsSUFBSThELFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQTNDLEVBQTJFLENBQTNFO0FBQThFLElBQUlzRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNHLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDeUUsWUFBVSxDQUFDdEUsQ0FBRCxFQUFHO0FBQUNzRSxjQUFVLEdBQUN0RSxDQUFYO0FBQWE7O0FBQTVCLENBQXZDLEVBQXFFLENBQXJFO0FBQXdFLElBQUk0RCxPQUFKO0FBQVlsRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDK0QsU0FBTyxDQUFDNUQsQ0FBRCxFQUFHO0FBQUM0RCxXQUFPLEdBQUM1RCxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUltRSxPQUFKO0FBQVl6RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDc0UsU0FBTyxDQUFDbkUsQ0FBRCxFQUFHO0FBQUNtRSxXQUFPLEdBQUNuRSxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUlxRSxNQUFKO0FBQVczRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDd0UsUUFBTSxDQUFDckUsQ0FBRCxFQUFHO0FBQUNxRSxVQUFNLEdBQUNyRSxDQUFQO0FBQVM7O0FBQXBCLENBQS9CLEVBQXFELENBQXJEO0FBQXdELElBQUlvRSxNQUFKO0FBQVcxRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxrQkFBWixFQUErQjtBQUFDdUUsUUFBTSxDQUFDcEUsQ0FBRCxFQUFHO0FBQUNvRSxVQUFNLEdBQUNwRSxDQUFQO0FBQVM7O0FBQXBCLENBQS9CLEVBQXFELEVBQXJEOztBQVk1K0IsTUFBTWtlLGVBQU4sU0FBOEIvTyxLQUFLLENBQUNDLFVBQXBDLENBQStDO0FBQzdDN0MsUUFBTSxDQUFDOEMsR0FBRCxFQUFNQyxRQUFOLEVBQWdCO0FBQ3BCRCxPQUFHLENBQUNuTixLQUFKLEdBQVkrTSxPQUFPLENBQUNNLEdBQVIsQ0FBWSxPQUFaLENBQVo7QUFDQSxXQUFPLE1BQU1oRCxNQUFOLENBQWE4QyxHQUFiLEVBQWtCQyxRQUFsQixDQUFQO0FBQ0Q7O0FBSjRDOztBQU94QyxNQUFNL08sS0FBSyxHQUFHLElBQUkyZCxlQUFKLENBQW9CLE9BQXBCLENBQWQ7QUFFUDNkLEtBQUssQ0FBQ3dILE1BQU4sR0FBZSxJQUFJakksWUFBSixDQUFpQjtBQUM5QjtBQUNBb0MsT0FBSyxFQUFFO0FBQ0wrQyxRQUFJLEVBQUVuRixZQUFZLENBQUNxUTtBQURkLEdBRnVCO0FBTTlCO0FBQ0E7QUFDQTBNLGlCQUFlLEVBQUU7QUFDZjVYLFFBQUksRUFBRWEsSUFEUztBQUVmNUQsU0FBSyxFQUFFO0FBRlEsR0FSYTtBQWE5QjtBQUNBakIsWUFBVSxFQUFFO0FBQ1ZnRSxRQUFJLEVBQUVhLElBREk7QUFFVlgsWUFBUSxFQUFFLElBRkE7QUFHVmpELFNBQUssRUFBRTtBQUhHLEdBZGtCO0FBb0I5QjtBQUNBdVgsZ0JBQWMsRUFBRTtBQUNkeFUsUUFBSSxFQUFFQyxNQURRO0FBRWRDLFlBQVEsRUFBRSxJQUZJO0FBR2RDLFNBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDLEVBSFo7QUFJZHBELFNBQUssRUFBRTtBQUpPLEdBckJjO0FBNEI5QlQsV0FBUyxFQUFFO0FBQ1RzRSxTQUFLLEVBQUUsY0FERTtBQUVUZCxRQUFJLEVBQUVDLE1BRkc7QUFHVEMsWUFBUSxFQUFFLElBSEQ7QUFJVEMsU0FBSyxFQUFFO0FBSkU7QUE1Qm1CLENBQWpCLENBQWY7O0FBb0NBLElBQUl3QyxNQUFNLENBQUM0RixhQUFQLElBQXdCNUYsTUFBTSxDQUFDNkYsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJpRCxtQkFBbkQsRUFBd0U7QUFDdEVwUSxPQUFLLENBQUN3SCxNQUFOLENBQWE2SSxNQUFiLENBQW9Cbk0sZUFBcEI7QUFDRDs7QUFFRGxFLEtBQUssQ0FBQ3dILE1BQU4sQ0FBYTZJLE1BQWIsQ0FBb0JsTSxlQUFwQjtBQUNBbkUsS0FBSyxDQUFDd0gsTUFBTixDQUFhNkksTUFBYixDQUFvQmhNLGNBQXBCO0FBQ0FyRSxLQUFLLENBQUN3SCxNQUFOLENBQWE2SSxNQUFiLENBQW9CN0wsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsS0FBaEIsQ0FBN0I7QUFDQXhFLEtBQUssQ0FBQ3dILE1BQU4sQ0FBYTZJLE1BQWIsQ0FBb0I3TCxTQUFTLENBQUMsWUFBRCxDQUE3QjtBQUNBeEUsS0FBSyxDQUFDd0gsTUFBTixDQUFhNkksTUFBYixDQUFvQjlMLFlBQVksQ0FBQyxRQUFELENBQWhDO0FBQ0F2RSxLQUFLLENBQUN3SCxNQUFOLENBQWE2SSxNQUFiLENBQW9COUwsWUFBWSxDQUFDLFNBQUQsQ0FBaEM7QUFDQXZFLEtBQUssQ0FBQ3dILE1BQU4sQ0FBYTZJLE1BQWIsQ0FBb0I3TCxTQUFTLENBQUMsU0FBRCxDQUE3QixFLENBQ0E7O0FBQ0F4RSxLQUFLLENBQUN3SCxNQUFOLENBQWE2SSxNQUFiLENBQW9CNUIsWUFBcEI7QUFDQXpPLEtBQUssQ0FBQ3NRLFlBQU4sQ0FBbUJ0USxLQUFLLENBQUN3SCxNQUF6QixFOzs7Ozs7Ozs7OztBQ3RFQXJJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUM0VyxnQkFBYyxFQUFDLE1BQUlBLGNBQXBCO0FBQW1DQyx1QkFBcUIsRUFBQyxNQUFJQTtBQUE3RCxDQUFkO0FBQW1HLElBQUk1UyxPQUFKO0FBQVlsRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDK0QsU0FBTyxDQUFDNUQsQ0FBRCxFQUFHO0FBQUM0RCxXQUFPLEdBQUM1RCxDQUFSO0FBQVU7O0FBQXRCLENBQWpDLEVBQXlELENBQXpEO0FBQTRELElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUEzQyxFQUEyRSxDQUEzRTtBQUE4RSxJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNVLE9BQUssQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLFNBQUssR0FBQ1AsQ0FBTjtBQUFROztBQUFsQixDQUE3QixFQUFpRCxDQUFqRDs7QUFLNVEsTUFBTXVXLGNBQWMsR0FBRzVFLE9BQU8sSUFBSTtBQUN2QyxRQUFNWCxLQUFLLEdBQUdwTixPQUFPLENBQUM3QyxPQUFSLENBQWdCNFEsT0FBaEIsQ0FBZDs7QUFDQSxNQUFJLENBQUNYLEtBQUwsRUFBWTtBQUNWLHFEQUEwQ1csT0FBMUM7QUFDRDs7QUFFRCxRQUFNd00sa0JBQWtCLEdBQUduTixLQUFLLENBQUN2QixTQUFOLEVBQTNCO0FBQ0EsUUFBTTJPLFVBQVUsR0FBRzdkLEtBQUssQ0FBQ3VKLElBQU4sQ0FBVztBQUFFNkg7QUFBRixHQUFYLEVBQXdCNUgsS0FBeEIsRUFBbkI7QUFDQSxRQUFNc1UsdUJBQXVCLEdBQUd2YSxXQUFXLENBQUNnRyxJQUFaLENBQWlCO0FBQy9DNkgsV0FEK0M7QUFFL0MwRSxjQUFVLEVBQUU7QUFBRW5ELGFBQU8sRUFBRTtBQUFYO0FBRm1DLEdBQWpCLEVBRzdCbkosS0FINkIsRUFBaEM7O0FBS0EsTUFBSW9VLGtCQUFrQixLQUFLQyxVQUFVLEdBQUdDLHVCQUF4QyxFQUFpRTtBQUMvRHphLFdBQU8sQ0FBQzBJLE1BQVIsQ0FBZXFGLE9BQWYsRUFBd0I7QUFBRWhHLFVBQUksRUFBRTtBQUFFeUUsWUFBSSxFQUFFO0FBQVI7QUFBUixLQUF4QjtBQUNEO0FBQ0YsQ0FoQk07O0FBa0JQO0FBQ0E3UCxLQUFLLENBQUN3USxLQUFOLENBQVl4RSxNQUFaLENBQW1CLFVBQVM1RyxNQUFULFFBQThCO0FBQUEsTUFBYjtBQUFFZ007QUFBRixHQUFhO0FBQy9DNEUsZ0JBQWMsQ0FBQzVFLE9BQUQsQ0FBZDtBQUNELENBRkQ7O0FBSU8sTUFBTTZFLHFCQUFxQixHQUFHN0UsT0FBTyxJQUFJO0FBQzlDO0FBQ0EsUUFBTTJNLFNBQVMsR0FBRztBQUFFM00sV0FBRjtBQUFXMVEsY0FBVSxFQUFFO0FBQUVpUyxhQUFPLEVBQUU7QUFBWDtBQUF2QixHQUFsQjtBQUNBLFFBQU1rTCxVQUFVLEdBQUc3ZCxLQUFLLENBQUN1SixJQUFOLENBQVd3VSxTQUFYLEVBQXNCdlUsS0FBdEIsRUFBbkI7QUFDQSxRQUFNd1UsV0FBVyxHQUFHSCxVQUFVLEtBQUssQ0FBbkMsQ0FKOEMsQ0FNOUM7O0FBQ0EsUUFBTUksZ0JBQWdCLEdBQUc7QUFDdkI3TSxXQUR1QjtBQUV2Qm5RLFVBQU0sRUFBRTtBQUFFMFIsYUFBTyxFQUFFO0FBQVgsS0FGZTtBQUd2Qm1ELGNBQVUsRUFBRTtBQUFFbkQsYUFBTyxFQUFFO0FBQVg7QUFIVyxHQUF6QjtBQUtBLFFBQU11TCxZQUFZLEdBQUczYSxXQUFXLENBQUNnRyxJQUFaLENBQWlCMFUsZ0JBQWpCLEVBQW1DelUsS0FBbkMsRUFBckI7QUFDQSxRQUFNMlUsaUJBQWlCLEdBQUdELFlBQVksS0FBSyxDQUEzQzs7QUFFQSxNQUFJRixXQUFXLElBQUlHLGlCQUFuQixFQUFzQztBQUNwQzlhLFdBQU8sQ0FBQzBJLE1BQVIsQ0FBZXFGLE9BQWYsRUFBd0I7QUFDdEJoRyxVQUFJLEVBQUU7QUFBRWpLLGNBQU0sRUFBRSxVQUFWO0FBQXNCVCxrQkFBVSxFQUFFLElBQUk2RSxJQUFKO0FBQWxDO0FBRGdCLEtBQXhCO0FBR0Q7QUFDRixDQXBCTTs7QUFzQlA7QUFDQXZGLEtBQUssQ0FBQ3dRLEtBQU4sQ0FBWXpFLE1BQVosQ0FDRSxVQUFTM0csTUFBVCxTQUE4QjZNLFVBQTlCLEVBQTBDQyxRQUExQyxFQUFvRGpLLE9BQXBELEVBQTZEO0FBQUEsTUFBNUM7QUFBRW1KO0FBQUYsR0FBNEM7O0FBQzNELE1BQUksQ0FBQ2EsVUFBVSxDQUFDOUQsUUFBWCxDQUFvQixZQUFwQixDQUFMLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBRUQ4SCx1QkFBcUIsQ0FBQzdFLE9BQUQsQ0FBckI7QUFDRCxDQVBILEVBUUU7QUFBRTJCLGVBQWEsRUFBRTtBQUFqQixDQVJGLEU7Ozs7Ozs7Ozs7O0FDbkRBNVQsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2dmLGdCQUFjLEVBQUMsTUFBSUEsY0FBcEI7QUFBbUN2ZSxlQUFhLEVBQUMsTUFBSUE7QUFBckQsQ0FBZDtBQUFtRixJQUFJQyxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNLLFVBQU0sR0FBQ0wsQ0FBUDtBQUFTOztBQUFyQixDQUE5QixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJMlQsZUFBSjtBQUFvQmpVLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUM4VCxpQkFBZSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxtQkFBZSxHQUFDM1QsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQTFDLEVBQWtGLENBQWxGO0FBQXFGLElBQUlGLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQXpCLEVBQTZDLENBQTdDO0FBQWdELElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3dFLFFBQU0sQ0FBQ3JFLENBQUQsRUFBRztBQUFDcUUsVUFBTSxHQUFDckUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJNEQsT0FBSjtBQUFZbEUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQytELFNBQU8sQ0FBQzVELENBQUQsRUFBRztBQUFDNEQsV0FBTyxHQUFDNUQsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQVU1bkIsTUFBTTJlLGNBQWMsR0FBRyxJQUFJaEwsZUFBSixDQUFvQjtBQUNoRGpULE1BQUksRUFBRSwwQkFEMEM7QUFHaERrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekIwQixVQUFNLEVBQUU7QUFDTnlELFVBQUksRUFBRUMsTUFEQTtBQUVORSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZwQixLQURpQjtBQUt6QnRELE9BQUcsRUFBRTtBQUNIaUQsVUFBSSxFQUFFQztBQURILEtBTG9CO0FBUXpCMkUsU0FBSyxFQUFFO0FBQ0w1RSxVQUFJLEVBQUVDO0FBREQsS0FSa0I7QUFXekJnUyxVQUFNLEVBQUU7QUFDTmpTLFVBQUksRUFBRWdCLE9BREE7QUFFTmQsY0FBUSxFQUFFO0FBRkosS0FYaUI7QUFlekJnUyxjQUFVLEVBQUU7QUFDVmxTLFVBQUksRUFBRWdCLE9BREk7QUFFVmQsY0FBUSxFQUFFO0FBRkE7QUFmYSxHQUFqQixFQW1CUDJPLFNBbkJPLEVBSHNDOztBQXdCaERDLEtBQUcsT0FBNkM7QUFBQSxRQUE1QztBQUFFdlMsWUFBRjtBQUFVUSxTQUFWO0FBQWU2SCxXQUFmO0FBQXNCcU4sWUFBdEI7QUFBOEJDO0FBQTlCLEtBQTRDO0FBQzlDLFVBQU1yVyxJQUFJLEdBQUdQLEtBQUssQ0FBQ1EsT0FBTixDQUFjUyxNQUFkLENBQWI7O0FBQ0EsUUFBSSxDQUFDVixJQUFMLEVBQVc7QUFDVCxZQUFNLElBQUlzQixLQUFKLENBQVUsZ0JBQVYsQ0FBTjtBQUNELEtBSjZDLENBSzlDOzs7QUFFQSxVQUFNd0gsR0FBRyxHQUFHbEIsSUFBSSxDQUFDME8sS0FBTCxDQUFXdk4sS0FBWCxDQUFaO0FBQ0EsUUFBSXlDLE1BQU0sR0FBRztBQUFFLHNCQUFTdEssR0FBVCxJQUFpQjRIO0FBQW5CLEtBQWI7QUFDQSxVQUFNNkksUUFBUSxHQUFHeUUsTUFBTSxHQUFHO0FBQUVHLFdBQUssRUFBRS9LO0FBQVQsS0FBSCxHQUF1QjtBQUFFWCxVQUFJLEVBQUVXO0FBQVIsS0FBOUM7QUFFQS9MLFNBQUssQ0FBQytMLE1BQU4sQ0FBYTlLLE1BQWIsRUFBcUJpUixRQUFyQixFQUErQjtBQUM3QnVCLGlCQUFXLEVBQUUsS0FEZ0I7QUFFN0JDLFlBQU0sRUFBRSxLQUZxQjtBQUc3QkwsY0FBUSxFQUFFLEtBSG1CO0FBSTdCMEQsaUJBQVcsRUFBRSxLQUpnQjtBQUs3QkMsd0JBQWtCLEVBQUU7QUFMUyxLQUEvQjs7QUFRQSxRQUFJM1AsTUFBTSxDQUFDNFAsUUFBUCxJQUFtQixDQUFDTCxVQUF4QixFQUFvQztBQUNsQzlXLFlBQU0sQ0FBQ0gsWUFBUCxDQUFvQjtBQUNsQnVYLFlBQUksRUFBRSxLQUFLQyxVQURPO0FBRWxCbFcsY0FGa0I7QUFHbEJWLFlBSGtCO0FBSWxCa0IsV0FKa0I7QUFLbEI2SCxhQUFLLEVBQUVELEdBTFc7QUFNbEIrTixpQkFBUyxFQUFFN1csSUFBSSxDQUFDK0YsSUFBTCxJQUFhL0YsSUFBSSxDQUFDK0YsSUFBTCxDQUFVN0UsR0FBVixDQU5OO0FBT2xCa1Y7QUFQa0IsT0FBcEI7QUFTRDtBQUNGOztBQXREK0MsQ0FBcEIsQ0FBdkI7QUF5REEsTUFBTTlXLGFBQWEsR0FBRyxJQUFJdVQsZUFBSixDQUFvQjtBQUMvQ2pULE1BQUksRUFBRSw2QkFEeUM7QUFHL0NrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekIwQixVQUFNLEVBQUU7QUFDTnlELFVBQUksRUFBRUMsTUFEQTtBQUVORSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZwQixLQURpQjtBQUt6QjdELGFBQVMsRUFBRTtBQUNUc0UsV0FBSyxFQUFFLGdCQURFO0FBRVRkLFVBQUksRUFBRUMsTUFGRztBQUdURSxXQUFLLEVBQUU7QUFIRSxLQUxjO0FBVXpCMUQsVUFBTSxFQUFFO0FBQ05xRSxXQUFLLEVBQUUseUNBREQ7QUFFTmQsVUFBSSxFQUFFQyxNQUZBO0FBR05FLFdBQUssRUFBRTtBQUhEO0FBVmlCLEdBQWpCLEVBZVAwTyxTQWZPLEVBSHFDOztBQW9CL0NDLEtBQUcsUUFBZ0M7QUFBQSxRQUEvQjtBQUFFdlMsWUFBRjtBQUFVQyxlQUFWO0FBQXFCQztBQUFyQixLQUErQjs7QUFDakMsUUFBSSxDQUFDa0csTUFBTSxDQUFDNFAsUUFBWixFQUFzQjtBQUNwQjtBQUNEOztBQUVELFVBQU0xVyxJQUFJLEdBQUdQLEtBQUssQ0FBQ1EsT0FBTixDQUFjUyxNQUFkLENBQWI7O0FBRUEsUUFBSSxDQUFDVixJQUFMLEVBQVc7QUFDVCxZQUFNLElBQUlzQixLQUFKLENBQVUsZ0JBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUl0QixJQUFJLElBQUlBLElBQUksQ0FBQ0csVUFBakIsRUFBNkI7QUFDM0IsVUFBSTJHLE1BQU0sQ0FBQzRGLGFBQVgsRUFBMEI7QUFDeEJ0TSxlQUFPLENBQUNDLEdBQVIsQ0FBWSx5QkFBWjtBQUNEOztBQUVEO0FBQ0Q7O0FBRURaLFNBQUssQ0FBQytMLE1BQU4sQ0FBYTlLLE1BQWIsRUFBcUI7QUFDbkJtSyxVQUFJLEVBQUU7QUFDSjFLLGtCQUFVLEVBQUUsSUFBSTZFLElBQUosRUFEUjtBQUVKcEUsY0FGSTtBQUdKRDtBQUhJO0FBRGEsS0FBckI7QUFRQXFDLGVBQVcsQ0FBQ3dJLE1BQVosQ0FDRTtBQUFFOUs7QUFBRixLQURGLEVBRUU7QUFDRW1LLFVBQUksRUFBRTtBQUNKakssY0FESTtBQUVKRDtBQUZJO0FBRFIsS0FGRjtBQVVBWCxRQUFJLENBQUNvUixTQUFMLENBQWUzUCxPQUFmLENBQXVCK1AsUUFBUSxJQUM3Qm5PLE9BQU8sQ0FBQ21JLE1BQVIsQ0FBZWdHLFFBQWYsRUFBeUI7QUFDdkIzRyxVQUFJLEVBQUU7QUFDSnNILGNBQU0sRUFBRSxJQUFJbk4sSUFBSixFQURKO0FBRUpxTixrQkFBVSxFQUFFelIsTUFGUjtBQUdKa1csa0JBQVUsRUFBRW5XO0FBSFI7QUFEaUIsS0FBekIsQ0FERjtBQVVBLFVBQU11UCxLQUFLLEdBQUdwTixPQUFPLENBQUM3QyxPQUFSLENBQWdCRCxJQUFJLENBQUM2USxPQUFyQixDQUFkO0FBQ0EsVUFBTWtHLGNBQWMsR0FBRy9ULFdBQVcsQ0FBQy9DLE9BQVosQ0FBb0I7QUFDekMrVyxVQUFJLEVBQUUsQ0FDSjtBQUNFOVcsV0FBRyxFQUFFO0FBQUVnUyxhQUFHLEVBQUVoQyxLQUFLLENBQUNTO0FBQWI7QUFEUCxPQURJLEVBSUo7QUFBRS9QLGNBQU0sRUFBRTtBQUFFc1IsYUFBRyxFQUFFLENBQUMsTUFBRCxFQUFTLFNBQVQ7QUFBUDtBQUFWLE9BSkk7QUFEbUMsS0FBcEIsQ0FBdkIsQ0FoRGlDLENBeURqQzs7QUFDQSxRQUFJLENBQUM2RSxjQUFMLEVBQXFCO0FBQ25CalUsYUFBTyxDQUFDMEksTUFBUixDQUNFO0FBQUVtRixvQkFBWSxFQUFFalE7QUFBaEIsT0FERixFQUVFO0FBQUVtSyxZQUFJLEVBQUU7QUFBRWpLLGdCQUFNLEVBQUVBLE1BQVY7QUFBa0JULG9CQUFVLEVBQUUsSUFBSTZFLElBQUo7QUFBOUI7QUFBUixPQUZGO0FBSUQ7QUFDRjs7QUFwRjhDLENBQXBCLENBQXRCLEM7Ozs7Ozs7Ozs7O0FDbkVQLElBQUlpUyxNQUFKO0FBQVdyWSxNQUFNLENBQUNHLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUMrWCxVQUFNLEdBQUMvWCxDQUFQO0FBQVM7O0FBQXJCLENBQXJCLEVBQTRDLENBQTVDO0FBQStDLElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksYUFBWixFQUEwQjtBQUFDVSxPQUFLLENBQUNQLENBQUQsRUFBRztBQUFDTyxTQUFLLEdBQUNQLENBQU47QUFBUTs7QUFBbEIsQ0FBMUIsRUFBOEMsQ0FBOUM7QUFBaUQsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBdkMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSW9FLE1BQUo7QUFBVzFFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHdCQUFaLEVBQXFDO0FBQUN1RSxRQUFNLENBQUNwRSxDQUFELEVBQUc7QUFBQ29FLFVBQU0sR0FBQ3BFLENBQVA7QUFBUzs7QUFBcEIsQ0FBckMsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSXFFLE1BQUo7QUFBVzNFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHdCQUFaLEVBQXFDO0FBQUN3RSxRQUFNLENBQUNyRSxDQUFELEVBQUc7QUFBQ3FFLFVBQU0sR0FBQ3JFLENBQVA7QUFBUzs7QUFBcEIsQ0FBckMsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSXNFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUN5RSxZQUFVLENBQUN0RSxDQUFELEVBQUc7QUFBQ3NFLGNBQVUsR0FBQ3RFLENBQVg7QUFBYTs7QUFBNUIsQ0FBN0MsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSXFaLHVCQUFKLEVBQTRCaUIscUJBQTVCO0FBQWtENWEsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ3daLHlCQUF1QixDQUFDclosQ0FBRCxFQUFHO0FBQUNxWiwyQkFBdUIsR0FBQ3JaLENBQXhCO0FBQTBCLEdBQXREOztBQUF1RHNhLHVCQUFxQixDQUFDdGEsQ0FBRCxFQUFHO0FBQUNzYSx5QkFBcUIsR0FBQ3RhLENBQXRCO0FBQXdCOztBQUF4RyxDQUE3QyxFQUF1SixDQUF2SjtBQUEwSixJQUFJb1osaUJBQUo7QUFBc0IxWixNQUFNLENBQUNHLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDdVosbUJBQWlCLENBQUNwWixDQUFELEVBQUc7QUFBQ29aLHFCQUFpQixHQUFDcFosQ0FBbEI7QUFBb0I7O0FBQTFDLENBQXJDLEVBQWlGLENBQWpGO0FBQW9GLElBQUlKLE1BQUo7QUFBV0YsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ0QsUUFBTSxDQUFDSSxDQUFELEVBQUc7QUFBQ0osVUFBTSxHQUFDSSxDQUFQO0FBQVM7O0FBQXBCLENBQTlCLEVBQW9ELENBQXBEO0FBQXVELElBQUk0ZSxVQUFKO0FBQWVsZixNQUFNLENBQUNHLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDK2UsWUFBVSxDQUFDNWUsQ0FBRCxFQUFHO0FBQUM0ZSxjQUFVLEdBQUM1ZSxDQUFYO0FBQWE7O0FBQTVCLENBQXJDLEVBQW1FLENBQW5FO0FBQXNFLElBQUlnWSxJQUFKO0FBQVN0WSxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDZ1ksUUFBSSxHQUFDaFksQ0FBTDtBQUFPOztBQUFuQixDQUE5QyxFQUFtRSxFQUFuRTtBQWdCeDRCZ1ksSUFBSSxDQUFDTSxHQUFMLENBQVM7QUFDUDVYLE1BQUksRUFBRSxtQ0FEQztBQUVQc1ksVUFBUSxFQUFFLElBRkg7QUFHUEMsTUFBSSxFQUFFLFVBQVM5WCxHQUFULEVBQWM7QUFDbEIsVUFBTWtMLEtBQUssR0FBRztBQUNaM0ssWUFBTSxFQUFFLFNBREk7QUFFWm1iLHFCQUFlLEVBQUU7QUFBRWdDLFlBQUksRUFBRSxJQUFJL1ksSUFBSjtBQUFSLE9BRkw7QUFHWjdFLGdCQUFVLEVBQUU7QUFBRWlTLGVBQU8sRUFBRTtBQUFYO0FBSEEsS0FBZDtBQUtBM1MsU0FBSyxDQUFDdUosSUFBTixDQUFXdUMsS0FBWCxFQUFrQjlKLE9BQWxCLENBQTBCekIsSUFBSSxJQUFJO0FBQ2hDLFlBQU15WSxLQUFLLEdBQUdsVixNQUFNLENBQUN0RCxPQUFQLENBQWVELElBQUksQ0FBQzJZLGNBQXBCLENBQWQ7QUFFQSxZQUFNdEIsR0FBRyxHQUFHSixNQUFNLEVBQWxCO0FBQ0EsWUFBTUssV0FBVyxHQUFHTCxNQUFNLENBQUN3QixLQUFLLENBQUNuQixXQUFQLENBQTFCO0FBQ0EsWUFBTUMsU0FBUyxHQUFHRCxXQUFXLENBQUNFLEdBQVosQ0FBZ0JpQixLQUFLLENBQUN3QixpQkFBdEIsRUFBeUMsU0FBekMsQ0FBbEI7QUFDQSxZQUFNdkMsS0FBSyxHQUFHTCxHQUFHLENBQUNNLGFBQUosQ0FBa0JKLFNBQWxCLENBQWQ7O0FBQ0EsVUFBSUcsS0FBSixFQUFXO0FBQ1RvRyxrQkFBVSxDQUFDckYsS0FBSyxDQUFDdlksR0FBUCxDQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsY0FBTTtBQUFFUTtBQUFGLFlBQWErWCxLQUFuQixDQURLLENBRUw7O0FBQ0EsY0FBTWxOLEtBQUssR0FBRztBQUFFN0ssZ0JBQUY7QUFBVW9CLGFBQUcsRUFBRTtBQUFFc1EsbUJBQU8sRUFBRTtBQUFYO0FBQWYsU0FBZDs7QUFDQSxZQUFJL08sT0FBTyxDQUFDMkYsSUFBUixDQUFhdUMsS0FBYixFQUFvQnRDLEtBQXBCLE9BQWdDLENBQXBDLEVBQXVDO0FBQ3JDO0FBQ0Q7O0FBQ0QsY0FBTStVLFVBQVUsR0FBRzNhLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYXVDLEtBQWIsQ0FBbkI7QUFDQSxjQUFNOEUsU0FBUyxHQUFHN00sVUFBVSxDQUFDdkQsT0FBWCxDQUFtQkQsSUFBSSxDQUFDd1EsV0FBeEIsQ0FBbEI7QUFDQSxjQUFNZ0ksS0FBSyxHQUFHbFYsTUFBTSxDQUFDckQsT0FBUCxDQUFld1ksS0FBSyxDQUFDYyxPQUFyQixDQUFkO0FBRUFqQix5QkFBaUIsQ0FBQztBQUFFdFksY0FBRjtBQUFRcVEsbUJBQVI7QUFBbUJtSSxlQUFuQjtBQUEwQkM7QUFBMUIsU0FBRCxDQUFqQjtBQUVBdUYsa0JBQVUsQ0FBQ3ZjLE9BQVgsQ0FBbUJ3YyxTQUFTLElBQUk7QUFDOUIsZ0JBQU1uYyxHQUFHLEdBQUdoRCxNQUFNLENBQUM2QyxJQUFQLENBQVlzYyxTQUFTLENBQUNuYyxHQUF0QixDQUFaOztBQUNBLGNBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ1J6QixlQUFHLENBQUNHLEtBQUosZ0NBRUl5ZCxTQUFTLENBQUNuYyxHQUZkO0FBS0E7QUFDRDs7QUFFRCxjQUFJLENBQUNBLEdBQUcsQ0FBQ29jLFdBQVQsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRDFFLCtCQUFxQixDQUFDeFosSUFBRCxFQUFPeVksS0FBUCxFQUFjRCxLQUFkLENBQXJCO0FBRUF5RixtQkFBUyxDQUFDeEYsS0FBVixHQUFrQjFNLENBQUMsQ0FBQytELE1BQUYsQ0FBUyxFQUFULEVBQWEySSxLQUFiLENBQWxCO0FBQ0F3RixtQkFBUyxDQUFDekYsS0FBVixHQUFrQnpNLENBQUMsQ0FBQytELE1BQUYsQ0FBUyxFQUFULEVBQWEwSSxLQUFiLENBQWxCO0FBQ0FELGlDQUF1QixDQUNyQjBGLFNBRHFCLEVBRXJCQSxTQUFTLENBQUN4RixLQUZXLEVBR3JCd0YsU0FBUyxDQUFDekYsS0FIVyxFQUlyQnhZLElBSnFCLENBQXZCO0FBT0EsZ0JBQU1tZSxJQUFJLEdBQUc1RyxTQUFTLENBQUM2RyxJQUFWLENBQWUvRyxHQUFmLEVBQW9CLFNBQXBCLENBQWI7QUFFQXJYLGNBQUksQ0FBQ3FaLE1BQUwsQ0FBWTVYLE9BQVosQ0FBb0IrVyxLQUFLLElBQUk7QUFDM0JBLGlCQUFLLENBQUNXLE1BQU4sR0FBZW5aLElBQUksQ0FBQ21aLE1BQUwsQ0FBWWhHLE1BQVosQ0FBbUJpRyxDQUFDLElBQUlBLENBQUMsQ0FBQ0csT0FBRixLQUFjZixLQUFLLENBQUN0WSxHQUE1QyxDQUFmO0FBQ0QsV0FGRDtBQUlBNEIsYUFBRyxDQUFDb2MsV0FBSixDQUFnQkQsU0FBaEIsRUFBMkJqZSxJQUEzQixFQUFpQ3dZLEtBQWpDLEVBQXdDQyxLQUF4QyxFQUErQzBGLElBQS9DO0FBQ0QsU0FqQ0Q7QUFrQ0Q7QUFDRixLQXpERDtBQTBERDtBQW5FTSxDQUFULEU7Ozs7Ozs7Ozs7O0FDaEJBLElBQUloYixZQUFKO0FBQWlCdkUsTUFBTSxDQUFDRyxJQUFQLENBQVksbUNBQVosRUFBZ0Q7QUFBQ29FLGNBQVksQ0FBQ2pFLENBQUQsRUFBRztBQUFDaUUsZ0JBQVksR0FBQ2pFLENBQWI7QUFBZTs7QUFBaEMsQ0FBaEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSWtFLFlBQUo7QUFBaUJ4RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxtQ0FBWixFQUFnRDtBQUFDcUUsY0FBWSxDQUFDbEUsQ0FBRCxFQUFHO0FBQUNrRSxnQkFBWSxHQUFDbEUsQ0FBYjtBQUFlOztBQUFoQyxDQUFoRCxFQUFrRixDQUFsRjtBQUFxRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJb0UsTUFBSjtBQUFXMUUsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3dFLFFBQU0sQ0FBQ3JFLENBQUQsRUFBRztBQUFDcUUsVUFBTSxHQUFDckUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFVBQVosRUFBdUI7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQXZCLEVBQTJDLENBQTNDO0FBTzdhNEgsTUFBTSxDQUFDd00sT0FBUCxDQUFlLE1BQWYsRUFBdUIsZ0JBQXVCO0FBQUEsTUFBZDtBQUFFOUI7QUFBRixHQUFjO0FBQzVDLFNBQU8vUixLQUFLLENBQUN1SixJQUFOLENBQVc7QUFBRW9JLGFBQVMsRUFBRUk7QUFBYixHQUFYLENBQVA7QUFDRCxDQUZEO0FBSUExSyxNQUFNLENBQUN3TSxPQUFQLENBQWUsa0JBQWYsRUFBbUMsaUJBQXFCO0FBQUEsTUFBWjtBQUFFNVM7QUFBRixHQUFZOztBQUN0RCxNQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNYLFdBQU8sRUFBUDtBQUNEOztBQUVELFNBQU8sQ0FBQzJDLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYTtBQUFFdEk7QUFBRixHQUFiLENBQUQsQ0FBUDtBQUNELENBTkQ7QUFRQW9HLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxpQkFBMEI7QUFBQSxNQUFqQjtBQUFFakM7QUFBRixHQUFpQjs7QUFDaEUsTUFBSSxDQUFDQSxXQUFMLEVBQWtCO0FBQ2hCLFdBQU8sRUFBUDtBQUNEOztBQUVELFNBQU8sQ0FBQ2hPLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYTtBQUFFcUk7QUFBRixHQUFiLENBQUQsQ0FBUDtBQUNELENBTkQ7QUFRQXZLLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxpQkFBOEI7QUFBQSxNQUFyQjtBQUFFNVMsVUFBRjtBQUFVOGE7QUFBVixHQUFxQjs7QUFDcEUsTUFBSSxDQUFDOWEsTUFBRCxJQUFXLENBQUM4YSxPQUFoQixFQUF5QjtBQUN2QixXQUFPLEVBQVA7QUFDRDs7QUFFRCxRQUFNL0MsS0FBSyxHQUFHbFYsTUFBTSxDQUFDdEQsT0FBUCxDQUFldWIsT0FBZixDQUFkO0FBQ0EsUUFBTWpDLE9BQU8sR0FBR2QsS0FBSyxDQUFDYyxPQUF0QjtBQUVBLFNBQU8sQ0FDTGhXLE1BQU0sQ0FBQ3lGLElBQVAsQ0FBWTtBQUFFdEksVUFBRjtBQUFVNlk7QUFBVixHQUFaLENBREssRUFFTGpXLE1BQU0sQ0FBQzBGLElBQVAsQ0FBWTtBQUFFdEksVUFBRjtBQUFVUixPQUFHLEVBQUVxWjtBQUFmLEdBQVosQ0FGSyxFQUdMcFcsWUFBWSxDQUFDNkYsSUFBYixDQUFrQjtBQUFFdEksVUFBRjtBQUFVNlk7QUFBVixHQUFsQixDQUhLLEVBSUxuVyxZQUFZLENBQUM0RixJQUFiLENBQWtCO0FBQUV0SSxVQUFGO0FBQVU4YTtBQUFWLEdBQWxCLENBSkssQ0FBUDtBQU1ELENBZEQsRTs7Ozs7Ozs7Ozs7QUMzQkE1YyxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDb0UsY0FBWSxFQUFDLE1BQUlBO0FBQWxCLENBQWQ7QUFBK0MsSUFBSWpFLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJZ0YsVUFBSjtBQUFldEYsTUFBTSxDQUFDRyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDZ0YsY0FBVSxHQUFDaEYsQ0FBWDtBQUFhOztBQUF6QixDQUF6QixFQUFvRCxDQUFwRDtBQUF1RCxJQUFJOEUsWUFBSixFQUFpQkosZUFBakIsRUFBaUNGLGNBQWpDO0FBQWdEOUUsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2lGLGNBQVksQ0FBQzlFLENBQUQsRUFBRztBQUFDOEUsZ0JBQVksR0FBQzlFLENBQWI7QUFBZSxHQUFoQzs7QUFBaUMwRSxpQkFBZSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxtQkFBZSxHQUFDMUUsQ0FBaEI7QUFBa0IsR0FBdEU7O0FBQXVFd0UsZ0JBQWMsQ0FBQ3hFLENBQUQsRUFBRztBQUFDd0Usa0JBQWMsR0FBQ3hFLENBQWY7QUFBaUI7O0FBQTFHLENBQWpDLEVBQTZJLENBQTdJO0FBUzFPLE1BQU0rRCxZQUFZLEdBQUcsSUFBSW9MLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixlQUFyQixDQUFyQjtBQUVQckwsWUFBWSxDQUFDeUwsT0FBYixDQUFxQjtBQUNuQnNMLGFBQVcsR0FBRztBQUNaLFFBQUksS0FBS3BhLElBQVQsRUFBZTtBQUNiLGFBQU8sS0FBS0EsSUFBWjtBQUNEOztBQUVELFVBQU11RSxJQUFJLEdBQUdELFVBQVUsQ0FBQ3VDLFFBQVgsQ0FBb0IsS0FBS3dQLFdBQXpCLENBQWI7QUFDQSxVQUFNb0ksSUFBSSxhQUFNbGEsSUFBTixlQUFlLEtBQUtzVCxnQkFBcEIsTUFBVjtBQUNBLFFBQUk2RyxPQUFKOztBQUNBLFlBQVEsS0FBS3JJLFdBQWI7QUFDRSxXQUFLLE9BQUw7QUFDRXFJLGVBQU8sb0JBQVFwYSxVQUFVLENBQUN1QyxRQUFYLENBQW9CLEtBQUttUixlQUF6QixDQUFSLENBQVA7O0FBQ0EsWUFBSSxLQUFLQSxlQUFMLEtBQXlCLE1BQTdCLEVBQXFDO0FBQ25DMEcsaUJBQU8sZUFBUSxLQUFLQyxXQUFMLENBQWlCbEosSUFBakIsQ0FBc0IsR0FBdEIsQ0FBUixNQUFQO0FBQ0Q7O0FBQ0Q7O0FBQ0YsV0FBSyxZQUFMO0FBQ0VpSixlQUFPLG9CQUFRLEtBQUt0RyxXQUFMLEdBQW1CLENBQTNCLENBQVA7QUFDQTs7QUFDRjtBQUNFNVgsZUFBTyxDQUFDSSxLQUFSLGdDQUFzQyxLQUFLeVYsV0FBM0M7QUFDQSxlQUFPb0ksSUFBUDtBQVpKOztBQWVBLHFCQUFVQSxJQUFWLGNBQWtCQyxPQUFsQjtBQUNEOztBQXpCa0IsQ0FBckIsRSxDQTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXJiLFlBQVksQ0FBQ3ViLFlBQWIsR0FBNEIsQ0FBQyxPQUFELEVBQVUsWUFBVixDQUE1QixDLENBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0F2YixZQUFZLENBQUN3YixpQkFBYixHQUFpQyxDQUFDLE1BQUQsRUFBUyxRQUFULENBQWpDLEMsQ0FDQTtBQUNBO0FBRUE7QUFDQTs7QUFDQXhiLFlBQVksQ0FBQ3liLG1CQUFiLEdBQW1DLE1BQU0sRUFBTixHQUFXLEVBQVgsR0FBZ0IsRUFBbkQsQyxDQUVBO0FBQ0E7O0FBQ0F6YixZQUFZLENBQUMwYix1QkFBYixHQUF1QyxJQUFJLEVBQTNDO0FBRUExYixZQUFZLENBQUNnRSxNQUFiLEdBQXNCLElBQUlqSSxZQUFKLENBQWlCO0FBQ3JDO0FBQ0FZLE1BQUksRUFBRTtBQUNKdUUsUUFBSSxFQUFFQyxNQURGO0FBRUpzTCxPQUFHLEVBQUUsR0FGRDtBQUdKckwsWUFBUSxFQUFFLElBSE47O0FBSUptTCxVQUFNLEdBQUc7QUFDUCxVQUFJLEtBQUs1SyxLQUFMLElBQWMzQixZQUFZLENBQUMrRixJQUFiLENBQWtCO0FBQUVwSixZQUFJLEVBQUUsS0FBS21KO0FBQWIsT0FBbEIsRUFBd0NFLEtBQXhDLEtBQWtELENBQXBFLEVBQXVFO0FBQ3JFLGVBQU8sV0FBUDtBQUNEO0FBQ0YsS0FSRyxDQVNKOzs7QUFUSSxHQUYrQjtBQWNyQztBQUNBO0FBQ0FnTixhQUFXLEVBQUU7QUFDWDlSLFFBQUksRUFBRUMsTUFESztBQUVYK0IsaUJBQWEsRUFBRWxELFlBQVksQ0FBQ3ViO0FBRmpCLEdBaEJ3QjtBQXFCckM7QUFDQTtBQUNBO0FBQ0E7QUFDQS9HLGtCQUFnQixFQUFFO0FBQ2hCdFQsUUFBSSxFQUFFbkYsWUFBWSxDQUFDcVEsT0FESDtBQUVoQkssT0FBRyxFQUFFek0sWUFBWSxDQUFDeWIsbUJBRkY7QUFHaEI7QUFDQTtBQUNBalAsT0FBRyxFQUFFO0FBTFcsR0F6Qm1CO0FBaUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBbUksaUJBQWUsRUFBRTtBQUNmelQsUUFBSSxFQUFFQyxNQURTO0FBRWYrQixpQkFBYSxFQUFFbEQsWUFBWSxDQUFDd2IsaUJBRmI7QUFHZnJaLGdCQUFZLEVBQUUsTUFIQztBQUlmZixZQUFRLEVBQUU7QUFKSyxHQXJDb0I7QUE0Q3JDO0FBQ0E7QUFDQWthLGFBQVcsRUFBRTtBQUNYcGEsUUFBSSxFQUFFd0MsS0FESztBQUVYO0FBQ0E7QUFDQXRDLFlBQVEsRUFBRTtBQUpDLEdBOUN3QjtBQW9EckMsbUJBQWlCO0FBQ2ZGLFFBQUksRUFBRUM7QUFEUyxHQXBEb0I7QUF3RHJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E0VCxhQUFXLEVBQUU7QUFDWDdULFFBQUksRUFBRW5GLFlBQVksQ0FBQ3FRLE9BRFI7QUFFWDtBQUNBSyxPQUFHLEVBQUUsVUFITTtBQUlYRCxPQUFHLEVBQUUsQ0FKTTtBQUtYcEwsWUFBUSxFQUFFO0FBTEM7QUE1RHdCLENBQWpCLENBQXRCO0FBcUVBcEIsWUFBWSxDQUFDZ0UsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCbE0sZUFBM0I7QUFDQVgsWUFBWSxDQUFDZ0UsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCcE0sY0FBM0I7QUFDQVQsWUFBWSxDQUFDZ0UsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCOUwsWUFBWSxDQUFDLFNBQUQsQ0FBdkM7QUFDQWYsWUFBWSxDQUFDZ0UsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCOUwsWUFBWSxDQUFDLGFBQUQsQ0FBdkM7QUFDQWYsWUFBWSxDQUFDOE0sWUFBYixDQUEwQjlNLFlBQVksQ0FBQ2dFLE1BQXZDLEU7Ozs7Ozs7Ozs7O0FDNUlBckksTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQytmLG1CQUFpQixFQUFDLE1BQUlBLGlCQUF2QjtBQUF5Q0MsbUJBQWlCLEVBQUMsTUFBSUE7QUFBL0QsQ0FBZDtBQUFpRyxJQUFJN2YsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkyVCxlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSStELFlBQUo7QUFBaUJyRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDa0UsY0FBWSxDQUFDL0QsQ0FBRCxFQUFHO0FBQUMrRCxnQkFBWSxHQUFDL0QsQ0FBYjtBQUFlOztBQUFoQyxDQUFqQyxFQUFtRSxDQUFuRTtBQUFzRSxJQUFJdUUsUUFBSjtBQUFhN0UsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQzBFLFVBQVEsQ0FBQ3ZFLENBQUQsRUFBRztBQUFDdUUsWUFBUSxHQUFDdkUsQ0FBVDtBQUFXOztBQUF4QixDQUFwQyxFQUE4RCxDQUE5RDtBQU1uWCxNQUFNMGYsaUJBQWlCLEdBQUcsSUFBSS9MLGVBQUosQ0FBb0I7QUFDbkRqVCxNQUFJLEVBQUUsNkJBRDZDO0FBR25Ea1QsVUFBUSxFQUFFN1AsWUFBWSxDQUFDZ0UsTUFBYixDQUNQbUYsSUFETyxDQUVOLE1BRk0sRUFHTixhQUhNLEVBSU4sa0JBSk0sRUFLTixpQkFMTSxFQU1OLGFBTk0sRUFPTixlQVBNLEVBUU4sYUFSTSxFQVVQNEcsU0FWTyxFQUh5Qzs7QUFlbkRDLEtBQUcsQ0FBQytDLFdBQUQsRUFBYztBQUNmLFFBQUksQ0FBQyxLQUFLblIsTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0Q7O0FBRUQyQixnQkFBWSxDQUFDd0ksTUFBYixDQUFvQnVLLFdBQXBCO0FBQ0Q7O0FBckJrRCxDQUFwQixDQUExQjtBQXdCQSxNQUFNNkksaUJBQWlCLEdBQUcsSUFBSWhNLGVBQUosQ0FBb0I7QUFDbkRqVCxNQUFJLEVBQUUsNkJBRDZDO0FBR25Ea1QsVUFBUSxFQUFFN1AsWUFBWSxDQUFDZ0UsTUFBYixDQUNQbUYsSUFETyxDQUNGLE1BREUsRUFFUDBELE1BRk8sQ0FHTixJQUFJOVEsWUFBSixDQUFpQjtBQUNmb1UsWUFBUSxFQUFFO0FBQ1JqUCxVQUFJLEVBQUVnQixPQURFO0FBRVJkLGNBQVEsRUFBRTtBQUZGO0FBREssR0FBakIsQ0FITSxFQVVQeUwsTUFWTyxDQVVBck0sUUFWQSxFQVdQdVAsU0FYTyxFQUh5Qzs7QUFnQm5EQyxLQUFHLE9BQTBCO0FBQUEsUUFBekI7QUFBRS9TLFNBQUY7QUFBT04sVUFBUDtBQUFhd1Q7QUFBYixLQUF5Qjs7QUFDM0IsUUFBSSxDQUFDLEtBQUt2TyxNQUFWLEVBQWtCO0FBQ2hCLFlBQU0sSUFBSXZELEtBQUosQ0FBVSxjQUFWLENBQU47QUFDRDs7QUFDRCxVQUFNMFUsV0FBVyxHQUFHL1MsWUFBWSxDQUFDaEQsT0FBYixDQUFxQkMsR0FBckIsQ0FBcEI7O0FBQ0EsUUFBSSxDQUFDOFYsV0FBTCxFQUFrQjtBQUNoQixZQUFNLElBQUkxVSxLQUFKLENBQVUsV0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTXVKLElBQUksR0FBRyxFQUFiO0FBQUEsVUFDRUMsTUFBTSxHQUFHLEVBRFg7O0FBRUEsUUFBSWxMLElBQUksS0FBS2tGLFNBQWIsRUFBd0I7QUFDdEIrRixVQUFJLENBQUNqTCxJQUFMLEdBQVlBLElBQVo7QUFDRDs7QUFDRCxRQUFJd1QsUUFBUSxLQUFLdE8sU0FBakIsRUFBNEI7QUFDMUIsVUFBSXNPLFFBQUosRUFBYztBQUNaLFlBQUk0QyxXQUFXLENBQUNqUixVQUFoQixFQUE0QjtBQUMxQixnQkFBTSxJQUFJekQsS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEdUosWUFBSSxDQUFDOUYsVUFBTCxHQUFrQixJQUFJQyxJQUFKLEVBQWxCO0FBQ0E2RixZQUFJLENBQUNwRyxZQUFMLEdBQW9CLEtBQUtJLE1BQXpCO0FBQ0Q7O0FBQ0QsVUFBSSxDQUFDdU8sUUFBTCxFQUFlO0FBQ2IsWUFBSSxDQUFDNEMsV0FBVyxDQUFDalIsVUFBakIsRUFBNkI7QUFDM0IsZ0JBQU0sSUFBSXpELEtBQUosQ0FBVSxXQUFWLENBQU47QUFDRDs7QUFFRHdKLGNBQU0sQ0FBQy9GLFVBQVAsR0FBb0IsSUFBcEI7QUFDQStGLGNBQU0sQ0FBQ3JHLFlBQVAsR0FBc0IsSUFBdEI7QUFDRDtBQUNGOztBQUVELFVBQU1rTixRQUFRLEdBQUcsRUFBakI7O0FBQ0EsUUFBSWpRLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXRHLElBQVosRUFBa0JvQixNQUFsQixHQUEyQixDQUEvQixFQUFrQztBQUNoQzBGLGNBQVEsQ0FBQzlHLElBQVQsR0FBZ0JBLElBQWhCO0FBQ0Q7O0FBQ0QsUUFBSW5KLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWXJHLE1BQVosRUFBb0JtQixNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNsQzBGLGNBQVEsQ0FBQzdHLE1BQVQsR0FBa0JBLE1BQWxCO0FBQ0Q7O0FBQ0QsUUFBSXBKLE1BQU0sQ0FBQ3lQLElBQVAsQ0FBWVEsUUFBWixFQUFzQjFGLE1BQXRCLEtBQWlDLENBQXJDLEVBQXdDO0FBQ3RDO0FBQ0Q7O0FBRURoSixnQkFBWSxDQUFDdUksTUFBYixDQUFvQnRMLEdBQXBCLEVBQXlCeVIsUUFBekI7QUFDRDs7QUE3RGtELENBQXBCLENBQTFCLEM7Ozs7Ozs7Ozs7O0FDOUJQLElBQUkxTyxZQUFKO0FBQWlCckUsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ2tFLGNBQVksQ0FBQy9ELENBQUQsRUFBRztBQUFDK0QsZ0JBQVksR0FBQy9ELENBQWI7QUFBZTs7QUFBaEMsQ0FBbEMsRUFBb0UsQ0FBcEU7QUFFakI0SCxNQUFNLENBQUN3TSxPQUFQLENBQWUscUJBQWYsRUFBc0MsZ0JBQXVCO0FBQUEsTUFBZDtBQUFFRjtBQUFGLEdBQWM7O0FBQzNELE1BQUksQ0FBQyxLQUFLdk8sTUFBVixFQUFrQjtBQUNoQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJdU8sUUFBUSxLQUFLdE8sU0FBakIsRUFBNEI7QUFDMUIsV0FBTzdCLFlBQVksQ0FBQytGLElBQWIsRUFBUDtBQUNEOztBQUVELFNBQU8vRixZQUFZLENBQUMrRixJQUFiLENBQWtCO0FBQUVqRSxjQUFVLEVBQUU7QUFBRXFOLGFBQU8sRUFBRWpOLE9BQU8sQ0FBQ2lPLFFBQUQ7QUFBbEI7QUFBZCxHQUFsQixDQUFQO0FBQ0QsQ0FWRCxFOzs7Ozs7Ozs7OztBQ0ZBeFUsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2lnQixnQkFBYyxFQUFDLE1BQUlBO0FBQXBCLENBQWQ7QUFBbUQsSUFBSWpNLGVBQUo7QUFBb0JqVSxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDOFQsaUJBQWUsQ0FBQzNULENBQUQsRUFBRztBQUFDMlQsbUJBQWUsR0FBQzNULENBQWhCO0FBQWtCOztBQUF0QyxDQUExQyxFQUFrRixDQUFsRjtBQUFxRixJQUFJRixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSWdFLFlBQUo7QUFBaUJ0RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDbUUsY0FBWSxDQUFDaEUsQ0FBRCxFQUFHO0FBQUNnRSxnQkFBWSxHQUFDaEUsQ0FBYjtBQUFlOztBQUFoQyxDQUFqQyxFQUFtRSxDQUFuRTtBQU83VCxNQUFNNGYsY0FBYyxHQUFHLElBQUlqTSxlQUFKLENBQW9CO0FBQ2hEalQsTUFBSSxFQUFFLDBCQUQwQztBQUdoRGtULFVBQVEsRUFBRSxJQUFJOVQsWUFBSixDQUFpQjtBQUN6QndTLFlBQVEsRUFBRTtBQUNSck4sVUFBSSxFQUFFQyxNQURFO0FBRVJFLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBRmxCLEtBRGU7QUFLekI5RCxVQUFNLEVBQUU7QUFDTnlELFVBQUksRUFBRUMsTUFEQTtBQUVORSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQyxFQUZwQjtBQUdOSCxjQUFRLEVBQUU7QUFISixLQUxpQjtBQVV6QmdOLGVBQVcsRUFBRTtBQUNYbE4sVUFBSSxFQUFFQyxNQURLO0FBRVhFLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDLEVBRmY7QUFHWEgsY0FBUSxFQUFFO0FBSEMsS0FWWTtBQWV6QjBCLFFBQUksRUFBRTtBQUNKNUIsVUFBSSxFQUFFQztBQURGO0FBZm1CLEdBQWpCLEVBa0JQNE8sU0FsQk8sRUFIc0M7O0FBdUJoREMsS0FBRyxPQUFtRDtBQUFBLFFBQWxEO0FBQUV6QixjQUFGO0FBQVk5USxZQUFaO0FBQW9CMlEsaUJBQXBCO0FBQWlDdEwsVUFBSSxFQUFFZ1o7QUFBdkMsS0FBa0Q7QUFDcEQsVUFBTWpILE1BQU0sR0FBR3pVLE9BQU8sQ0FBQ3BELE9BQVIsQ0FBZ0J1UixRQUFoQixDQUFmOztBQUNBLFFBQUksQ0FBQ3NHLE1BQUwsRUFBYTtBQUNYLFlBQU0sSUFBSXhXLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBQ0Q7O0FBQ0QsUUFBSSxDQUFDWixNQUFELElBQVcsQ0FBQzJRLFdBQWhCLEVBQTZCO0FBQzNCLFlBQU0sSUFBSS9QLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBTXlFLElBQUksR0FBRzZCLElBQUksQ0FBQzBPLEtBQUwsQ0FBV3lJLE9BQVgsQ0FBYjtBQUNBN2IsZ0JBQVksQ0FBQ3VJLE1BQWIsQ0FDRTtBQUFFK0YsY0FBRjtBQUFZOVEsWUFBWjtBQUFvQjJRLGlCQUFwQjtBQUFpQ3RMO0FBQWpDLEtBREYsRUFFRTtBQUNFbU4saUJBQVcsRUFBRSxLQURmO0FBRUVDLFlBQU0sRUFBRSxLQUZWO0FBR0VMLGNBQVEsRUFBRSxLQUhaO0FBSUUwRCxpQkFBVyxFQUFFLEtBSmY7QUFLRUMsd0JBQWtCLEVBQUU7QUFMdEIsS0FGRjtBQVVEOztBQTNDK0MsQ0FBcEIsQ0FBdkIsQzs7Ozs7Ozs7Ozs7QUNQUDdYLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNxRSxjQUFZLEVBQUMsTUFBSUE7QUFBbEIsQ0FBZDtBQUErQyxJQUFJbEUsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkrRSxTQUFKLEVBQWNMLGVBQWQsRUFBOEJFLGNBQTlCO0FBQTZDbEYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2tGLFdBQVMsQ0FBQy9FLENBQUQsRUFBRztBQUFDK0UsYUFBUyxHQUFDL0UsQ0FBVjtBQUFZLEdBQTFCOztBQUEyQjBFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQixHQUFoRTs7QUFBaUU0RSxnQkFBYyxDQUFDNUUsQ0FBRCxFQUFHO0FBQUM0RSxrQkFBYyxHQUFDNUUsQ0FBZjtBQUFpQjs7QUFBcEcsQ0FBakMsRUFBdUksQ0FBdkk7QUFRakssTUFBTWdFLFlBQVksR0FBRyxJQUFJbUwsS0FBSyxDQUFDQyxVQUFWLENBQXFCLGVBQXJCLENBQXJCO0FBRVBwTCxZQUFZLENBQUMrRCxNQUFiLEdBQXNCLElBQUlqSSxZQUFKLENBQWlCLEVBQWpCLENBQXRCO0FBRUFrRSxZQUFZLENBQUMrRCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkJsTSxlQUEzQjtBQUNBVixZQUFZLENBQUMrRCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkJoTSxjQUEzQjtBQUNBWixZQUFZLENBQUMrRCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkI3TCxTQUFTLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBcEM7QUFDQWYsWUFBWSxDQUFDK0QsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCN0wsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsS0FBaEIsQ0FBcEM7QUFDQWYsWUFBWSxDQUFDK0QsTUFBYixDQUFvQjZJLE1BQXBCLENBQTJCN0wsU0FBUyxDQUFDLFNBQUQsQ0FBcEM7QUFDQWYsWUFBWSxDQUFDNk0sWUFBYixDQUEwQjdNLFlBQVksQ0FBQytELE1BQXZDLEU7Ozs7Ozs7Ozs7O0FDakJBckksTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ21nQixXQUFTLEVBQUMsTUFBSUE7QUFBZixDQUFkO0FBQXlDLElBQUluTSxlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUYsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkrZixVQUFKO0FBQWVyZ0IsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVosRUFBK0I7QUFBQ2tnQixZQUFVLENBQUMvZixDQUFELEVBQUc7QUFBQytmLGNBQVUsR0FBQy9mLENBQVg7QUFBYTs7QUFBNUIsQ0FBL0IsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFPbFQsTUFBTThmLFNBQVMsR0FBRyxJQUFJbk0sZUFBSixDQUFvQjtBQUMzQ2pULE1BQUksRUFBRSx3QkFEcUM7QUFHM0NrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJ3UyxZQUFRLEVBQUU7QUFDUnJOLFVBQUksRUFBRUMsTUFERTtBQUVSRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZsQixLQURlO0FBS3pCZ1gsV0FBTyxFQUFFO0FBQ1ByWCxVQUFJLEVBQUVDLE1BREM7QUFFUEUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGbkI7QUFHUEgsY0FBUSxFQUFFO0FBSEgsS0FMZ0I7QUFVekJrVixXQUFPLEVBQUU7QUFDUHBWLFVBQUksRUFBRUMsTUFEQztBQUVQRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQyxFQUZuQjtBQUdQSCxjQUFRLEVBQUU7QUFISCxLQVZnQjtBQWV6QjNELFVBQU0sRUFBRTtBQUNOeUQsVUFBSSxFQUFFQyxNQURBO0FBRU5FLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDLEVBRnBCO0FBR05ILGNBQVEsRUFBRTtBQUhKLEtBZmlCO0FBb0J6QnpFLFFBQUksRUFBRTtBQUNKdUUsVUFBSSxFQUFFQyxNQURGO0FBRUpzTCxTQUFHLEVBQUU7QUFGRCxLQXBCbUI7QUF3QnpCd1AsWUFBUSxFQUFFO0FBQ1IvYSxVQUFJLEVBQUVDO0FBREU7QUF4QmUsR0FBakIsRUEyQlA0TyxTQTNCTyxFQUhpQzs7QUFnQzNDQyxLQUFHLE9BQXlEO0FBQUEsUUFBeEQ7QUFBRXpCLGNBQUY7QUFBWTlRLFlBQVo7QUFBb0I2WSxhQUFwQjtBQUE2QmlDLGFBQTdCO0FBQXNDNWIsVUFBdEM7QUFBNENzZjtBQUE1QyxLQUF3RDtBQUMxRCxVQUFNcEgsTUFBTSxHQUFHelUsT0FBTyxDQUFDcEQsT0FBUixDQUFnQnVSLFFBQWhCLENBQWY7O0FBQ0EsUUFBSSxDQUFDc0csTUFBTCxFQUFhO0FBQ1gsWUFBTSxJQUFJeFcsS0FBSixDQUFVLGtCQUFWLENBQU47QUFDRDs7QUFFRDJkLGNBQVUsQ0FBQ3hULE1BQVgsQ0FDRTtBQUFFK0YsY0FBRjtBQUFZOVEsWUFBWjtBQUFvQjZZLGFBQXBCO0FBQTZCaUMsYUFBN0I7QUFBc0M1YixVQUF0QztBQUE0Q3NmO0FBQTVDLEtBREYsRUFFRTtBQUNFaE0saUJBQVcsRUFBRSxLQURmO0FBRUVDLFlBQU0sRUFBRSxLQUZWO0FBR0VMLGNBQVEsRUFBRSxLQUhaO0FBSUUwRCxpQkFBVyxFQUFFLEtBSmY7QUFLRUMsd0JBQWtCLEVBQUU7QUFMdEIsS0FGRjtBQVVEOztBQWhEMEMsQ0FBcEIsQ0FBbEIsQzs7Ozs7Ozs7Ozs7QUNQUDdYLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNvZ0IsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSWpnQixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBFLGVBQUosRUFBb0JLLFNBQXBCO0FBQThCckYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQzZFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQixHQUF0Qzs7QUFBdUMrRSxXQUFTLENBQUMvRSxDQUFELEVBQUc7QUFBQytFLGFBQVMsR0FBQy9FLENBQVY7QUFBWTs7QUFBaEUsQ0FBakMsRUFBbUcsQ0FBbkc7QUFTOUksTUFBTStmLFVBQVUsR0FBRyxJQUFJNVEsS0FBSyxDQUFDQyxVQUFWLENBQXFCLGFBQXJCLENBQW5CO0FBRVAyUSxVQUFVLENBQUNoWSxNQUFYLEdBQW9CLElBQUlqSSxZQUFKLENBQWlCO0FBQ25Dd2MsU0FBTyxFQUFFO0FBQ1ByWCxRQUFJLEVBQUVDLE1BREM7QUFFUEUsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGbkI7QUFHUEgsWUFBUSxFQUFFO0FBSEgsR0FEMEI7QUFNbkNrVixTQUFPLEVBQUU7QUFDUHBWLFFBQUksRUFBRUMsTUFEQztBQUVQRSxTQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQyxFQUZuQjtBQUdQSCxZQUFRLEVBQUU7QUFISCxHQU4wQjtBQVduQzNELFFBQU0sRUFBRTtBQUNOeUQsUUFBSSxFQUFFQyxNQURBO0FBRU5FLFNBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDLEVBRnBCO0FBR05ILFlBQVEsRUFBRTtBQUhKLEdBWDJCO0FBZ0JuQ3pFLE1BQUksRUFBRTtBQUNKdUUsUUFBSSxFQUFFQyxNQURGO0FBRUpzTCxPQUFHLEVBQUU7QUFGRCxHQWhCNkI7QUFvQm5Dd1AsVUFBUSxFQUFFO0FBQ1IvYSxRQUFJLEVBQUVDO0FBREU7QUFwQnlCLENBQWpCLENBQXBCO0FBeUJBNmEsVUFBVSxDQUFDaFksTUFBWCxDQUFrQjZJLE1BQWxCLENBQXlCbE0sZUFBekI7QUFDQXFiLFVBQVUsQ0FBQ2hZLE1BQVgsQ0FBa0I2SSxNQUFsQixDQUF5QjdMLFNBQVMsQ0FBQyxTQUFELENBQWxDO0FBQ0FnYixVQUFVLENBQUNsUCxZQUFYLENBQXdCa1AsVUFBVSxDQUFDaFksTUFBbkMsRTs7Ozs7Ozs7Ozs7QUN0Q0FySSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDc2dCLHVCQUFxQixFQUFDLE1BQUlBO0FBQTNCLENBQWQ7QUFBaUUsSUFBSXRNLGVBQUo7QUFBb0JqVSxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDOFQsaUJBQWUsQ0FBQzNULENBQUQsRUFBRztBQUFDMlQsbUJBQWUsR0FBQzNULENBQWhCO0FBQWtCOztBQUF0QyxDQUExQyxFQUFrRixDQUFsRjtBQUFxRixJQUFJRixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSWlFLFlBQUo7QUFBaUJ2RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDb0UsY0FBWSxDQUFDakUsQ0FBRCxFQUFHO0FBQUNpRSxnQkFBWSxHQUFDakUsQ0FBYjtBQUFlOztBQUFoQyxDQUE5QixFQUFnRSxDQUFoRTtBQUFtRSxJQUFJSyxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNLLFVBQU0sR0FBQ0wsQ0FBUDtBQUFTOztBQUFyQixDQUE5QixFQUFxRCxDQUFyRDtBQUs5VSxNQUFNaWdCLHFCQUFxQixHQUFHLElBQUl0TSxlQUFKLENBQW9CO0FBQ3ZEalQsTUFBSSxFQUFFLGlDQURpRDtBQUd2RGtULFVBQVEsRUFBRSxJQUFJOVQsWUFBSixDQUFpQjtBQUN6Qm9nQixpQkFBYSxFQUFFO0FBQ2JqYixVQUFJLEVBQUVDLE1BRE87QUFFYkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGYixLQURVO0FBS3pCdEQsT0FBRyxFQUFFO0FBQ0hpRCxVQUFJLEVBQUVDO0FBREgsS0FMb0I7QUFRekIyRSxTQUFLLEVBQUU7QUFDTDVFLFVBQUksRUFBRUM7QUFERCxLQVJrQjtBQVd6QmdTLFVBQU0sRUFBRTtBQUNOalMsVUFBSSxFQUFFZ0IsT0FEQTtBQUVOZCxjQUFRLEVBQUU7QUFGSixLQVhpQjtBQWV6QmdTLGNBQVUsRUFBRTtBQUNWbFMsVUFBSSxFQUFFZ0IsT0FESTtBQUVWZCxjQUFRLEVBQUU7QUFGQTtBQWZhLEdBQWpCLEVBbUJQMk8sU0FuQk8sRUFINkM7O0FBd0J2REMsS0FBRyxPQUFvRDtBQUFBLFFBQW5EO0FBQUVtTSxtQkFBRjtBQUFpQmxlLFNBQWpCO0FBQXNCNkgsV0FBdEI7QUFBNkJxTixZQUE3QjtBQUFxQ0M7QUFBckMsS0FBbUQ7QUFDckQsVUFBTWdKLFdBQVcsR0FBR2xjLFlBQVksQ0FBQ2xELE9BQWIsQ0FBcUJtZixhQUFyQixDQUFwQjs7QUFDQSxRQUFJLENBQUNDLFdBQUwsRUFBa0I7QUFDaEIsWUFBTSxJQUFJL2QsS0FBSixDQUFVLHVCQUFWLENBQU47QUFDRCxLQUpvRCxDQUtyRDs7O0FBRUEsVUFBTXdILEdBQUcsR0FBR2xCLElBQUksQ0FBQzBPLEtBQUwsQ0FBV3ZOLEtBQVgsQ0FBWjtBQUNBLFFBQUl5QyxNQUFNLEdBQUc7QUFBRSxzQkFBU3RLLEdBQVQsSUFBaUI0SDtBQUFuQixLQUFiO0FBQ0EsVUFBTTZJLFFBQVEsR0FBR3lFLE1BQU0sR0FBRztBQUFFRyxXQUFLLEVBQUUvSztBQUFULEtBQUgsR0FBdUI7QUFBRVgsVUFBSSxFQUFFVztBQUFSLEtBQTlDO0FBRUFySSxnQkFBWSxDQUFDcUksTUFBYixDQUFvQjRULGFBQXBCLEVBQW1Dek4sUUFBbkMsRUFBNkM7QUFDM0N1QixpQkFBVyxFQUFFLEtBRDhCO0FBRTNDQyxZQUFNLEVBQUUsS0FGbUM7QUFHM0NMLGNBQVEsRUFBRSxLQUhpQztBQUkzQzBELGlCQUFXLEVBQUUsS0FKOEI7QUFLM0NDLHdCQUFrQixFQUFFO0FBTHVCLEtBQTdDOztBQVFBLFFBQUkzUCxNQUFNLENBQUM0UCxRQUFQLElBQW1CLENBQUNMLFVBQXhCLEVBQW9DO0FBQ2xDOVcsWUFBTSxDQUFDSCxZQUFQLENBQW9CO0FBQ2xCb1MsZ0JBQVEsRUFBRTZOLFdBQVcsQ0FBQzdOLFFBREo7QUFFbEI0TixxQkFGa0I7QUFHbEJDLG1CQUhrQjtBQUlsQm5lLFdBSmtCO0FBS2xCNkgsYUFBSyxFQUFFRCxHQUxXO0FBTWxCK04saUJBQVMsRUFBRXdJLFdBQVcsQ0FBQ3RaLElBQVosSUFBb0JzWixXQUFXLENBQUN0WixJQUFaLENBQWlCN0UsR0FBakIsQ0FOYjtBQU9sQmtWO0FBUGtCLE9BQXBCO0FBU0Q7QUFDRjs7QUF0RHNELENBQXBCLENBQTlCLEM7Ozs7Ozs7Ozs7O0FDTFB4WCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDc0UsY0FBWSxFQUFDLE1BQUlBO0FBQWxCLENBQWQ7QUFBK0MsSUFBSW5FLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJMEUsZUFBSixFQUFvQkUsY0FBcEIsRUFBbUNHLFNBQW5DO0FBQTZDckYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQzZFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQixHQUF0Qzs7QUFBdUM0RSxnQkFBYyxDQUFDNUUsQ0FBRCxFQUFHO0FBQUM0RSxrQkFBYyxHQUFDNUUsQ0FBZjtBQUFpQixHQUExRTs7QUFBMkUrRSxXQUFTLENBQUMvRSxDQUFELEVBQUc7QUFBQytFLGFBQVMsR0FBQy9FLENBQVY7QUFBWTs7QUFBcEcsQ0FBakMsRUFBdUksQ0FBdkk7QUFJakssTUFBTWlFLFlBQVksR0FBRyxJQUFJa0wsS0FBSyxDQUFDQyxVQUFWLENBQXFCLGVBQXJCLENBQXJCO0FBRVBuTCxZQUFZLENBQUM4RCxNQUFiLEdBQXNCLElBQUlqSSxZQUFKLENBQWlCLEVBQWpCLENBQXRCO0FBRUFtRSxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkJsTSxlQUEzQjtBQUNBVCxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkJoTSxjQUEzQjtBQUNBWCxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkI3TCxTQUFTLENBQUMsU0FBRCxDQUFwQztBQUNBZCxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkI3TCxTQUFTLENBQUMsUUFBRCxDQUFwQztBQUNBZCxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkI3TCxTQUFTLENBQUMsT0FBRCxDQUFwQztBQUNBZCxZQUFZLENBQUM4RCxNQUFiLENBQW9CNkksTUFBcEIsQ0FBMkI3TCxTQUFTLENBQUMsU0FBRCxDQUFwQztBQUNBZCxZQUFZLENBQUM0TSxZQUFiLENBQTBCNU0sWUFBWSxDQUFDOEQsTUFBdkMsRTs7Ozs7Ozs7Ozs7QUNkQXJJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUN5Z0Isa0JBQWdCLEVBQUMsTUFBSUEsZ0JBQXRCO0FBQXVDQyxvQkFBa0IsRUFBQyxNQUFJQSxrQkFBOUQ7QUFBaUZDLGVBQWEsRUFBQyxNQUFJQSxhQUFuRztBQUFpSGpILHlCQUF1QixFQUFDLE1BQUlBLHVCQUE3STtBQUFxS2tILHNCQUFvQixFQUFDLE1BQUlBLG9CQUE5TDtBQUFtTmpHLHVCQUFxQixFQUFDLE1BQUlBLHFCQUE3TztBQUFtUWtHLGdCQUFjLEVBQUMsTUFBSUE7QUFBdFIsQ0FBZDtBQUFxVCxJQUFJN0IsY0FBSixFQUFtQnZlLGFBQW5CO0FBQWlDVixNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDOGUsZ0JBQWMsQ0FBQzNlLENBQUQsRUFBRztBQUFDMmUsa0JBQWMsR0FBQzNlLENBQWY7QUFBaUIsR0FBcEM7O0FBQXFDSSxlQUFhLENBQUNKLENBQUQsRUFBRztBQUFDSSxpQkFBYSxHQUFDSixDQUFkO0FBQWdCOztBQUF0RSxDQUFsQyxFQUEwRyxDQUExRztBQUE2RyxJQUFJZ1gsbUJBQUo7QUFBd0J0WCxNQUFNLENBQUNHLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDbVgscUJBQW1CLENBQUNoWCxDQUFELEVBQUc7QUFBQ2dYLHVCQUFtQixHQUFDaFgsQ0FBcEI7QUFBc0I7O0FBQTlDLENBQXRDLEVBQXNGLENBQXRGO0FBQXlGLElBQUlpZ0IscUJBQUo7QUFBMEJ2Z0IsTUFBTSxDQUFDRyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ29nQix1QkFBcUIsQ0FBQ2pnQixDQUFELEVBQUc7QUFBQ2lnQix5QkFBcUIsR0FBQ2pnQixDQUF0QjtBQUF3Qjs7QUFBbEQsQ0FBdkMsRUFBMkYsQ0FBM0Y7QUFBOEYsSUFBSWlFLFlBQUo7QUFBaUJ2RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDb0UsY0FBWSxDQUFDakUsQ0FBRCxFQUFHO0FBQUNpRSxnQkFBWSxHQUFDakUsQ0FBYjtBQUFlOztBQUFoQyxDQUE3QyxFQUErRSxDQUEvRTtBQUFrRixJQUFJeWdCLGdCQUFKLEVBQXFCQyxlQUFyQixFQUFxQ0Msb0JBQXJDO0FBQTBEamhCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUM0Z0Isa0JBQWdCLENBQUN6Z0IsQ0FBRCxFQUFHO0FBQUN5Z0Isb0JBQWdCLEdBQUN6Z0IsQ0FBakI7QUFBbUIsR0FBeEM7O0FBQXlDMGdCLGlCQUFlLENBQUMxZ0IsQ0FBRCxFQUFHO0FBQUMwZ0IsbUJBQWUsR0FBQzFnQixDQUFoQjtBQUFrQixHQUE5RTs7QUFBK0UyZ0Isc0JBQW9CLENBQUMzZ0IsQ0FBRCxFQUFHO0FBQUMyZ0Isd0JBQW9CLEdBQUMzZ0IsQ0FBckI7QUFBdUI7O0FBQTlILENBQXBDLEVBQW9LLENBQXBLO0FBQXVLLElBQUk4ZixTQUFKO0FBQWNwZ0IsTUFBTSxDQUFDRyxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQ2lnQixXQUFTLENBQUM5ZixDQUFELEVBQUc7QUFBQzhmLGFBQVMsR0FBQzlmLENBQVY7QUFBWTs7QUFBMUIsQ0FBeEMsRUFBb0UsQ0FBcEU7QUFBdUUsSUFBSTRnQixlQUFKO0FBQW9CbGhCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUMrZ0IsaUJBQWUsQ0FBQzVnQixDQUFELEVBQUc7QUFBQzRnQixtQkFBZSxHQUFDNWdCLENBQWhCO0FBQWtCOztBQUF0QyxDQUFuQyxFQUEyRSxDQUEzRTtBQUE4RSxJQUFJNmdCLGVBQUo7QUFBb0JuaEIsTUFBTSxDQUFDRyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ2doQixpQkFBZSxDQUFDN2dCLENBQUQsRUFBRztBQUFDNmdCLG1CQUFlLEdBQUM3Z0IsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQW5DLEVBQTJFLENBQTNFO0FBQThFLElBQUk4Z0IsaUJBQUosRUFBc0JDLHFCQUF0QjtBQUE0Q3JoQixNQUFNLENBQUNHLElBQVAsQ0FBWSxXQUFaLEVBQXdCO0FBQUNpaEIsbUJBQWlCLENBQUM5Z0IsQ0FBRCxFQUFHO0FBQUM4Z0IscUJBQWlCLEdBQUM5Z0IsQ0FBbEI7QUFBb0IsR0FBMUM7O0FBQTJDK2dCLHVCQUFxQixDQUFDL2dCLENBQUQsRUFBRztBQUFDK2dCLHlCQUFxQixHQUFDL2dCLENBQXRCO0FBQXdCOztBQUE1RixDQUF4QixFQUFzSCxDQUF0SDtBQUF5SCxJQUFJa0UsWUFBSjtBQUFpQnhFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNxRSxjQUFZLENBQUNsRSxDQUFELEVBQUc7QUFBQ2tFLGdCQUFZLEdBQUNsRSxDQUFiO0FBQWU7O0FBQWhDLENBQTlCLEVBQWdFLENBQWhFOztBQWdCLzdDLE1BQU1naEIsT0FBTyxHQUFHLFVBQUN4ZixNQUFEO0FBQUEsTUFBUzBWLE1BQVQsdUVBQWtCLEtBQWxCO0FBQUEsU0FBNEIsQ0FBQ2xWLEdBQUQsRUFBTTZILEtBQU4sS0FBZ0I7QUFDMUQ4VSxrQkFBYyxDQUFDcGQsSUFBZixDQUFvQjtBQUNsQkMsWUFEa0I7QUFFbEJRLFNBRmtCO0FBR2xCNkgsV0FBSyxFQUFFbkIsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixLQUFmLENBSFc7QUFJbEJxTixZQUprQjtBQUtsQkMsZ0JBQVUsRUFBRXZQLE1BQU0sQ0FBQzRQO0FBTEQsS0FBcEI7QUFPRCxHQVJlO0FBQUEsQ0FBaEI7O0FBVUEsTUFBTXlKLFlBQVksR0FBRyxVQUFDOU8sV0FBRDtBQUFBLE1BQWMrRSxNQUFkLHVFQUF1QixLQUF2QjtBQUFBLFNBQWlDLENBQUNsVixHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQ3BFbU4sdUJBQW1CLENBQUN6VixJQUFwQixDQUF5QjtBQUN2QjRRLGlCQUR1QjtBQUV2Qm5RLFNBRnVCO0FBR3ZCNkgsV0FBSyxFQUFFbkIsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixLQUFmLENBSGdCO0FBSXZCcU4sWUFKdUI7QUFLdkJDLGdCQUFVLEVBQUV2UCxNQUFNLENBQUM0UDtBQUxJLEtBQXpCO0FBT0QsR0FSb0I7QUFBQSxDQUFyQjs7QUFVQSxNQUFNMEosU0FBUyxHQUFHLFVBQUM1TyxRQUFEO0FBQUEsTUFBVzRFLE1BQVgsdUVBQW9CLEtBQXBCO0FBQUEsU0FBOEIsQ0FBQ2xWLEdBQUQsRUFBTTZILEtBQU4sS0FBZ0I7QUFDOUQ0VyxvQkFBZ0IsQ0FBQ2xmLElBQWpCLENBQXNCO0FBQ3BCK1EsY0FEb0I7QUFFcEJ0USxTQUZvQjtBQUdwQjZILFdBQUssRUFBRW5CLElBQUksQ0FBQ0MsU0FBTCxDQUFla0IsS0FBZixDQUhhO0FBSXBCcU4sWUFKb0I7QUFLcEJDLGdCQUFVLEVBQUV2UCxNQUFNLENBQUM0UDtBQUxDLEtBQXRCO0FBT0QsR0FSaUI7QUFBQSxDQUFsQjs7QUFTQSxNQUFNMkosUUFBUSxHQUFHLFVBQUNDLGFBQUQ7QUFBQSxNQUFnQmxLLE1BQWhCLHVFQUF5QixLQUF6QjtBQUFBLFNBQW1DLENBQUNsVixHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQ2xFa1gseUJBQXFCLENBQUN4ZixJQUF0QixDQUEyQjtBQUN6QjZmLG1CQUR5QjtBQUV6QnBmLFNBRnlCO0FBR3pCNkgsV0FBSyxFQUFFbkIsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixLQUFmLENBSGtCO0FBSXpCcU4sWUFKeUI7QUFLekJDLGdCQUFVLEVBQUV2UCxNQUFNLENBQUM0UDtBQUxNLEtBQTNCO0FBT0QsR0FSZ0I7QUFBQSxDQUFqQjs7QUFTQSxNQUFNNkosV0FBVyxHQUFHRCxhQUFhLElBQUlFLEVBQUUsSUFBSTtBQUN6Q1IsbUJBQWlCLENBQUN2ZixJQUFsQixDQUNFO0FBQ0U2ZixpQkFERjtBQUVFakssY0FBVSxFQUFFdlAsTUFBTSxDQUFDNFA7QUFGckIsR0FERixFQUtFOEosRUFMRjtBQU9ELENBUkQ7O0FBU0EsTUFBTUMsUUFBUSxHQUFHLFVBQUNyQixhQUFEO0FBQUEsTUFBZ0JoSixNQUFoQix1RUFBeUIsS0FBekI7QUFBQSxTQUFtQyxDQUFDbFYsR0FBRCxFQUFNNkgsS0FBTixLQUFnQjtBQUNsRW9XLHlCQUFxQixDQUFDMWUsSUFBdEIsQ0FBMkI7QUFDekIyZSxtQkFEeUI7QUFFekJsZSxTQUZ5QjtBQUd6QjZILFdBQUssRUFBRW5CLElBQUksQ0FBQ0MsU0FBTCxDQUFla0IsS0FBZixDQUhrQjtBQUl6QnFOLFlBSnlCO0FBS3pCQyxnQkFBVSxFQUFFdlAsTUFBTSxDQUFDNFA7QUFMTSxLQUEzQjtBQU9ELEdBUmdCO0FBQUEsQ0FBakIsQyxDQVVBO0FBQ0E7OztBQUNBLE1BQU1pRCxHQUFHLEdBQUcsQ0FBQzVYLEdBQUQsRUFBTWxDLElBQU4sS0FBZSxDQUFDZ2EsQ0FBRCxFQUFJM2EsQ0FBSixLQUFVO0FBQ25DLFFBQU00SixHQUFHLEdBQUc1SixDQUFDLEtBQUs0RixTQUFOLEdBQWtCLElBQWxCLEdBQXlCNUYsQ0FBckM7QUFDQVcsTUFBSSxDQUFDZ2EsQ0FBRCxFQUFJL1EsR0FBSixDQUFKO0FBQ0EvRyxLQUFHLENBQUM4WCxDQUFELENBQUgsR0FBUy9RLEdBQVQ7QUFDRCxDQUpEOztBQU1BLE1BQU1zTixNQUFNLEdBQUcsQ0FBQ3JVLEdBQUQsRUFBTWxDLElBQU4sS0FBZSxDQUFDZ2EsQ0FBRCxFQUFJM2EsQ0FBSixLQUFVO0FBQ3RDLFFBQU00SixHQUFHLEdBQUc1SixDQUFDLEtBQUs0RixTQUFOLEdBQWtCLElBQWxCLEdBQXlCNUYsQ0FBckM7QUFDQVcsTUFBSSxDQUFDZ2EsQ0FBRCxFQUFJL1EsR0FBSixDQUFKOztBQUNBLE1BQUksQ0FBQy9HLEdBQUcsQ0FBQzhYLENBQUQsQ0FBUixFQUFhO0FBQ1g5WCxPQUFHLENBQUM4WCxDQUFELENBQUgsR0FBUyxFQUFUO0FBQ0Q7O0FBQ0Q5WCxLQUFHLENBQUM4WCxDQUFELENBQUgsQ0FBT3JOLElBQVAsQ0FBWTFELEdBQVo7QUFDRCxDQVBEOztBQVNBLE1BQU00WCxRQUFRLEdBQUcsTUFBTTtBQUNyQixRQUFNLDhHQUFOO0FBQ0QsQ0FGRDs7QUFJTyxNQUFNcEIsZ0JBQWdCLEdBQUczSixTQUFTLElBQUk7QUFDM0NBLFdBQVMsQ0FBQ3NELEdBQVYsR0FBZ0IvWCxHQUFHLElBQUl5VSxTQUFTLENBQUM1UCxJQUFWLENBQWU3RSxHQUFmLENBQXZCOztBQUNBeVUsV0FBUyxDQUFDZ0UsR0FBVixHQUFnQkEsR0FBRyxDQUFDaEUsU0FBUyxDQUFDNVAsSUFBWCxFQUFpQm9hLFlBQVksQ0FBQ3hLLFNBQVMsQ0FBQ3pWLEdBQVgsQ0FBN0IsQ0FBbkI7QUFDQXlWLFdBQVMsQ0FBQ1MsTUFBVixHQUFtQkEsTUFBTSxDQUFDVCxTQUFTLENBQUM1UCxJQUFYLEVBQWlCb2EsWUFBWSxDQUFDeEssU0FBUyxDQUFDelYsR0FBWCxFQUFnQixJQUFoQixDQUE3QixDQUF6QjtBQUNELENBSk07O0FBTUEsTUFBTXFmLGtCQUFrQixHQUFHLFVBQ2hDekgsTUFEZ0MsRUFLN0I7QUFBQSxNQUhIVSxLQUdHLHVFQUhLLEVBR0w7QUFBQSxNQUZIQyxLQUVHLHVFQUZLLEVBRUw7QUFBQSxNQURIOUMsU0FDRyx1RUFEUyxFQUNUO0FBQ0gsUUFBTTtBQUFFelYsT0FBRyxFQUFFc1I7QUFBUCxNQUFvQnNHLE1BQTFCOztBQUVBQSxRQUFNLENBQUM2SSxJQUFQLEdBQWNDLE1BQU0sSUFDbEJmLG9CQUFvQixDQUFDcGYsSUFBckIsQ0FBMEI7QUFDeEIrUSxZQUR3QjtBQUV4QnNGLGNBQVUsRUFBRThKLE1BRlk7QUFHeEJ2UCxlQUFXLEVBQUVzRSxTQUFTLENBQUN6VjtBQUhDLEdBQTFCLENBREY7O0FBTUE0WCxRQUFNLENBQUNtQixHQUFQLEdBQWEvWCxHQUFHLElBQUk0VyxNQUFNLENBQUMvUixJQUFQLENBQVk3RSxHQUFaLENBQXBCOztBQUNBNFcsUUFBTSxDQUFDNkIsR0FBUCxHQUFhQSxHQUFHLENBQUM3QixNQUFNLENBQUMvUixJQUFSLEVBQWNxYSxTQUFTLENBQUM1TyxRQUFELENBQXZCLENBQWhCO0FBQ0FzRyxRQUFNLENBQUMxQixNQUFQLEdBQWdCQSxNQUFNLENBQUMwQixNQUFNLENBQUMvUixJQUFSLEVBQWNxYSxTQUFTLENBQUM1TyxRQUFELEVBQVcsSUFBWCxDQUF2QixDQUF0Qjs7QUFDQXNHLFFBQU0sQ0FBQ3pYLEdBQVAsR0FBYSxDQUFDVCxJQUFELEVBQU9tRyxJQUFQLEtBQWdCO0FBQzNCaVosYUFBUyxDQUFDdmUsSUFBVixDQUFlO0FBQ2IrUSxjQURhO0FBRWI1UixVQUZhO0FBR2JzZixjQUFRLEVBQUV0WCxJQUFJLENBQUNDLFNBQUwsQ0FBZTlCLElBQWYsQ0FIRztBQUlieVYsYUFBTyxFQUFFL0MsS0FBSyxDQUFDdlksR0FKRjtBQUticVosYUFBTyxFQUFFZixLQUFLLENBQUN0WSxHQUxGO0FBTWJtUixpQkFBVyxFQUFFc0UsU0FBUyxDQUFDelY7QUFOVixLQUFmO0FBUUQsR0FURDtBQVVELENBM0JNOztBQTZCQSxNQUFNc2YsYUFBYSxHQUFHLFVBQUMxSCxNQUFELEVBQStDO0FBQUEsTUFBdENXLEtBQXNDLHVFQUE5QixFQUE4QjtBQUFBLE1BQTFCRCxLQUEwQix1RUFBbEIsRUFBa0I7QUFBQSxNQUFkeFksSUFBYyx1RUFBUCxFQUFPO0FBQzFFLFFBQU07QUFBRUUsT0FBRyxFQUFFc1I7QUFBUCxNQUFvQnNHLE1BQTFCOztBQUVBQSxRQUFNLENBQUM2SSxJQUFQLEdBQWNDLE1BQU0sSUFDbEJoQixlQUFlLENBQUNuZixJQUFoQixDQUFxQjtBQUNuQitRLFlBRG1CO0FBRW5Cc0YsY0FBVSxFQUFFOEosTUFGTztBQUduQmxnQixVQUFNLEVBQUVWLElBQUksQ0FBQ0U7QUFITSxHQUFyQixDQURGOztBQU1BNFgsUUFBTSxDQUFDbUIsR0FBUCxHQUFhL1gsR0FBRyxJQUFJNFcsTUFBTSxDQUFDL1IsSUFBUCxDQUFZN0UsR0FBWixDQUFwQjs7QUFDQTRXLFFBQU0sQ0FBQzZCLEdBQVAsR0FBYUEsR0FBRyxDQUFDN0IsTUFBTSxDQUFDL1IsSUFBUixFQUFjcWEsU0FBUyxDQUFDNU8sUUFBRCxDQUF2QixDQUFoQjtBQUNBc0csUUFBTSxDQUFDMUIsTUFBUCxHQUFnQkEsTUFBTSxDQUFDMEIsTUFBTSxDQUFDL1IsSUFBUixFQUFjcWEsU0FBUyxDQUFDNU8sUUFBRCxFQUFXLElBQVgsQ0FBdkIsQ0FBdEI7O0FBQ0FzRyxRQUFNLENBQUN6WCxHQUFQLEdBQWEsQ0FBQ1QsSUFBRCxFQUFPbUcsSUFBUCxLQUFnQjtBQUMzQmlaLGFBQVMsQ0FBQ3ZlLElBQVYsQ0FBZTtBQUNiK1EsY0FEYTtBQUViNVIsVUFGYTtBQUdic2YsY0FBUSxFQUFFdFgsSUFBSSxDQUFDQyxTQUFMLENBQWU5QixJQUFmLENBSEc7QUFJYnlWLGFBQU8sRUFBRS9DLEtBQUssQ0FBQ3ZZLEdBSkY7QUFLYnFaLGFBQU8sRUFBRWYsS0FBSyxDQUFDdFksR0FMRjtBQU1iUSxZQUFNLEVBQUVWLElBQUksQ0FBQ0U7QUFOQSxLQUFmO0FBUUQsR0FURDtBQVVELENBdEJNOztBQXdCQSxNQUFNcVksdUJBQXVCLEdBQUcsVUFDckNULE1BRHFDLEVBS2xDO0FBQUEsTUFISFcsS0FHRyx1RUFISyxFQUdMO0FBQUEsTUFGSEQsS0FFRyx1RUFGSyxFQUVMO0FBQUEsTUFESHhZLElBQ0csdUVBREksRUFDSjtBQUNILFFBQU07QUFBRUUsT0FBRyxFQUFFc1I7QUFBUCxNQUFvQnNHLE1BQTFCO0FBRUEwSCxlQUFhLENBQUMxSCxNQUFELEVBQVNXLEtBQVQsRUFBZ0JELEtBQWhCLEVBQXVCeFksSUFBdkIsQ0FBYjs7QUFFQSxNQUFJeVksS0FBSixFQUFXO0FBQ1QsVUFBTW9JLFdBQVcsR0FBR3pkLFlBQVksQ0FBQ25ELE9BQWIsQ0FBcUI7QUFDdkN1YixhQUFPLEVBQUUvQyxLQUFLLENBQUN2WSxHQUR3QjtBQUV2Q3NSO0FBRnVDLEtBQXJCLENBQXBCOztBQUlBaUgsU0FBSyxDQUFDUSxHQUFOLEdBQVkvWCxHQUFHLElBQUkyZixXQUFXLENBQUM5YSxJQUFaLENBQWlCN0UsR0FBakIsQ0FBbkI7O0FBQ0F1WCxTQUFLLENBQUNrQixHQUFOLEdBQVlBLEdBQUcsQ0FBQ2tILFdBQVcsQ0FBQzlhLElBQWIsRUFBbUJzYSxRQUFRLENBQUNRLFdBQVcsQ0FBQzNnQixHQUFiLENBQTNCLENBQWY7QUFDQXVZLFNBQUssQ0FBQ3JDLE1BQU4sR0FBZUEsTUFBTSxDQUFDeUssV0FBVyxDQUFDOWEsSUFBYixFQUFtQnNhLFFBQVEsQ0FBQ1EsV0FBVyxDQUFDM2dCLEdBQWIsRUFBa0IsSUFBbEIsQ0FBM0IsQ0FBckI7QUFDQXVZLFNBQUssQ0FBQ3FJLE1BQU4sR0FBZVAsV0FBVyxDQUFDTSxXQUFXLENBQUMzZ0IsR0FBYixFQUFrQkssR0FBRyxJQUFJO0FBQ2pELFVBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ1JrWSxhQUFLLENBQUNzSSxTQUFOLEdBQWtCLElBQWxCO0FBQ0Q7QUFDRixLQUp5QixDQUExQjtBQUtBdEksU0FBSyxDQUFDc0ksU0FBTixHQUFrQjViLE9BQU8sQ0FBQzBiLFdBQVcsQ0FBQ0csV0FBYixDQUF6QjtBQUNEOztBQUVELE1BQUl4SSxLQUFKLEVBQVc7QUFDVCxVQUFNNkcsV0FBVyxHQUFHbGMsWUFBWSxDQUFDbEQsT0FBYixDQUFxQjtBQUN2Q3NaLGFBQU8sRUFBRWYsS0FBSyxDQUFDdFksR0FEd0I7QUFFdkNzUjtBQUZ1QyxLQUFyQixDQUFwQjs7QUFJQWdILFNBQUssQ0FBQ1MsR0FBTixHQUFZL1gsR0FBRyxJQUFJbWUsV0FBVyxDQUFDdFosSUFBWixDQUFpQjdFLEdBQWpCLENBQW5COztBQUNBc1gsU0FBSyxDQUFDbUIsR0FBTixHQUFZQSxHQUFHLENBQUMwRixXQUFXLENBQUN0WixJQUFiLEVBQW1CMGEsUUFBUSxDQUFDcEIsV0FBVyxDQUFDbmYsR0FBYixDQUEzQixDQUFmO0FBQ0FzWSxTQUFLLENBQUNwQyxNQUFOLEdBQWVBLE1BQU0sQ0FBQ2lKLFdBQVcsQ0FBQ3RaLElBQWIsRUFBbUIwYSxRQUFRLENBQUNwQixXQUFXLENBQUNuZixHQUFiLEVBQWtCLElBQWxCLENBQTNCLENBQXJCO0FBQ0Q7QUFDRixDQW5DTTs7QUFxQ0EsTUFBTXVmLG9CQUFvQixHQUFHLENBQUMzSCxNQUFELEVBQVNXLEtBQVQsRUFBZ0JELEtBQWhCLEtBQTBCO0FBQzVEVixRQUFNLENBQUNtQixHQUFQLEdBQWF5SCxRQUFiO0FBQ0E1SSxRQUFNLENBQUM2QixHQUFQLEdBQWErRyxRQUFiO0FBQ0E1SSxRQUFNLENBQUMxQixNQUFQLEdBQWdCc0ssUUFBaEI7O0FBRUEsTUFBSWpJLEtBQUosRUFBVztBQUNUQSxTQUFLLENBQUNRLEdBQU4sR0FBWXlILFFBQVo7QUFDQWpJLFNBQUssQ0FBQ2tCLEdBQU4sR0FBWStHLFFBQVo7QUFDQWpJLFNBQUssQ0FBQ3JDLE1BQU4sR0FBZXNLLFFBQWY7QUFDQWpJLFNBQUssQ0FBQ3FJLE1BQU4sR0FBZUosUUFBZjtBQUNBakksU0FBSyxDQUFDc0ksU0FBTixHQUFrQixLQUFsQjtBQUNEOztBQUVELE1BQUl2SSxLQUFKLEVBQVc7QUFDVEEsU0FBSyxDQUFDUyxHQUFOLEdBQVl5SCxRQUFaO0FBQ0FsSSxTQUFLLENBQUNtQixHQUFOLEdBQVkrRyxRQUFaO0FBQ0FsSSxTQUFLLENBQUNwQyxNQUFOLEdBQWVzSyxRQUFmO0FBQ0Q7QUFDRixDQWxCTTs7QUFvQkEsTUFBTWxILHFCQUFxQixHQUFHLENBQUN4WixJQUFELEVBQU95WSxLQUFQLEVBQWNELEtBQWQsS0FBd0I7QUFDM0QsTUFBSXhZLElBQUosRUFBVTtBQUNSQSxRQUFJLENBQUNpWixHQUFMLEdBQVcvWCxHQUFHLElBQUlsQixJQUFJLENBQUMrRixJQUFMLENBQVU3RSxHQUFWLENBQWxCOztBQUNBbEIsUUFBSSxDQUFDMlosR0FBTCxHQUFXQSxHQUFHLENBQUMzWixJQUFJLENBQUMrRixJQUFOLEVBQVltYSxPQUFPLENBQUNsZ0IsSUFBSSxDQUFDRSxHQUFOLENBQW5CLENBQWQ7QUFDQUYsUUFBSSxDQUFDb1csTUFBTCxHQUFjQSxNQUFNLENBQUNwVyxJQUFJLENBQUMrRixJQUFOLEVBQVltYSxPQUFPLENBQUNsZ0IsSUFBSSxDQUFDRSxHQUFOLEVBQVcsSUFBWCxDQUFuQixDQUFwQjs7QUFDQUYsUUFBSSxDQUFDaWhCLEdBQUwsR0FBV3RnQixTQUFTLElBQ2xCckIsYUFBYSxDQUFDbUIsSUFBZCxDQUFtQjtBQUNqQkMsWUFBTSxFQUFFVixJQUFJLENBQUNFLEdBREk7QUFFakJTLGVBRmlCO0FBR2pCQyxZQUFNLEVBQUU7QUFIUyxLQUFuQixDQURGO0FBTUQ7O0FBRUQsTUFBSTZYLEtBQUosRUFBVztBQUNUQSxTQUFLLENBQUNRLEdBQU4sR0FBWS9YLEdBQUcsSUFBSTtBQUNqQixhQUFPdVgsS0FBSyxDQUFDMVMsSUFBTixDQUFXN0UsR0FBWCxDQUFQO0FBQ0QsS0FGRDs7QUFHQXVYLFNBQUssQ0FBQ2tCLEdBQU4sR0FBWUEsR0FBRyxDQUFDbEIsS0FBSyxDQUFDMVMsSUFBUCxFQUFhLENBQUM3RSxHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQzFDZ1gscUJBQWUsQ0FBQ3RmLElBQWhCLENBQXFCO0FBQ25CK2EsZUFBTyxFQUFFL0MsS0FBSyxDQUFDdlksR0FESTtBQUVuQmdCLFdBRm1CO0FBR25CNkgsYUFBSyxFQUFFbkIsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixLQUFmLENBSFk7QUFJbkJxTixjQUFNLEVBQUUsS0FKVztBQUtuQkMsa0JBQVUsRUFBRXZQLE1BQU0sQ0FBQzRQO0FBTEEsT0FBckI7QUFPRCxLQVJjLENBQWY7QUFTQStCLFNBQUssQ0FBQ3JDLE1BQU4sR0FBZUEsTUFBTSxDQUFDcUMsS0FBSyxDQUFDMVMsSUFBUCxFQUFhLENBQUM3RSxHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQ2hEZ1gscUJBQWUsQ0FBQ3RmLElBQWhCLENBQXFCO0FBQ25CK2EsZUFBTyxFQUFFL0MsS0FBSyxDQUFDdlksR0FESTtBQUVuQmdCLFdBRm1CO0FBR25CNkgsYUFBSyxFQUFFbkIsSUFBSSxDQUFDQyxTQUFMLENBQWVrQixLQUFmLENBSFk7QUFJbkJxTixjQUFNLEVBQUUsSUFKVztBQUtuQkMsa0JBQVUsRUFBRXZQLE1BQU0sQ0FBQzRQO0FBTEEsT0FBckI7QUFPRCxLQVJvQixDQUFyQjs7QUFTQStCLFNBQUssQ0FBQ3FJLE1BQU4sR0FBZSxNQUFNO0FBQ25CLFlBQU0sa0RBQU47QUFDRCxLQUZEO0FBR0Q7O0FBRUQsTUFBSXRJLEtBQUosRUFBVztBQUNUQSxTQUFLLENBQUNTLEdBQU4sR0FBWS9YLEdBQUcsSUFBSTtBQUNqQixhQUFPc1gsS0FBSyxDQUFDelMsSUFBTixDQUFXN0UsR0FBWCxDQUFQO0FBQ0QsS0FGRDs7QUFHQXNYLFNBQUssQ0FBQ21CLEdBQU4sR0FBWUEsR0FBRyxDQUFDbkIsS0FBSyxDQUFDelMsSUFBUCxFQUFhLENBQUM3RSxHQUFELEVBQU02SCxLQUFOLEtBQWdCO0FBQzFDK1cscUJBQWUsQ0FBQ3JmLElBQWhCLENBQXFCO0FBQ25COFksZUFBTyxFQUFFZixLQUFLLENBQUN0WSxHQURJO0FBRW5CZ0IsV0FGbUI7QUFHbkI2SCxhQUFLLEVBQUVuQixJQUFJLENBQUNDLFNBQUwsQ0FBZWtCLEtBQWYsQ0FIWTtBQUluQnFOLGNBQU0sRUFBRSxLQUpXO0FBS25CQyxrQkFBVSxFQUFFdlAsTUFBTSxDQUFDNFA7QUFMQSxPQUFyQjtBQU9ELEtBUmMsQ0FBZjtBQVNBOEIsU0FBSyxDQUFDcEMsTUFBTixHQUFlQSxNQUFNLENBQUNvQyxLQUFLLENBQUN6UyxJQUFQLEVBQWEsQ0FBQzdFLEdBQUQsRUFBTTZILEtBQU4sS0FBZ0I7QUFDaEQrVyxxQkFBZSxDQUFDcmYsSUFBaEIsQ0FBcUI7QUFDbkI4WSxlQUFPLEVBQUVmLEtBQUssQ0FBQ3RZLEdBREk7QUFFbkJnQixXQUZtQjtBQUduQjZILGFBQUssRUFBRW5CLElBQUksQ0FBQ0MsU0FBTCxDQUFla0IsS0FBZixDQUhZO0FBSW5CcU4sY0FBTSxFQUFFLElBSlc7QUFLbkJDLGtCQUFVLEVBQUV2UCxNQUFNLENBQUM0UDtBQUxBLE9BQXJCO0FBT0QsS0FSb0IsQ0FBckI7QUFTRDtBQUNGLENBL0RNOztBQWlFQSxNQUFNZ0osY0FBYyxHQUFHLENBQUNqSCxLQUFELEVBQVFELEtBQVIsS0FBa0I7QUFDOUNDLE9BQUssQ0FBQ1EsR0FBTixHQUFZeUgsUUFBWjtBQUNBakksT0FBSyxDQUFDa0IsR0FBTixHQUFZK0csUUFBWjtBQUNBakksT0FBSyxDQUFDckMsTUFBTixHQUFlc0ssUUFBZjtBQUNBakksT0FBSyxDQUFDcUksTUFBTixHQUFlSixRQUFmO0FBQ0FsSSxPQUFLLENBQUNTLEdBQU4sR0FBWXlILFFBQVo7QUFDQWxJLE9BQUssQ0FBQ21CLEdBQU4sR0FBWStHLFFBQVo7QUFDQWxJLE9BQUssQ0FBQ3BDLE1BQU4sR0FBZXNLLFFBQWY7QUFDRCxDQVJNLEM7Ozs7Ozs7Ozs7O0FDblJQLElBQUl0ZCxZQUFKO0FBQWlCeEUsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ3FFLGNBQVksQ0FBQ2xFLENBQUQsRUFBRztBQUFDa0UsZ0JBQVksR0FBQ2xFLENBQWI7QUFBZTs7QUFBaEMsQ0FBOUIsRUFBZ0UsQ0FBaEU7QUFBbUUsSUFBSTRlLFVBQUo7QUFBZWxmLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHFCQUFaLEVBQWtDO0FBQUMrZSxZQUFVLENBQUM1ZSxDQUFELEVBQUc7QUFBQzRlLGNBQVUsR0FBQzVlLENBQVg7QUFBYTs7QUFBNUIsQ0FBbEMsRUFBZ0UsQ0FBaEU7QUFBbUUsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBakMsRUFBeUQsQ0FBekQ7QUFLbExrRSxZQUFZLENBQUM2TSxLQUFiLENBQW1CekUsTUFBbkIsQ0FDRSxVQUFTM0csTUFBVCxFQUFpQmdjLFdBQWpCLEVBQThCblAsVUFBOUIsRUFBMENDLFFBQTFDLEVBQW9EakssT0FBcEQsRUFBNkQ7QUFDM0QsTUFBSSxDQUFDZ0ssVUFBVSxDQUFDOUQsUUFBWCxDQUFvQixhQUFwQixDQUFMLEVBQXlDO0FBQ3ZDO0FBQ0Q7O0FBQ0QsUUFBTTtBQUFFNE47QUFBRixNQUFjcUYsV0FBcEI7QUFFQSxRQUFNSyxTQUFTLEdBQUc5ZCxZQUFZLENBQUM0RixJQUFiLENBQWtCO0FBQUV3UztBQUFGLEdBQWxCLEVBQStCMVAsR0FBL0IsQ0FBbUNnSyxDQUFDLElBQUlBLENBQUMsQ0FBQ3RFLFFBQTFDLENBQWxCO0FBQ0EsUUFBTTJQLGNBQWMsR0FBRzlkLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYTtBQUNsQzlJLE9BQUcsRUFBRTtBQUFFZ1MsU0FBRyxFQUFFZ1A7QUFBUCxLQUQ2QjtBQUVsQy9PLFVBQU0sRUFBRTtBQUFFQyxhQUFPLEVBQUU7QUFBWDtBQUYwQixHQUFiLEVBR3BCdEcsR0FIb0IsQ0FHaEJnSyxDQUFDLElBQUlBLENBQUMsQ0FBQzVWLEdBSFMsQ0FBdkI7QUFLQSxRQUFNa2hCLFNBQVMsR0FBR2hlLFlBQVksQ0FBQzRGLElBQWIsQ0FBa0I7QUFDbEN3UyxXQURrQztBQUVsQ2hLLFlBQVEsRUFBRTtBQUFFVSxTQUFHLEVBQUVpUDtBQUFQLEtBRndCO0FBR2xDSCxlQUFXLEVBQUU7QUFBRTVPLGFBQU8sRUFBRTtBQUFYO0FBSHFCLEdBQWxCLEVBSWZuSixLQUplLEVBQWxCOztBQU1BLE1BQUltWSxTQUFTLEtBQUtELGNBQWMsQ0FBQ2xWLE1BQWpDLEVBQXlDO0FBQ3ZDNlIsY0FBVSxDQUFDdEMsT0FBRCxDQUFWO0FBQ0Q7QUFDRixDQXRCSCxFQXVCRTtBQUFFaEosZUFBYSxFQUFFO0FBQWpCLENBdkJGLEU7Ozs7Ozs7Ozs7O0FDTEE1VCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDb2hCLHVCQUFxQixFQUFDLE1BQUlBLHFCQUEzQjtBQUFpREQsbUJBQWlCLEVBQUMsTUFBSUE7QUFBdkUsQ0FBZDtBQUF5RyxJQUFJbk4sZUFBSjtBQUFvQmpVLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUM4VCxpQkFBZSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxtQkFBZSxHQUFDM1QsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQTFDLEVBQWtGLENBQWxGO0FBQXFGLElBQUlGLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJa0UsWUFBSjtBQUFpQnhFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNxRSxjQUFZLENBQUNsRSxDQUFELEVBQUc7QUFBQ2tFLGdCQUFZLEdBQUNsRSxDQUFiO0FBQWU7O0FBQWhDLENBQTlCLEVBQWdFLENBQWhFO0FBQW1FLElBQUlLLE1BQUo7QUFBV1gsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0ssVUFBTSxHQUFDTCxDQUFQO0FBQVM7O0FBQXJCLENBQTlCLEVBQXFELENBQXJEO0FBS3RYLE1BQU0rZ0IscUJBQXFCLEdBQUcsSUFBSXBOLGVBQUosQ0FBb0I7QUFDdkRqVCxNQUFJLEVBQUUsaUNBRGlEO0FBR3ZEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCc2hCLGlCQUFhLEVBQUU7QUFDYm5jLFVBQUksRUFBRUMsTUFETztBQUViRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZiLEtBRFU7QUFLekJ0RCxPQUFHLEVBQUU7QUFDSGlELFVBQUksRUFBRUM7QUFESCxLQUxvQjtBQVF6QjJFLFNBQUssRUFBRTtBQUNMNUUsVUFBSSxFQUFFQztBQURELEtBUmtCO0FBV3pCZ1MsVUFBTSxFQUFFO0FBQ05qUyxVQUFJLEVBQUVnQixPQURBO0FBRU5kLGNBQVEsRUFBRTtBQUZKLEtBWGlCO0FBZXpCZ1MsY0FBVSxFQUFFO0FBQ1ZsUyxVQUFJLEVBQUVnQixPQURJO0FBRVZkLGNBQVEsRUFBRTtBQUZBO0FBZmEsR0FBakIsRUFtQlAyTyxTQW5CTyxFQUg2Qzs7QUF3QnZEQyxLQUFHLE9BQW9EO0FBQUEsUUFBbkQ7QUFBRXFOLG1CQUFGO0FBQWlCcGYsU0FBakI7QUFBc0I2SCxXQUF0QjtBQUE2QnFOLFlBQTdCO0FBQXFDQztBQUFyQyxLQUFtRDtBQUNyRCxVQUFNd0ssV0FBVyxHQUFHemQsWUFBWSxDQUFDbkQsT0FBYixDQUFxQnFnQixhQUFyQixDQUFwQjs7QUFDQSxRQUFJLENBQUNPLFdBQUwsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdmYsS0FBSixDQUFVLHVCQUFWLENBQU47QUFDRCxLQUpvRCxDQU1yRDs7O0FBRUEsVUFBTXdILEdBQUcsR0FBR2xCLElBQUksQ0FBQzBPLEtBQUwsQ0FBV3ZOLEtBQVgsQ0FBWjtBQUNBLFFBQUl5QyxNQUFNLEdBQUc7QUFBRSxzQkFBU3RLLEdBQVQsSUFBaUI0SDtBQUFuQixLQUFiO0FBQ0EsVUFBTTZJLFFBQVEsR0FBR3lFLE1BQU0sR0FBRztBQUFFRyxXQUFLLEVBQUUvSztBQUFULEtBQUgsR0FBdUI7QUFBRVgsVUFBSSxFQUFFVztBQUFSLEtBQTlDO0FBRUFwSSxnQkFBWSxDQUFDb0ksTUFBYixDQUFvQjhVLGFBQXBCLEVBQW1DM08sUUFBbkMsRUFBNkM7QUFDM0N1QixpQkFBVyxFQUFFLEtBRDhCO0FBRTNDQyxZQUFNLEVBQUUsS0FGbUM7QUFHM0NMLGNBQVEsRUFBRSxLQUhpQztBQUkzQzBELGlCQUFXLEVBQUUsS0FKOEI7QUFLM0NDLHdCQUFrQixFQUFFO0FBTHVCLEtBQTdDOztBQVFBLFFBQUkzUCxNQUFNLENBQUM0UCxRQUFQLElBQW1CLENBQUNMLFVBQXhCLEVBQW9DO0FBQ2xDOVcsWUFBTSxDQUFDSCxZQUFQLENBQW9CO0FBQ2xCb1MsZ0JBQVEsRUFBRXFQLFdBQVcsQ0FBQ3JQLFFBREo7QUFFbEI4TyxxQkFGa0I7QUFHbEJPLG1CQUhrQjtBQUlsQjNmLFdBSmtCO0FBS2xCNkgsYUFBSyxFQUFFRCxHQUxXO0FBTWxCK04saUJBQVMsRUFBRWdLLFdBQVcsQ0FBQzlhLElBQVosSUFBb0I4YSxXQUFXLENBQUM5YSxJQUFaLENBQWlCN0UsR0FBakIsQ0FOYjtBQU9sQmtWO0FBUGtCLE9BQXBCO0FBU0Q7QUFDRjs7QUF2RHNELENBQXBCLENBQTlCO0FBMERBLE1BQU00SixpQkFBaUIsR0FBRyxJQUFJbk4sZUFBSixDQUFvQjtBQUNuRGpULE1BQUksRUFBRSw2QkFENkM7QUFHbkRrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJzaEIsaUJBQWEsRUFBRTtBQUNibmMsVUFBSSxFQUFFQyxNQURPO0FBRWJFLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBRmIsS0FEVTtBQUt6QjZSLGNBQVUsRUFBRTtBQUNWbFMsVUFBSSxFQUFFZ0IsT0FESTtBQUVWZCxjQUFRLEVBQUU7QUFGQTtBQUxhLEdBQWpCLEVBU1AyTyxTQVRPLEVBSHlDOztBQWNuREMsS0FBRyxRQUFnQztBQUFBLFFBQS9CO0FBQUVxTixtQkFBRjtBQUFpQmpLO0FBQWpCLEtBQStCO0FBQ2pDLFVBQU13SyxXQUFXLEdBQUd6ZCxZQUFZLENBQUNuRCxPQUFiLENBQXFCcWdCLGFBQXJCLENBQXBCOztBQUNBLFFBQUksQ0FBQ08sV0FBTCxFQUFrQjtBQUNoQixZQUFNLElBQUl2ZixLQUFKLENBQVUsdUJBQVYsQ0FBTjtBQUNELEtBSmdDLENBS2pDOzs7QUFFQSxRQUFJdWYsV0FBVyxDQUFDRyxXQUFoQixFQUE2QjtBQUMzQixVQUFJbGEsTUFBTSxDQUFDNEYsYUFBWCxFQUEwQjtBQUN4QnRNLGVBQU8sQ0FBQ0MsR0FBUixDQUFZLHlCQUFaO0FBQ0Q7O0FBRUQ7QUFDRDs7QUFFRCtDLGdCQUFZLENBQUNvSSxNQUFiLENBQW9COFUsYUFBcEIsRUFBbUM7QUFBRXpWLFVBQUksRUFBRTtBQUFFbVcsbUJBQVcsRUFBRSxJQUFJaGMsSUFBSjtBQUFmO0FBQVIsS0FBbkM7O0FBRUEsUUFBSThCLE1BQU0sQ0FBQzRQLFFBQVAsSUFBbUIsQ0FBQ0wsVUFBeEIsRUFBb0M7QUFDbEM5VyxZQUFNLENBQUNGLFlBQVAsQ0FBb0I7QUFDbEJtUyxnQkFBUSxFQUFFcVAsV0FBVyxDQUFDclAsUUFESjtBQUVsQnFQO0FBRmtCLE9BQXBCO0FBSUQ7QUFDRjs7QUFyQ2tELENBQXBCLENBQTFCLEM7Ozs7Ozs7Ozs7O0FDL0RQamlCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUN1RSxjQUFZLEVBQUMsTUFBSUE7QUFBbEIsQ0FBZDtBQUErQyxJQUFJcEUsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkwRSxlQUFKLEVBQW9CRSxjQUFwQixFQUFtQ0csU0FBbkM7QUFBNkNyRixNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDNkUsaUJBQWUsQ0FBQzFFLENBQUQsRUFBRztBQUFDMEUsbUJBQWUsR0FBQzFFLENBQWhCO0FBQWtCLEdBQXRDOztBQUF1QzRFLGdCQUFjLENBQUM1RSxDQUFELEVBQUc7QUFBQzRFLGtCQUFjLEdBQUM1RSxDQUFmO0FBQWlCLEdBQTFFOztBQUEyRStFLFdBQVMsQ0FBQy9FLENBQUQsRUFBRztBQUFDK0UsYUFBUyxHQUFDL0UsQ0FBVjtBQUFZOztBQUFwRyxDQUFqQyxFQUF1SSxDQUF2STtBQUlqSyxNQUFNa0UsWUFBWSxHQUFHLElBQUlpTCxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsZUFBckIsQ0FBckI7QUFFUGxMLFlBQVksQ0FBQzZELE1BQWIsR0FBc0IsSUFBSWpJLFlBQUosQ0FBaUI7QUFDckNnaUIsYUFBVyxFQUFFO0FBQ1g3YyxRQUFJLEVBQUVhLElBREs7QUFFWHNFLGNBQVUsRUFBRSxJQUZEO0FBR1hqRixZQUFRLEVBQUUsSUFIQztBQUlYakQsU0FBSyxFQUFFO0FBSkk7QUFEd0IsQ0FBakIsQ0FBdEI7QUFTQWdDLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQmxNLGVBQTNCO0FBQ0FSLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQmhNLGNBQTNCO0FBQ0FWLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQjdMLFNBQVMsQ0FBQyxTQUFELENBQXBDO0FBQ0FiLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQjdMLFNBQVMsQ0FBQyxRQUFELENBQXBDO0FBQ0FiLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQjdMLFNBQVMsQ0FBQyxRQUFELENBQXBDO0FBQ0FiLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQjdMLFNBQVMsQ0FBQyxPQUFELENBQXBDO0FBQ0FiLFlBQVksQ0FBQzZELE1BQWIsQ0FBb0I2SSxNQUFwQixDQUEyQjdMLFNBQVMsQ0FBQyxTQUFELENBQXBDO0FBQ0FiLFlBQVksQ0FBQzJNLFlBQWIsQ0FBMEIzTSxZQUFZLENBQUM2RCxNQUF2QyxFOzs7Ozs7Ozs7OztBQ3RCQXJJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUN3aUIsY0FBWSxFQUFDLE1BQUlBLFlBQWxCO0FBQStCQyxhQUFXLEVBQUMsTUFBSUEsV0FBL0M7QUFBMkQzQixrQkFBZ0IsRUFBQyxNQUFJQSxnQkFBaEY7QUFBaUc0Qix3QkFBc0IsRUFBQyxNQUFJQSxzQkFBNUg7QUFBbUpDLHlCQUF1QixFQUFDLE1BQUlBLHVCQUEvSztBQUF1TUMsc0JBQW9CLEVBQUMsTUFBSUEsb0JBQWhPO0FBQXFQN0IsaUJBQWUsRUFBQyxNQUFJQSxlQUF6UTtBQUF5UkMsc0JBQW9CLEVBQUMsTUFBSUEsb0JBQWxUO0FBQXVVNkIsb0JBQWtCLEVBQUMsTUFBSUEsa0JBQTlWO0FBQWlYQyx1QkFBcUIsRUFBQyxNQUFJQSxxQkFBM1k7QUFBaWFDLGtCQUFnQixFQUFDLE1BQUlBLGdCQUF0YjtBQUF1Y0Msb0JBQWtCLEVBQUMsTUFBSUE7QUFBOWQsQ0FBZDtBQUFpZ0IsSUFBSWhQLGVBQUo7QUFBb0JqVSxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDOFQsaUJBQWUsQ0FBQzNULENBQUQsRUFBRztBQUFDMlQsbUJBQWUsR0FBQzNULENBQWhCO0FBQWtCOztBQUF0QyxDQUExQyxFQUFrRixDQUFsRjtBQUFxRixJQUFJRixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTRELE9BQUo7QUFBWWxFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUMrRCxTQUFPLENBQUM1RCxDQUFELEVBQUc7QUFBQzRELFdBQU8sR0FBQzVELENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSThELFdBQUo7QUFBZ0JwRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDaUUsYUFBVyxDQUFDOUQsQ0FBRCxFQUFHO0FBQUM4RCxlQUFXLEdBQUM5RCxDQUFaO0FBQWM7O0FBQTlCLENBQTNDLEVBQTJFLENBQTNFO0FBQThFLElBQUl1RSxRQUFKO0FBQWE3RSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDMEUsVUFBUSxDQUFDdkUsQ0FBRCxFQUFHO0FBQUN1RSxZQUFRLEdBQUN2RSxDQUFUO0FBQVc7O0FBQXhCLENBQXBDLEVBQThELENBQTlEO0FBQWlFLElBQUkrRCxZQUFKO0FBQWlCckUsTUFBTSxDQUFDRyxJQUFQLENBQVksbUNBQVosRUFBZ0Q7QUFBQ2tFLGNBQVksQ0FBQy9ELENBQUQsRUFBRztBQUFDK0QsZ0JBQVksR0FBQy9ELENBQWI7QUFBZTs7QUFBaEMsQ0FBaEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSU8sS0FBSjtBQUFVYixNQUFNLENBQUNHLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDVSxPQUFLLENBQUNQLENBQUQsRUFBRztBQUFDTyxTQUFLLEdBQUNQLENBQU47QUFBUTs7QUFBbEIsQ0FBaEMsRUFBb0QsQ0FBcEQ7QUFBdUQsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFdBQVosRUFBd0I7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUF4QixFQUFnRCxDQUFoRDtBQUFtRCxJQUFJNGlCLFlBQUo7QUFBaUJsakIsTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDK2lCLGNBQVksQ0FBQzVpQixDQUFELEVBQUc7QUFBQzRpQixnQkFBWSxHQUFDNWlCLENBQWI7QUFBZTs7QUFBaEMsQ0FBM0IsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSTZpQixLQUFKLEVBQVV0SSxjQUFWO0FBQXlCN2EsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2dqQixPQUFLLENBQUM3aUIsQ0FBRCxFQUFHO0FBQUM2aUIsU0FBSyxHQUFDN2lCLENBQU47QUFBUSxHQUFsQjs7QUFBbUJ1YSxnQkFBYyxDQUFDdmEsQ0FBRCxFQUFHO0FBQUN1YSxrQkFBYyxHQUFDdmEsQ0FBZjtBQUFpQjs7QUFBdEQsQ0FBakMsRUFBeUYsQ0FBekY7QUFBNEYsSUFBSUssTUFBSjtBQUFXWCxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSyxVQUFNLEdBQUNMLENBQVA7QUFBUzs7QUFBckIsQ0FBOUIsRUFBcUQsRUFBckQ7QUFBeUQsSUFBSXlELGFBQUo7QUFBa0IvRCxNQUFNLENBQUNHLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDeUQsaUJBQWEsR0FBQ3pELENBQWQ7QUFBZ0I7O0FBQTVCLENBQXRDLEVBQW9FLEVBQXBFO0FBY3g2QyxNQUFNbWlCLFlBQVksR0FBRyxJQUFJeE8sZUFBSixDQUFvQjtBQUM5Q2pULE1BQUksRUFBRSx3QkFEd0M7QUFHOUNrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekI0UixNQUFFLEVBQUU7QUFDRnpNLFVBQUksRUFBRUM7QUFESixLQURxQjtBQUl6QjRkLGFBQVMsRUFBRTtBQUNUN2QsVUFBSSxFQUFFekMsTUFERztBQUVUc0UsY0FBUSxFQUFFLElBRkQ7QUFHVFosa0JBQVksRUFBRTtBQUhMO0FBSmMsR0FBakIsRUFTUDROLFNBVE8sRUFIb0M7O0FBYzlDQyxLQUFHLENBQUM2RSxNQUFELEVBQVM7QUFDVjtBQUNBLFVBQU01SCxLQUFLLEdBQUdwTixPQUFPLENBQUM3QyxPQUFSLENBQ1o7QUFBRVcsWUFBTSxFQUFFLFNBQVY7QUFBcUIwTyxVQUFJLEVBQUU7QUFBM0IsS0FEWSxFQUVaO0FBQUVtTixVQUFJLEVBQUU7QUFBRWxOLGlCQUFTLEVBQUU7QUFBYjtBQUFSLEtBRlksQ0FBZDs7QUFLQSxRQUFJLENBQUNXLEtBQUwsRUFBWTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRCxLQWhCUyxDQWtCVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLFVBQU0rUixRQUFRLEdBQUc1ZSxPQUFPLENBQUNwRCxPQUFSLENBQWdCO0FBQUUyUSxRQUFFLEVBQUVrSCxNQUFNLENBQUNsSDtBQUFiLEtBQWhCLENBQWpCLENBekJVLENBMkJWO0FBQ0E7O0FBQ0EsUUFBSXFSLFFBQVEsSUFBSUEsUUFBUSxDQUFDNVEsV0FBekIsRUFBc0M7QUFDcEMsYUFBTzRRLFFBQVEsQ0FBQy9oQixHQUFoQjtBQUNEOztBQUVELFFBQUkraEIsUUFBSixFQUFjO0FBQ1puSyxZQUFNLEdBQUdtSyxRQUFUO0FBQ0QsS0FGRCxNQUVPO0FBQ0w7QUFDQTtBQUNBbkssWUFBTSxDQUFDNVgsR0FBUCxHQUFhbUQsT0FBTyxDQUFDb0ksTUFBUixDQUFlcU0sTUFBZixFQUF1QjtBQUNsQzNFLGNBQU0sRUFBRSxLQUQwQjtBQUVsQ0wsZ0JBQVEsRUFBRTtBQUZ3QixPQUF2QixDQUFiO0FBSUQsS0ExQ1MsQ0E0Q1Y7OztBQUNBLFVBQU1rSyxPQUFPLEdBQUdoYSxXQUFXLENBQUNnRyxJQUFaLENBQWlCO0FBQy9CNkgsYUFBTyxFQUFFWCxLQUFLLENBQUNoUSxHQURnQjtBQUUvQlUsWUFBTSxFQUFFLFNBRnVCO0FBRy9CMlUsZ0JBQVUsRUFBRTtBQUFFbkQsZUFBTyxFQUFFO0FBQVgsT0FIbUI7QUFJL0IxUixZQUFNLEVBQUU7QUFBRTBSLGVBQU8sRUFBRTtBQUFYO0FBSnVCLEtBQWpCLEVBS2I3RixLQUxhLEVBQWhCOztBQU9BLFFBQUl5USxPQUFPLENBQUMvUSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDRCxLQXZEUyxDQXlEVjs7O0FBQ0EsUUFBSWlXLFNBQVMsR0FBR2xGLE9BQU8sQ0FBQzdKLE1BQVIsQ0FDZGhILENBQUMsSUFBSUEsQ0FBQyxDQUFDNEUsY0FBRixHQUFtQjVFLENBQUMsQ0FBQ3NGLGVBQUYsQ0FBa0J4RixNQUQ1QixDQUFoQixDQTFEVSxDQThEVjs7QUFDQSxRQUFJaVcsU0FBUyxDQUFDalcsTUFBVixLQUFxQixDQUF6QixFQUE0QjtBQUMxQmlXLGVBQVMsR0FBR2xGLE9BQVo7QUFDRCxLQWpFUyxDQW1FVjs7O0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUdpRixTQUFTLENBQUNwVyxHQUFWLENBQWNzTCxLQUFLLElBQUk7QUFDL0MsYUFBTztBQUNMck8sYUFBSyxFQUFFcU8sS0FERjtBQUVMOEYsY0FBTSxFQUFFOUYsS0FBSyxDQUFDckc7QUFGVCxPQUFQO0FBSUQsS0FMeUIsQ0FBMUIsQ0FwRVUsQ0EyRVY7O0FBQ0EsVUFBTXFHLEtBQUssR0FBR3FDLGNBQWMsQ0FBQ3dELGlCQUFELENBQWQsRUFBZCxDQTVFVSxDQThFVjs7QUFDQWphLGVBQVcsQ0FBQ3dJLE1BQVosQ0FBbUI0TCxLQUFLLENBQUNsWCxHQUF6QixFQUE4QjtBQUM1QmlkLGVBQVMsRUFBRTtBQUNUMUwsdUJBQWUsRUFBRXFHLE1BQU0sQ0FBQzVYO0FBRGY7QUFEaUIsS0FBOUI7QUFNQSxVQUFNbVIsV0FBVyxHQUFHK0YsS0FBSyxDQUFDbFgsR0FBMUI7QUFDQSxVQUFNMkssSUFBSSxHQUFHO0FBQUV3RztBQUFGLEtBQWIsQ0F0RlUsQ0F3RlY7O0FBQ0EsUUFBSThRLGdCQUFnQixHQUFHL0ssS0FBSyxDQUFDbFMsU0FBN0IsQ0F6RlUsQ0EyRlY7O0FBQ0EsUUFBSWlkLGdCQUFKLEVBQXNCO0FBQ3BCdFgsVUFBSSxDQUFDeUcsT0FBTCxHQUFlLElBQUl0TSxJQUFKLEVBQWY7QUFDRDs7QUFFRDNCLFdBQU8sQ0FBQ21JLE1BQVIsQ0FBZXNNLE1BQU0sQ0FBQzVYLEdBQXRCLEVBQTJCO0FBQUUySztBQUFGLEtBQTNCLEVBaEdVLENBa0dWOztBQUNBLFFBQUlzWCxnQkFBSixFQUFzQjtBQUNwQm5mLGlCQUFXLENBQUN3SSxNQUFaLENBQW1CNkYsV0FBbkIsRUFBZ0M7QUFDOUI4TCxpQkFBUyxFQUFFO0FBQUUvTCxtQkFBUyxFQUFFMEcsTUFBTSxDQUFDNVg7QUFBcEI7QUFEbUIsT0FBaEM7QUFHRDs7QUFFRCxXQUFPNFgsTUFBTSxDQUFDNVgsR0FBZDtBQUNEOztBQXhINkMsQ0FBcEIsQ0FBckI7QUEySEEsTUFBTW9oQixXQUFXLEdBQUcsSUFBSXpPLGVBQUosQ0FBb0I7QUFDN0NqVCxNQUFJLEVBQUUsdUJBRHVDO0FBRzdDa1QsVUFBUSxFQUFFclAsUUFBUSxDQUFDdVAsU0FBVCxFQUhtQzs7QUFLdkNDLEtBQU47QUFBQSxvQ0FBbUI7QUFBQSxVQUFUO0FBQUUvUztBQUFGLE9BQVM7O0FBQ2pCLFVBQUksQ0FBQzRHLE1BQU0sQ0FBQzRQLFFBQVosRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxVQUFJO0FBQ0Y7QUFDQTtBQUNBLGVBQU8sQ0FBQzBMLGFBQWEsQ0FBQ2xpQixHQUFELENBQXJCLEVBQTRCO0FBQzFCLHdCQUFNNmhCLEtBQUssQ0FBQyxJQUFELENBQVg7QUFDRDtBQUNGLE9BTkQsQ0FNRSxPQUFPdmhCLEtBQVAsRUFBYztBQUNkSixlQUFPLENBQUNJLEtBQVIsQ0FBYyx1QkFBZCxFQUF1Q0EsS0FBdkM7QUFDRDtBQUNGLEtBZEQ7QUFBQTs7QUFMNkMsQ0FBcEIsQ0FBcEI7O0FBc0JQLFNBQVM0aEIsYUFBVCxDQUF1QmxpQixHQUF2QixFQUE0QjtBQUMxQixRQUFNNFgsTUFBTSxHQUFHelUsT0FBTyxDQUFDcEQsT0FBUixDQUFnQkMsR0FBaEIsQ0FBZjs7QUFFQSxNQUFJLENBQUM0WCxNQUFMLEVBQWE7QUFDWCwwQ0FBK0I1WCxHQUEvQjtBQUNEOztBQUNELFFBQU07QUFBRW9SLFdBQUY7QUFBV0Q7QUFBWCxNQUEyQnlHLE1BQWpDOztBQUVBLE1BQUl4RyxPQUFKLEVBQWE7QUFDWDtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUVELFFBQU04RixLQUFLLEdBQUdwVSxXQUFXLENBQUMvQyxPQUFaLENBQW9Cb1IsV0FBcEIsQ0FBZDs7QUFFQSxNQUFJLENBQUMrRixLQUFMLEVBQVk7QUFDVixvREFBeUNsWCxHQUF6QztBQUNELEdBakJ5QixDQW1CMUI7OztBQUNBLE1BQUl5QyxhQUFhLENBQUMwTyxXQUFELENBQWpCLEVBQWdDO0FBQzlCLFdBQU8sS0FBUDtBQUNELEdBdEJ5QixDQXdCMUI7OztBQUNBLE1BQUkrRixLQUFLLENBQUNoRyxTQUFOLENBQWdCbkYsTUFBaEIsS0FBMkJtTCxLQUFLLENBQUNyRyxjQUFyQyxFQUFxRDtBQUNuRDtBQUNBLFFBQUlxRyxLQUFLLENBQUNoRyxTQUFOLENBQWdCeEQsUUFBaEIsQ0FBeUIxTixHQUF6QixDQUFKLEVBQW1DO0FBQ2pDLGFBQU8sSUFBUDtBQUNELEtBSmtELENBTW5EO0FBQ0E7OztBQUNBbUQsV0FBTyxDQUFDbUksTUFBUixDQUNFO0FBQ0V0TCxTQURGO0FBRUVpUyxZQUFNLEVBQUU7QUFBRUMsZUFBTyxFQUFFO0FBQVg7QUFGVixLQURGLEVBS0U7QUFDRXZILFVBQUksRUFBRTtBQUNKc0gsY0FBTSxFQUFFLElBQUluTixJQUFKLEVBREo7QUFFSnFOLGtCQUFVLEVBQUU7QUFGUjtBQURSLEtBTEY7QUFhQSxXQUFPLElBQVA7QUFDRCxHQS9DeUIsQ0FpRDFCOzs7QUFDQXJQLGFBQVcsQ0FBQ3dJLE1BQVosQ0FDRTtBQUFFdEwsT0FBRyxFQUFFbVIsV0FBUDtBQUFvQkQsYUFBUyxFQUFFZ0csS0FBSyxDQUFDaEc7QUFBckMsR0FERixFQUVFO0FBQ0UrTCxhQUFTLEVBQUU7QUFBRS9MLGVBQVMsRUFBRWxSO0FBQWI7QUFEYixHQUZGLEVBbEQwQixDQXlEMUI7QUFDQTtBQUNBOztBQUNBLFFBQU1taUIsWUFBWSxHQUFHcmYsV0FBVyxDQUFDL0MsT0FBWixDQUFvQm9SLFdBQXBCLENBQXJCOztBQUNBLE1BQUlnUixZQUFZLENBQUNqUixTQUFiLENBQXVCeEQsUUFBdkIsQ0FBZ0MxTixHQUFoQyxDQUFKLEVBQTBDO0FBQ3hDO0FBQ0EySyxRQUFJLEdBQUc7QUFBRXlHLGFBQU8sRUFBRSxJQUFJdE0sSUFBSjtBQUFYLEtBQVAsQ0FGd0MsQ0FJeEM7O0FBQ0EsVUFBTWdSLFdBQVcsR0FBRy9TLFlBQVksQ0FBQ2hELE9BQWIsQ0FBcUJvaUIsWUFBWSxDQUFDNVIsYUFBbEMsQ0FBcEI7O0FBQ0EsUUFBSXVGLFdBQVcsQ0FBQ0MsV0FBWixLQUE0QixZQUFoQyxFQUE4QztBQUM1Q3BMLFVBQUksQ0FBQ3lLLGdCQUFMLEdBQXdCLElBQUl0USxJQUFKLEVBQXhCO0FBQ0E2RixVQUFJLENBQUNrTixnQkFBTCxHQUF3QixDQUF4QjtBQUNEOztBQUVEMVUsV0FBTyxDQUFDbUksTUFBUixDQUFldEwsR0FBZixFQUFvQjtBQUFFMks7QUFBRixLQUFwQjtBQUNBLFdBQU8sSUFBUDtBQUNELEdBMUV5QixDQTRFMUI7QUFDQTtBQUNBOzs7QUFDQSxTQUFPLEtBQVA7QUFDRDs7QUFFTSxNQUFNOFUsZ0JBQWdCLEdBQUcsSUFBSTlNLGVBQUosQ0FBb0I7QUFDbERqVCxNQUFJLEVBQUUsNEJBRDRDO0FBR2xEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCd1MsWUFBUSxFQUFFO0FBQ1JyTixVQUFJLEVBQUVDLE1BREU7QUFFUkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGbEIsS0FEZTtBQUt6QnRELE9BQUcsRUFBRTtBQUNIaUQsVUFBSSxFQUFFQztBQURILEtBTG9CO0FBUXpCMkUsU0FBSyxFQUFFO0FBQ0w1RSxVQUFJLEVBQUVDO0FBREQsS0FSa0I7QUFXekJnUyxVQUFNLEVBQUU7QUFDTmpTLFVBQUksRUFBRWdCLE9BREE7QUFFTmQsY0FBUSxFQUFFO0FBRkosS0FYaUI7QUFlekJnUyxjQUFVLEVBQUU7QUFDVmxTLFVBQUksRUFBRWdCLE9BREk7QUFFVmQsY0FBUSxFQUFFO0FBRkE7QUFmYSxHQUFqQixFQW1CUDJPLFNBbkJPLEVBSHdDOztBQXdCbERDLEtBQUcsUUFBK0M7QUFBQSxRQUE5QztBQUFFekIsY0FBRjtBQUFZdFEsU0FBWjtBQUFpQjZILFdBQWpCO0FBQXdCcU4sWUFBeEI7QUFBZ0NDO0FBQWhDLEtBQThDO0FBQ2hELFVBQU15QixNQUFNLEdBQUd6VSxPQUFPLENBQUNwRCxPQUFSLENBQWdCdVIsUUFBaEIsQ0FBZjs7QUFDQSxRQUFJLENBQUNzRyxNQUFMLEVBQWE7QUFDWCxZQUFNLElBQUl4VyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQUNELEtBSitDLENBS2hEOzs7QUFFQSxVQUFNd0gsR0FBRyxHQUFHbEIsSUFBSSxDQUFDME8sS0FBTCxDQUFXdk4sS0FBWCxDQUFaO0FBQ0EsUUFBSXlDLE1BQU0sR0FBRztBQUFFLHNCQUFTdEssR0FBVCxJQUFpQjRIO0FBQW5CLEtBQWI7QUFDQSxVQUFNNkksUUFBUSxHQUFHeUUsTUFBTSxHQUFHO0FBQUVHLFdBQUssRUFBRS9LO0FBQVQsS0FBSCxHQUF1QjtBQUFFWCxVQUFJLEVBQUVXO0FBQVIsS0FBOUM7QUFFQW5JLFdBQU8sQ0FBQ21JLE1BQVIsQ0FBZWdHLFFBQWYsRUFBeUJHLFFBQXpCLEVBQW1DO0FBQ2pDdUIsaUJBQVcsRUFBRSxLQURvQjtBQUVqQ0MsWUFBTSxFQUFFLEtBRnlCO0FBR2pDTCxjQUFRLEVBQUUsS0FIdUI7QUFJakMwRCxpQkFBVyxFQUFFLEtBSm9CO0FBS2pDQyx3QkFBa0IsRUFBRTtBQUxhLEtBQW5DOztBQVFBLFFBQUkzUCxNQUFNLENBQUM0UCxRQUFQLElBQW1CLENBQUNMLFVBQXhCLEVBQW9DO0FBQ2xDOVcsWUFBTSxDQUFDSCxZQUFQLENBQW9CO0FBQ2xCb1MsZ0JBRGtCO0FBRWxCc0csY0FGa0I7QUFHbEI1VyxXQUhrQjtBQUlsQjZILGFBQUssRUFBRUQsR0FKVztBQUtsQitOLGlCQUFTLEVBQUVpQixNQUFNLENBQUMvUixJQUFQLElBQWUrUixNQUFNLENBQUMvUixJQUFQLENBQVk3RSxHQUFaLENBTFI7QUFNbEJrVjtBQU5rQixPQUFwQjtBQVFEO0FBQ0Y7O0FBckRpRCxDQUFwQixDQUF6QjtBQXdEQSxNQUFNbUwsc0JBQXNCLEdBQUcsSUFBSTFPLGVBQUosQ0FBb0I7QUFDeERqVCxNQUFJLEVBQUUsa0NBRGtEO0FBR3hEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCd1MsWUFBUSxFQUFFO0FBQ1JyTixVQUFJLEVBQUVDLE1BREU7QUFFUkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGbEIsS0FEZTtBQUt6QjhkLFlBQVEsRUFBRTtBQUNSbmUsVUFBSSxFQUFFQztBQURFO0FBTGUsR0FBakIsRUFRUDRPLFNBUk8sRUFIOEM7O0FBYXhEQyxLQUFHLFFBQXlCO0FBQUEsUUFBeEI7QUFBRXpCLGNBQUY7QUFBWThRO0FBQVosS0FBd0I7QUFDMUIsVUFBTXhLLE1BQU0sR0FBR3pVLE9BQU8sQ0FBQ3BELE9BQVIsQ0FBZ0J1UixRQUFoQixDQUFmOztBQUNBLFFBQUksQ0FBQ3NHLE1BQUwsRUFBYTtBQUNYLFlBQU0sSUFBSXhXLEtBQUosQ0FBVSxrQkFBVixDQUFOO0FBQ0QsS0FKeUIsQ0FLMUI7OztBQUVBK0IsV0FBTyxDQUFDbUksTUFBUixDQUFlZ0csUUFBZixFQUF5QjtBQUFFMkwsZUFBUyxFQUFFO0FBQUVvRixxQkFBYSxFQUFFRDtBQUFqQjtBQUFiLEtBQXpCO0FBQ0Q7O0FBckJ1RCxDQUFwQixDQUEvQjtBQXdCQSxNQUFNZCx1QkFBdUIsR0FBRyxJQUFJM08sZUFBSixDQUFvQjtBQUN6RGpULE1BQUksRUFBRSxtQ0FEbUQ7QUFHekRrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJ3UyxZQUFRLEVBQUU7QUFDUnJOLFVBQUksRUFBRUMsTUFERTtBQUVSRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZsQjtBQURlLEdBQWpCLEVBS1B3TyxTQUxPLEVBSCtDOztBQVV6REMsS0FBRyxRQUFlO0FBQUEsUUFBZDtBQUFFekI7QUFBRixLQUFjO0FBQ2hCLFVBQU1zRyxNQUFNLEdBQUd6VSxPQUFPLENBQUNwRCxPQUFSLENBQWdCdVIsUUFBaEIsQ0FBZjs7QUFDQSxRQUFJLENBQUNzRyxNQUFMLEVBQWE7QUFDWCxZQUFNLElBQUl4VyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQUNEOztBQUVEK0IsV0FBTyxDQUFDbUksTUFBUixDQUFlZ0csUUFBZixFQUF5QjtBQUN2QmdSLFVBQUksRUFBRTtBQUFFekssd0JBQWdCLEVBQUU7QUFBcEIsT0FEaUI7QUFFdkJsTixVQUFJLEVBQUU7QUFBRXlLLHdCQUFnQixFQUFFLElBQUl0USxJQUFKO0FBQXBCO0FBRmlCLEtBQXpCO0FBSUQ7O0FBcEJ3RCxDQUFwQixDQUFoQztBQXVCQSxNQUFNeWMsb0JBQW9CLEdBQUcsSUFBSTVPLGVBQUosQ0FBb0I7QUFDdERqVCxNQUFJLEVBQUUsZ0NBRGdEO0FBR3REa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCd1MsWUFBUSxFQUFFO0FBQ1JyTixVQUFJLEVBQUVDLE1BREU7QUFFUkUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGbEI7QUFEZSxHQUFqQixFQUtQd08sU0FMTyxFQUg0Qzs7QUFVdERDLEtBQUcsUUFBZTtBQUFBLFFBQWQ7QUFBRXpCO0FBQUYsS0FBYztBQUNoQixVQUFNc0csTUFBTSxHQUFHelUsT0FBTyxDQUFDcEQsT0FBUixDQUFnQnVSLFFBQWhCLENBQWY7O0FBQ0EsUUFBSSxDQUFDc0csTUFBTCxFQUFhO0FBQ1gsWUFBTSxJQUFJeFcsS0FBSixDQUFVLGtCQUFWLENBQU47QUFDRDs7QUFFRCtCLFdBQU8sQ0FBQ21JLE1BQVIsQ0FBZWdHLFFBQWYsRUFBeUI7QUFDdkIzRyxVQUFJLEVBQUU7QUFDSndILGtCQUFVLEVBQUUsc0JBRFI7QUFFSkYsY0FBTSxFQUFFLElBQUluTixJQUFKO0FBRko7QUFEaUIsS0FBekI7QUFNQWhDLGVBQVcsQ0FBQ3dJLE1BQVosQ0FBbUJzTSxNQUFNLENBQUN6RyxXQUExQixFQUF1QztBQUNyQzRHLFdBQUssRUFBRTtBQUNMN0csaUJBQVMsRUFBRUksUUFETixDQUVMO0FBQ0E7QUFDQTs7QUFKSztBQUQ4QixLQUF2QztBQVFEOztBQTlCcUQsQ0FBcEIsQ0FBN0I7QUFpQ0EsTUFBTW9PLGVBQWUsR0FBRyxJQUFJL00sZUFBSixDQUFvQjtBQUNqRGpULE1BQUksRUFBRSx1Q0FEMkM7QUFHakRrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekI4WCxjQUFVLEVBQUU7QUFDVjdSLFdBQUssRUFBRSxpQkFERztBQUVWZCxVQUFJLEVBQUVDLE1BRkk7QUFHVkUsV0FBSyxFQUFFO0FBSEcsS0FEYTtBQU16QmtOLFlBQVEsRUFBRTtBQUNSck4sVUFBSSxFQUFFQyxNQURFO0FBRVJFLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBRmxCLEtBTmU7QUFVekI5RCxVQUFNLEVBQUU7QUFDTnlELFVBQUksRUFBRUMsTUFEQTtBQUVORSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZwQjtBQVZpQixHQUFqQixFQWNQd08sU0FkTyxFQUh1Qzs7QUFtQmpEQyxLQUFHLFFBQW1DO0FBQUEsUUFBbEM7QUFBRTZELGdCQUFGO0FBQWN0RixjQUFkO0FBQXdCOVE7QUFBeEIsS0FBa0M7O0FBQ3BDLFFBQUksQ0FBQ29HLE1BQU0sQ0FBQzRQLFFBQVosRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxVQUFNMVcsSUFBSSxHQUFHUCxLQUFLLENBQUNRLE9BQU4sQ0FBY1MsTUFBZCxDQUFiOztBQUVBLFFBQUksQ0FBQ1YsSUFBTCxFQUFXO0FBQ1QsWUFBTSxJQUFJc0IsS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJdEIsSUFBSSxJQUFJQSxJQUFJLENBQUNHLFVBQWpCLEVBQTZCO0FBQzNCLFVBQUkyRyxNQUFNLENBQUM0RixhQUFYLEVBQTBCO0FBQ3hCdE0sZUFBTyxDQUFDQyxHQUFSLENBQVkseUJBQVo7QUFDRDs7QUFFRDtBQUNEOztBQUVELFVBQU1vaUIsYUFBYSxHQUFHcGYsT0FBTyxDQUFDcEQsT0FBUixDQUFnQnVSLFFBQWhCLENBQXRCOztBQUVBLFFBQUlpUixhQUFhLElBQUlBLGFBQWEsQ0FBQ3RRLE1BQW5DLEVBQTJDO0FBQ3pDLFVBQUlyTCxNQUFNLENBQUM0RixhQUFYLEVBQTBCO0FBQ3hCdE0sZUFBTyxDQUFDQyxHQUFSLENBQVksMEJBQVo7QUFDRDs7QUFFRDtBQUNEOztBQUVEZ0QsV0FBTyxDQUFDbUksTUFBUixDQUFlZ0csUUFBZixFQUF5QjtBQUN2QjNHLFVBQUksRUFBRTtBQUNKc0gsY0FBTSxFQUFFLElBQUluTixJQUFKLEVBREo7QUFFSnFOLGtCQUFVLEVBQUUsUUFGUjtBQUdKeUU7QUFISTtBQURpQixLQUF6QjtBQVFBLFVBQU12RSxPQUFPLEdBQUdsUCxPQUFPLENBQUMyRixJQUFSLENBQWE7QUFBRXRJO0FBQUYsS0FBYixFQUF5QjZMLEtBQXpCLEVBQWhCO0FBQ0EsVUFBTW1XLGFBQWEsR0FBR25RLE9BQU8sQ0FBQ1ksTUFBUixDQUFlMkUsTUFBTSxJQUFJLENBQUNBLE1BQU0sQ0FBQzNGLE1BQWpDLENBQXRCOztBQUVBLFFBQUksQ0FBQ3VRLGFBQUQsSUFBbUJBLGFBQWEsSUFBSUEsYUFBYSxDQUFDelcsTUFBZCxLQUF5QixDQUFqRSxFQUFxRTtBQUNuRXhNLFdBQUssQ0FBQytMLE1BQU4sQ0FBYTlLLE1BQWIsRUFBcUI7QUFDbkJtSyxZQUFJLEVBQUU7QUFDSjFLLG9CQUFVLEVBQUUsSUFBSTZFLElBQUosRUFEUjtBQUVKcEUsZ0JBQU0sRUFBRSxRQUZKO0FBR0pELG1CQUFTLEVBQUU7QUFIUDtBQURhLE9BQXJCO0FBUUFxQyxpQkFBVyxDQUFDd0ksTUFBWixDQUNFO0FBQUU5SztBQUFGLE9BREYsRUFFRTtBQUNFbUssWUFBSSxFQUFFO0FBQ0pqSyxnQkFBTSxFQUFFLFFBREo7QUFFSkQsbUJBQVMsRUFBRTtBQUZQO0FBRFIsT0FGRjtBQVNEO0FBQ0Y7O0FBOUVnRCxDQUFwQixDQUF4QjtBQWlGQSxNQUFNa2Ysb0JBQW9CLEdBQUcsSUFBSWhOLGVBQUosQ0FBb0I7QUFDdERqVCxNQUFJLEVBQUUsNENBRGdEO0FBR3REa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCOFgsY0FBVSxFQUFFO0FBQ1Y3UixXQUFLLEVBQUUsaUJBREc7QUFFVmQsVUFBSSxFQUFFQyxNQUZJO0FBR1ZFLFdBQUssRUFBRTtBQUhHLEtBRGE7QUFNekJrTixZQUFRLEVBQUU7QUFDUnJOLFVBQUksRUFBRUMsTUFERTtBQUVSRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZsQixLQU5lO0FBVXpCNk0sZUFBVyxFQUFFO0FBQ1hsTixVQUFJLEVBQUVDLE1BREs7QUFFWEUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGZjtBQVZZLEdBQWpCLEVBY1B3TyxTQWRPLEVBSDRDOztBQW1CdERDLEtBQUcsUUFBd0M7QUFBQSxRQUF2QztBQUFFNkQsZ0JBQUY7QUFBY3RGLGNBQWQ7QUFBd0JIO0FBQXhCLEtBQXVDOztBQUN6QyxRQUFJLENBQUN2SyxNQUFNLENBQUM0UCxRQUFaLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQsVUFBTWYsU0FBUyxHQUFHM1MsV0FBVyxDQUFDL0MsT0FBWixDQUFvQm9SLFdBQXBCLENBQWxCOztBQUVBLFFBQUksQ0FBQ3NFLFNBQUwsRUFBZ0I7QUFDZCxZQUFNLElBQUlyVSxLQUFKLENBQVUscUJBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU1taEIsYUFBYSxHQUFHcGYsT0FBTyxDQUFDcEQsT0FBUixDQUFnQnVSLFFBQWhCLENBQXRCOztBQUVBLFFBQUlpUixhQUFhLElBQUlBLGFBQWEsQ0FBQ3RRLE1BQW5DLEVBQTJDO0FBQ3pDLFVBQUlyTCxNQUFNLENBQUM0RixhQUFYLEVBQTBCO0FBQ3hCdE0sZUFBTyxDQUFDQyxHQUFSLENBQVksMEJBQVo7QUFDRDs7QUFFRDtBQUNEOztBQUVEZ0QsV0FBTyxDQUFDbUksTUFBUixDQUFlZ0csUUFBZixFQUF5QjtBQUN2QjNHLFVBQUksRUFBRTtBQUNKc0gsY0FBTSxFQUFFLElBQUluTixJQUFKLEVBREo7QUFFSnFOLGtCQUFVLEVBQUUsUUFGUjtBQUdKeUU7QUFISTtBQURpQixLQUF6QjtBQU9EOztBQS9DcUQsQ0FBcEIsQ0FBN0I7QUFrREEsTUFBTTRLLGtCQUFrQixHQUFHLElBQUk3TyxlQUFKLENBQW9CO0FBQ3BEalQsTUFBSSxFQUFFLG9DQUQ4QztBQUdwRGtULFVBQVEsRUFBRSxJQUFJOVQsWUFBSixDQUFpQjtBQUN6QndTLFlBQVEsRUFBRTtBQUNSck4sVUFBSSxFQUFFQyxNQURFO0FBRVJFLFdBQUssRUFBRXRGLFlBQVksQ0FBQ3VGLEtBQWIsQ0FBbUJDO0FBRmxCO0FBRGUsR0FBakIsRUFLUHdPLFNBTE8sRUFIMEM7O0FBVXBEQyxLQUFHLFFBQWU7QUFBQSxRQUFkO0FBQUV6QjtBQUFGLEtBQWM7O0FBQ2hCLFFBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ2IsWUFBTSxJQUFJbFEsS0FBSixDQUFVLGdCQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJLENBQUMsS0FBS3VELE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdkQsS0FBSixDQUFVLGNBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU13VyxNQUFNLEdBQUd6VSxPQUFPLENBQUNwRCxPQUFSLENBQWdCO0FBQzdCQyxTQUFHLEVBQUVzUixRQUR3QjtBQUU3Qm1SLGVBQVMsRUFBRTtBQUFFdlEsZUFBTyxFQUFFO0FBQVg7QUFGa0IsS0FBaEIsQ0FBZjs7QUFLQSxRQUFJLENBQUMwRixNQUFMLEVBQWE7QUFDWCxZQUFNLElBQUl4VyxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU1zaEIsU0FBUyxHQUFHLElBQUk1ZCxJQUFKLEdBQVc2ZCxXQUFYLEVBQWxCO0FBRUF4ZixXQUFPLENBQUNtSSxNQUFSLENBQWVnRyxRQUFmLEVBQXlCO0FBQ3ZCM0csVUFBSSxFQUFFO0FBQ0orRixVQUFFLFlBQUtrSCxNQUFNLENBQUNsSCxFQUFaLGlDQUFxQ2dTLFNBQXJDLE1BREU7QUFFSkQsaUJBQVMsRUFBRSxJQUFJM2QsSUFBSixFQUZQO0FBR0o4ZCxxQkFBYSxFQUFFO0FBSFg7QUFEaUIsS0FBekI7QUFRQSxXQUFPaEwsTUFBUDtBQUNEOztBQXZDbUQsQ0FBcEIsQ0FBM0I7QUEwQ0EsTUFBTTZKLHFCQUFxQixHQUFHLElBQUk5TyxlQUFKLENBQW9CO0FBQ3ZEalQsTUFBSSxFQUFFLHNDQURpRDtBQUd2RGtULFVBQVEsRUFBRSxJQUFJOVQsWUFBSixDQUFpQjtBQUN6QjhqQixpQkFBYSxFQUFFO0FBQ2I3ZCxXQUFLLEVBQUUsZ0JBRE07QUFFYmQsVUFBSSxFQUFFQyxNQUZPO0FBR2JDLGNBQVEsRUFBRSxJQUhHO0FBSWI4QixtQkFBYSxFQUFFMmI7QUFKRjtBQURVLEdBQWpCLEVBT1A5TyxTQVBPLEVBSDZDOztBQVl2REMsS0FBRyxRQUFvQjtBQUFBLFFBQW5CO0FBQUU2UDtBQUFGLEtBQW1COztBQUNyQixRQUFJLENBQUMsS0FBS2plLE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdkQsS0FBSixDQUFVLGNBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU1pUixPQUFPLEdBQUdsUCxPQUFPLENBQUMyRixJQUFSLENBQWE7QUFDM0JxSixnQkFBVSxFQUFFeVEsYUFEZTtBQUUzQkgsZUFBUyxFQUFFO0FBQUV2USxlQUFPLEVBQUU7QUFBWDtBQUZnQixLQUFiLEVBR2I3RixLQUhhLEVBQWhCO0FBS0EsVUFBTXFXLFNBQVMsR0FBRyxJQUFJNWQsSUFBSixHQUFXNmQsV0FBWCxFQUFsQjs7QUFFQSxTQUFLLElBQUk5RixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHeEssT0FBTyxDQUFDdEcsTUFBNUIsRUFBb0M4USxDQUFDLEVBQXJDLEVBQXlDO0FBQ3ZDLFlBQU1qRixNQUFNLEdBQUd2RixPQUFPLENBQUN3SyxDQUFELENBQXRCO0FBRUExWixhQUFPLENBQUNtSSxNQUFSLENBQWVzTSxNQUFNLENBQUM1WCxHQUF0QixFQUEyQjtBQUN6QjJLLFlBQUksRUFBRTtBQUNKK0YsWUFBRSxZQUFLa0gsTUFBTSxDQUFDbEgsRUFBWix1QkFBMkJrUyxhQUEzQixpQkFBK0NGLFNBQS9DLE1BREU7QUFFSkQsbUJBQVMsRUFBRSxJQUFJM2QsSUFBSixFQUZQO0FBR0o4ZDtBQUhJO0FBRG1CLE9BQTNCO0FBT0Q7O0FBRUQsV0FBT3ZRLE9BQU8sQ0FBQ3RHLE1BQWY7QUFDRDs7QUFyQ3NELENBQXBCLENBQTlCO0FBd0NBLE1BQU0yVixnQkFBZ0IsR0FBRyxJQUFJL08sZUFBSixDQUFvQjtBQUNsRGpULE1BQUksRUFBRSxrQ0FENEM7QUFHbERrVCxVQUFRLEVBQUVyUCxRQUFRLENBQUN1UCxTQUFULEVBSHdDOztBQUtsREMsS0FBRyxTQUFVO0FBQUEsUUFBVDtBQUFFL1M7QUFBRixLQUFTO0FBQ1gsV0FBT2lGLE9BQU8sQ0FDWjlCLE9BQU8sQ0FBQ3BELE9BQVIsQ0FBZ0I7QUFDZEMsU0FEYztBQUVkbVMsZ0JBQVUsRUFBRTtBQUFFRCxlQUFPLEVBQUU7QUFBWCxPQUZFO0FBR2R1USxlQUFTLEVBQUU7QUFBRXZRLGVBQU8sRUFBRTtBQUFYO0FBSEcsS0FBaEIsQ0FEWSxDQUFkO0FBT0Q7O0FBYmlELENBQXBCLENBQXpCO0FBZ0JBLE1BQU15UCxrQkFBa0IsR0FBRyxJQUFJaFAsZUFBSixDQUFvQjtBQUNwRGpULE1BQUksRUFBRSw4QkFEOEM7QUFHcERrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJ3UyxZQUFRLEVBQUU7QUFDUnJOLFVBQUksRUFBRUMsTUFERTtBQUVSRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZsQixLQURlO0FBTXpCdWUsUUFBSSxFQUFFO0FBQ0o1ZSxVQUFJLEVBQUVnQjtBQURGLEtBTm1CO0FBVXpCNmQsa0JBQWMsRUFBRTtBQUNkN2UsVUFBSSxFQUFFYTtBQURRO0FBVlMsR0FBakIsRUFhUGdPLFNBYk8sRUFIMEM7O0FBa0JwREMsS0FBRyxTQUFxQztBQUFBLFFBQXBDO0FBQUV6QixjQUFGO0FBQVl1UixVQUFaO0FBQWtCQztBQUFsQixLQUFvQzs7QUFDdEMsUUFBSWxjLE1BQU0sQ0FBQzRQLFFBQVgsRUFBcUI7QUFDbkIsWUFBTXVNLFlBQVksR0FBRzFqQixNQUFNLENBQUNKLGVBQVAsQ0FBdUIsS0FBS3lYLFVBQTVCLENBQXJCOztBQUNBLFVBQUksQ0FBQ3FNLFlBQUwsRUFBbUI7QUFDakI7QUFDRDs7QUFDRCxVQUFJelIsUUFBUSxLQUFLeVIsWUFBakIsRUFBK0I7QUFDN0I3aUIsZUFBTyxDQUFDSSxLQUFSLENBQ0UsMERBREY7QUFHQTtBQUNEO0FBQ0Y7O0FBRUQ2QyxXQUFPLENBQUNtSSxNQUFSLENBQWVnRyxRQUFmLEVBQXlCO0FBQ3ZCM0csVUFBSSxFQUFFO0FBQ0prWSxZQURJO0FBRUpDO0FBRkk7QUFEaUIsS0FBekI7QUFNRDs7QUF0Q21ELENBQXBCLENBQTNCLEM7Ozs7Ozs7Ozs7O0FDOWxCUHBrQixNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDd0UsU0FBTyxFQUFDLE1BQUlBLE9BQWI7QUFBcUJ5ZSxjQUFZLEVBQUMsTUFBSUE7QUFBdEMsQ0FBZDtBQUFtRSxJQUFJOWlCLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJaVAsT0FBSjtBQUFZdlAsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ29QLFNBQU8sQ0FBQ2pQLENBQUQsRUFBRztBQUFDaVAsV0FBTyxHQUFDalAsQ0FBUjtBQUFVOztBQUF0QixDQUFqQyxFQUF5RCxDQUF6RDtBQUE0RCxJQUFJK0UsU0FBSixFQUFjTCxlQUFkLEVBQThCRSxjQUE5QjtBQUE2Q2xGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNrRixXQUFTLENBQUMvRSxDQUFELEVBQUc7QUFBQytFLGFBQVMsR0FBQy9FLENBQVY7QUFBWSxHQUExQjs7QUFBMkIwRSxpQkFBZSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxtQkFBZSxHQUFDMUUsQ0FBaEI7QUFBa0IsR0FBaEU7O0FBQWlFNEUsZ0JBQWMsQ0FBQzVFLENBQUQsRUFBRztBQUFDNEUsa0JBQWMsR0FBQzVFLENBQWY7QUFBaUI7O0FBQXBHLENBQWpDLEVBQXVJLENBQXZJOztBQUlwUSxNQUFNZ2tCLGlCQUFOLFNBQWdDN1UsS0FBSyxDQUFDQyxVQUF0QyxDQUFpRDtBQUMvQzdDLFFBQU0sQ0FBQzhDLEdBQUQsRUFBTUMsUUFBTixFQUFnQjtBQUNwQkQsT0FBRyxDQUFDbk4sS0FBSixHQUFZK00sT0FBTyxDQUFDTSxHQUFSLENBQVksU0FBWixDQUFaO0FBQ0EsV0FBTyxNQUFNaEQsTUFBTixDQUFhOEMsR0FBYixFQUFrQkMsUUFBbEIsQ0FBUDtBQUNEOztBQUo4Qzs7QUFPMUMsTUFBTW5MLE9BQU8sR0FBRyxJQUFJNmYsaUJBQUosQ0FBc0IsU0FBdEIsQ0FBaEI7QUFFQSxNQUFNcEIsWUFBWSxHQUFHLENBQzFCLFVBRDBCLEVBRTFCLGVBRjBCLEVBRzFCLG1CQUgwQixFQUkxQixzQkFKMEIsRUFLMUIscUJBTDBCLEVBTTFCLFVBTjBCLEVBTzFCLFdBUDBCLEVBUTFCLFFBUjBCLEVBUzFCLFFBVDBCLENBQXJCO0FBWVB6ZSxPQUFPLENBQUM0RCxNQUFSLEdBQWlCLElBQUlqSSxZQUFKLENBQWlCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E0UixJQUFFLEVBQUU7QUFDRnpNLFFBQUksRUFBRUMsTUFESjtBQUVGc0wsT0FBRyxFQUFFO0FBRkgsR0FMNEI7QUFVaEM7QUFDQXFULE1BQUksRUFBRTtBQUNKOWQsU0FBSyxFQUFFLE1BREg7QUFFSmQsUUFBSSxFQUFFZ0IsT0FGRjtBQUdKZCxZQUFRLEVBQUU7QUFITixHQVgwQjtBQWlCaEM7QUFDQThlLFFBQU0sRUFBRTtBQUNObGUsU0FBSyxFQUFFLFFBREQ7QUFFTmQsUUFBSSxFQUFFZ0IsT0FGQTtBQUdOZCxZQUFRLEVBQUU7QUFISixHQWxCd0I7QUF3QmhDO0FBQ0EyZSxnQkFBYyxFQUFFO0FBQ2QvZCxTQUFLLEVBQUUsa0JBRE87QUFFZGQsUUFBSSxFQUFFYSxJQUZRO0FBR2RYLFlBQVEsRUFBRTtBQUhJLEdBekJnQjtBQStCaEMrZSxXQUFTLEVBQUU7QUFBRWpmLFFBQUksRUFBRXpDLE1BQVI7QUFBZ0IyQyxZQUFRLEVBQUU7QUFBMUIsR0EvQnFCO0FBZ0NoQyxrQkFBZ0I7QUFBRUYsUUFBSSxFQUFFYSxJQUFSO0FBQWNYLFlBQVEsRUFBRTtBQUF4QixHQWhDZ0I7QUFpQ2hDLGtCQUFnQjtBQUFFRixRQUFJLEVBQUVDLE1BQVI7QUFBZ0JDLFlBQVEsRUFBRTtBQUExQixHQWpDZ0I7QUFrQ2hDLHlCQUF1QjtBQUFFRixRQUFJLEVBQUVDLE1BQVI7QUFBZ0JDLFlBQVEsRUFBRTtBQUExQixHQWxDUztBQW9DaEM7QUFDQWpELE9BQUssRUFBRTtBQUNMK0MsUUFBSSxFQUFFbkYsWUFBWSxDQUFDcVE7QUFEZCxHQXJDeUI7QUF5Q2hDO0FBQ0EyUyxXQUFTLEVBQUU7QUFDVDdkLFFBQUksRUFBRXpDLE1BREc7QUFFVHNFLFlBQVEsRUFBRSxJQUZEO0FBR1RaLGdCQUFZLEVBQUU7QUFITCxHQTFDcUI7QUFnRGhDdEQsS0FBRyxFQUFFO0FBQ0htRCxTQUFLLEVBQUUsMkNBREo7QUFFSGQsUUFBSSxFQUFFQyxNQUZIO0FBR0hDLFlBQVEsRUFBRSxJQUhQO0FBSUhqRCxTQUFLLEVBQUU7QUFKSixHQWhEMkI7QUF1RGhDO0FBQ0FrUSxTQUFPLEVBQUU7QUFDUHJNLFNBQUssRUFBRSxVQURBO0FBRVBkLFFBQUksRUFBRWEsSUFGQztBQUdQWCxZQUFRLEVBQUU7QUFISCxHQXhEdUI7QUE4RGhDaVIsa0JBQWdCLEVBQUU7QUFDaEJyUSxTQUFLLEVBQUUsNENBRFM7QUFFaEJkLFFBQUksRUFBRWEsSUFGVTtBQUdoQlgsWUFBUSxFQUFFO0FBSE0sR0E5RGM7QUFtRWhDMFQsa0JBQWdCLEVBQUU7QUFDaEI5UyxTQUFLLEVBQUUsMkRBRFM7QUFFaEJkLFFBQUksRUFBRW5GLFlBQVksQ0FBQ3FRLE9BRkg7QUFHaEJoTCxZQUFRLEVBQUUsSUFITTtBQUloQm9MLE9BQUcsRUFBRTtBQUpXLEdBbkVjO0FBMEVoQzhTLGVBQWEsRUFBRTtBQUNicGUsUUFBSSxFQUFFd0MsS0FETztBQUVidkIsZ0JBQVksRUFBRTtBQUZELEdBMUVpQjtBQThFaEMscUJBQW1CO0FBQ2pCakIsUUFBSSxFQUFFQztBQURXLEdBOUVhO0FBa0ZoQztBQUNBK04sUUFBTSxFQUFFO0FBQ05sTixTQUFLLEVBQUUsV0FERDtBQUVOZCxRQUFJLEVBQUVhLElBRkE7QUFHTlgsWUFBUSxFQUFFO0FBSEosR0FuRndCO0FBd0ZoQ2dPLFlBQVUsRUFBRTtBQUNWcE4sU0FBSyxFQUFFLGVBREc7QUFFVmQsUUFBSSxFQUFFQyxNQUZJO0FBR1ZDLFlBQVEsRUFBRSxJQUhBO0FBSVY4QixpQkFBYSxFQUFFMmI7QUFKTCxHQXhGb0I7QUE4RmhDaEwsWUFBVSxFQUFFO0FBQ1Y3UixTQUFLLEVBQUUsZUFERztBQUVWZCxRQUFJLEVBQUVDLE1BRkk7QUFHVkMsWUFBUSxFQUFFLElBSEE7QUFJVkMsU0FBSyxFQUFFO0FBSkcsR0E5Rm9CO0FBcUdoQztBQUNBO0FBQ0E7QUFDQXFlLFdBQVMsRUFBRTtBQUNUMWQsU0FBSyxFQUFFLFlBREU7QUFFVGQsUUFBSSxFQUFFYSxJQUZHO0FBR1RYLFlBQVEsRUFBRTtBQUhELEdBeEdxQjtBQTZHaEN5ZSxlQUFhLEVBQUU7QUFDYjdkLFNBQUssRUFBRSxnQkFETTtBQUViZCxRQUFJLEVBQUVDLE1BRk87QUFHYkMsWUFBUSxFQUFFLElBSEc7QUFJYjhCLGlCQUFhLEVBQUUyYjtBQUpGO0FBN0dpQixDQUFqQixDQUFqQjtBQXFIQXplLE9BQU8sQ0FBQzRELE1BQVIsQ0FBZTZJLE1BQWYsQ0FBc0JsTSxlQUF0QjtBQUNBUCxPQUFPLENBQUM0RCxNQUFSLENBQWU2SSxNQUFmLENBQXNCaE0sY0FBdEI7QUFDQVQsT0FBTyxDQUFDNEQsTUFBUixDQUFlNkksTUFBZixDQUFzQjdMLFNBQVMsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUEvQjtBQUNBWixPQUFPLENBQUM0RCxNQUFSLENBQWU2SSxNQUFmLENBQXNCN0wsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsS0FBaEIsQ0FBL0I7QUFDQVosT0FBTyxDQUFDME0sWUFBUixDQUFxQjFNLE9BQU8sQ0FBQzRELE1BQTdCLEU7Ozs7Ozs7Ozs7O0FDbEpBLElBQUlvYyxZQUFKO0FBQWlCemtCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHdDQUFaLEVBQXFEO0FBQUNza0IsY0FBWSxDQUFDbmtCLENBQUQsRUFBRztBQUFDbWtCLGdCQUFZLEdBQUNua0IsQ0FBYjtBQUFlOztBQUFoQyxDQUFyRCxFQUF1RixDQUF2RjtBQUEwRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDc0UsU0FBTyxDQUFDbkUsQ0FBRCxFQUFHO0FBQUNtRSxXQUFPLEdBQUNuRSxDQUFSO0FBQVU7O0FBQXRCLENBQTVCLEVBQW9ELENBQXBEO0FBR3ZINEgsTUFBTSxDQUFDd00sT0FBUCxDQUFlLGVBQWYsRUFBZ0MsVUFBU0MsS0FBVCxFQUFnQjtBQUM5QyxNQUFJLENBQUMsS0FBSzFPLE1BQVYsRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDME8sS0FBRCxJQUFVQSxLQUFLLENBQUMrUCxPQUFOLEtBQWtCeGUsU0FBaEMsRUFBMkM7QUFDekMsV0FBT3pCLE9BQU8sQ0FBQzJGLElBQVIsRUFBUDtBQUNEOztBQUVELFNBQU8zRixPQUFPLENBQUMyRixJQUFSLENBQWE7QUFBRTJaLGFBQVMsRUFBRTtBQUFFdlEsYUFBTyxFQUFFak4sT0FBTyxDQUFDb08sS0FBSyxDQUFDK1AsT0FBUDtBQUFsQjtBQUFiLEdBQWIsQ0FBUDtBQUNELENBVkQ7QUFZQXhjLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSxZQUFmLEVBQTZCLGdCQUF1QjtBQUFBLE1BQWQ7QUFBRTlCO0FBQUYsR0FBYztBQUNsRCxRQUFNK1IsUUFBUSxHQUFHO0FBQ2ZyakIsT0FBRyxFQUFFc1IsUUFEVTtBQUVmbVIsYUFBUyxFQUFFO0FBQUV2USxhQUFPLEVBQUU7QUFBWDtBQUZJLEdBQWpCO0FBSUEsUUFBTW9SLFlBQVksR0FBR25nQixPQUFPLENBQUMyRixJQUFSLENBQWF1YSxRQUFiLEVBQXVCdGEsS0FBdkIsS0FBaUMsQ0FBdEQ7O0FBRUEsTUFBSXVhLFlBQUosRUFBa0I7QUFDaEJILGdCQUFZLENBQUMsS0FBS3pNLFVBQU4sRUFBa0JwRixRQUFsQixDQUFaO0FBQ0Q7O0FBQ0QsU0FBT25PLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYXVhLFFBQWIsQ0FBUDtBQUNELENBWEQ7QUFhQSxNQUFNRSxPQUFPLEdBQUcsRUFBaEI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsS0FBakI7QUFFQTVjLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlLE1BQU07QUFDbkIsTUFBSTRjLFlBQVksR0FBRyxJQUFuQjtBQUNBRCxZQUFVLEdBQUdyZ0IsT0FBTyxDQUFDMkYsSUFBUixHQUFlQyxLQUFmLEtBQXlCLENBQXRDLENBRm1CLENBR25CO0FBQ0E7QUFDQTs7QUFDQSxRQUFNMmEsTUFBTSxHQUFHdmdCLE9BQU8sQ0FBQzJGLElBQVIsQ0FBYSxFQUFiLEVBQWlCO0FBQUV3SyxVQUFNLEVBQUU7QUFBRXRULFNBQUcsRUFBRTtBQUFQO0FBQVYsR0FBakIsRUFBeUMyakIsY0FBekMsQ0FBd0Q7QUFDckVDLFNBQUssRUFBRWxULEVBQUUsSUFBSTtBQUNYLFVBQUkrUyxZQUFKLEVBQWtCO0FBQ2hCO0FBQ0Q7O0FBQ0QsVUFBSXRnQixPQUFPLENBQUMyRixJQUFSLEdBQWVDLEtBQWYsS0FBeUIsQ0FBekIsSUFBOEIsQ0FBQ3lhLFVBQW5DLEVBQStDO0FBQzdDQSxrQkFBVSxHQUFHLElBQWI7O0FBQ0EsYUFBSyxNQUFNOVMsRUFBWCxJQUFpQjZTLE9BQWpCLEVBQTBCO0FBQ3hCLGNBQUlBLE9BQU8sQ0FBQ3JjLGNBQVIsQ0FBdUJ3SixFQUF2QixDQUFKLEVBQWdDO0FBQzlCLGtCQUFNbVQsTUFBTSxHQUFHTixPQUFPLENBQUM3UyxFQUFELENBQXRCO0FBQ0FtVCxrQkFBTSxDQUFDQyxPQUFQLENBQWUsWUFBZixFQUE2QixJQUE3QixFQUFtQztBQUFFTjtBQUFGLGFBQW5DO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsS0Fkb0U7QUFnQnJFTyxXQUFPLEVBQUVyVCxFQUFFLElBQUk7QUFDYixVQUFJdk4sT0FBTyxDQUFDMkYsSUFBUixHQUFlQyxLQUFmLE9BQTJCLENBQTNCLElBQWdDeWEsVUFBcEMsRUFBZ0Q7QUFDOUNBLGtCQUFVLEdBQUcsS0FBYjs7QUFDQSxhQUFLLE1BQU05UyxFQUFYLElBQWlCNlMsT0FBakIsRUFBMEI7QUFDeEIsY0FBSUEsT0FBTyxDQUFDcmMsY0FBUixDQUF1QndKLEVBQXZCLENBQUosRUFBZ0M7QUFDOUIsa0JBQU1tVCxNQUFNLEdBQUdOLE9BQU8sQ0FBQzdTLEVBQUQsQ0FBdEI7QUFDQW1ULGtCQUFNLENBQUNDLE9BQVAsQ0FBZSxZQUFmLEVBQTZCLElBQTdCLEVBQW1DO0FBQUVOO0FBQUYsYUFBbkM7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQTFCb0UsR0FBeEQsQ0FBZjtBQTZCQUMsY0FBWSxHQUFHLEtBQWY7QUFDRCxDQXBDRDtBQXNDQTdjLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLFlBQVc7QUFDOUJtUSxTQUFPLENBQUMsS0FBSzdNLFVBQUwsQ0FBZ0JoRyxFQUFqQixDQUFQLEdBQThCLElBQTlCO0FBQ0EsT0FBS2tULEtBQUwsQ0FBVyxZQUFYLEVBQXlCLElBQXpCLEVBQStCO0FBQUVKO0FBQUYsR0FBL0I7QUFDQSxPQUFLUSxLQUFMO0FBQ0EsT0FBS0MsTUFBTCxDQUFZLE1BQU0sT0FBT1YsT0FBTyxDQUFDLEtBQUs3TSxVQUFMLENBQWdCaEcsRUFBakIsQ0FBaEM7QUFDRCxDQUxELEU7Ozs7Ozs7Ozs7O0FDckVBaFMsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ2loQixpQkFBZSxFQUFDLE1BQUlBO0FBQXJCLENBQWQ7QUFBcUQsSUFBSWpOLGVBQUo7QUFBb0JqVSxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDOFQsaUJBQWUsQ0FBQzNULENBQUQsRUFBRztBQUFDMlQsbUJBQWUsR0FBQzNULENBQWhCO0FBQWtCOztBQUF0QyxDQUExQyxFQUFrRixDQUFsRjtBQUFxRixJQUFJRixZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW9FLE1BQUo7QUFBVzFFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUExQixFQUFnRCxDQUFoRDtBQUFtRCxJQUFJSyxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNLLFVBQU0sR0FBQ0wsQ0FBUDtBQUFTOztBQUFyQixDQUE5QixFQUFxRCxDQUFyRDtBQU01UyxNQUFNNGdCLGVBQWUsR0FBRyxJQUFJak4sZUFBSixDQUFvQjtBQUNqRGpULE1BQUksRUFBRSwyQkFEMkM7QUFHakRrVCxVQUFRLEVBQUUsSUFBSTlULFlBQUosQ0FBaUI7QUFDekJ1YSxXQUFPLEVBQUU7QUFDUHBWLFVBQUksRUFBRUMsTUFEQztBQUVQRSxXQUFLLEVBQUV0RixZQUFZLENBQUN1RixLQUFiLENBQW1CQztBQUZuQixLQURnQjtBQUt6QnRELE9BQUcsRUFBRTtBQUNIaUQsVUFBSSxFQUFFQztBQURILEtBTG9CO0FBUXpCMkUsU0FBSyxFQUFFO0FBQ0w1RSxVQUFJLEVBQUVDO0FBREQsS0FSa0I7QUFXekJnUyxVQUFNLEVBQUU7QUFDTmpTLFVBQUksRUFBRWdCLE9BREE7QUFFTmQsY0FBUSxFQUFFO0FBRkosS0FYaUI7QUFlekJnUyxjQUFVLEVBQUU7QUFDVmxTLFVBQUksRUFBRWdCLE9BREk7QUFFVmQsY0FBUSxFQUFFO0FBRkE7QUFmYSxHQUFqQixFQW1CUDJPLFNBbkJPLEVBSHVDOztBQXdCakRDLEtBQUcsT0FBOEM7QUFBQSxRQUE3QztBQUFFc0csYUFBRjtBQUFXclksU0FBWDtBQUFnQjZILFdBQWhCO0FBQXVCcU4sWUFBdkI7QUFBK0JDO0FBQS9CLEtBQTZDO0FBQy9DLFVBQU1tQyxLQUFLLEdBQUdsVixNQUFNLENBQUNyRCxPQUFQLENBQWVzWixPQUFmLENBQWQ7O0FBQ0EsUUFBSSxDQUFDZixLQUFMLEVBQVk7QUFDVixZQUFNLElBQUlsWCxLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNELEtBSjhDLENBSy9DOzs7QUFFQSxVQUFNd0gsR0FBRyxHQUFHbEIsSUFBSSxDQUFDME8sS0FBTCxDQUFXdk4sS0FBWCxDQUFaO0FBQ0EsUUFBSXlDLE1BQU0sR0FBRztBQUFFLHNCQUFTdEssR0FBVCxJQUFpQjRIO0FBQW5CLEtBQWI7QUFDQSxVQUFNNkksUUFBUSxHQUFHeUUsTUFBTSxHQUFHO0FBQUVHLFdBQUssRUFBRS9LO0FBQVQsS0FBSCxHQUF1QjtBQUFFWCxVQUFJLEVBQUVXO0FBQVIsS0FBOUM7QUFFQWxJLFVBQU0sQ0FBQ2tJLE1BQVAsQ0FBYytOLE9BQWQsRUFBdUI1SCxRQUF2QixFQUFpQztBQUMvQnVCLGlCQUFXLEVBQUUsS0FEa0I7QUFFL0JDLFlBQU0sRUFBRSxLQUZ1QjtBQUcvQkwsY0FBUSxFQUFFLEtBSHFCO0FBSS9CMEQsaUJBQVcsRUFBRSxLQUprQjtBQUsvQkMsd0JBQWtCLEVBQUU7QUFMVyxLQUFqQzs7QUFRQSxRQUFJM1AsTUFBTSxDQUFDNFAsUUFBUCxJQUFtQixDQUFDTCxVQUF4QixFQUFvQztBQUNsQzlXLFlBQU0sQ0FBQ0gsWUFBUCxDQUFvQjtBQUNsQnVYLFlBQUksRUFBRSxLQUFLQyxVQURPO0FBRWxCMkMsZUFGa0I7QUFHbEJmLGFBSGtCO0FBSWxCdFgsV0FKa0I7QUFLbEI2SCxhQUFLLEVBQUVELEdBTFc7QUFNbEIrTixpQkFBUyxFQUFFMkIsS0FBSyxDQUFDelMsSUFBTixJQUFjeVMsS0FBSyxDQUFDelMsSUFBTixDQUFXN0UsR0FBWCxDQU5QO0FBT2xCa1Y7QUFQa0IsT0FBcEI7QUFTRDtBQUNGOztBQXREZ0QsQ0FBcEIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7QUNOUHhYLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUN5RSxRQUFNLEVBQUMsTUFBSUE7QUFBWixDQUFkO0FBQW1DLElBQUl0RSxZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSStFLFNBQUosRUFBY0QsWUFBZCxFQUEyQkYsY0FBM0IsRUFBMENGLGVBQTFDO0FBQTBEaEYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2tGLFdBQVMsQ0FBQy9FLENBQUQsRUFBRztBQUFDK0UsYUFBUyxHQUFDL0UsQ0FBVjtBQUFZLEdBQTFCOztBQUEyQjhFLGNBQVksQ0FBQzlFLENBQUQsRUFBRztBQUFDOEUsZ0JBQVksR0FBQzlFLENBQWI7QUFBZSxHQUExRDs7QUFBMkQ0RSxnQkFBYyxDQUFDNUUsQ0FBRCxFQUFHO0FBQUM0RSxrQkFBYyxHQUFDNUUsQ0FBZjtBQUFpQixHQUE5Rjs7QUFBK0YwRSxpQkFBZSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxtQkFBZSxHQUFDMUUsQ0FBaEI7QUFBa0I7O0FBQXBJLENBQWpDLEVBQXVLLENBQXZLO0FBU2xLLE1BQU1vRSxNQUFNLEdBQUcsSUFBSStLLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixRQUFyQixDQUFmO0FBRVBoTCxNQUFNLENBQUMyRCxNQUFQLEdBQWdCLElBQUlqSSxZQUFKLENBQWlCO0FBQy9CO0FBQ0E7QUFDQW9DLE9BQUssRUFBRTtBQUNMK0MsUUFBSSxFQUFFbkYsWUFBWSxDQUFDcVEsT0FEZDtBQUVMSSxPQUFHLEVBQUUsQ0FGQTtBQUdMQyxPQUFHLEVBQUUsSUFIQSxDQUdLOztBQUhMO0FBSHdCLENBQWpCLENBQWhCO0FBVUFwTSxNQUFNLENBQUMyRCxNQUFQLENBQWM2SSxNQUFkLENBQXFCbE0sZUFBckI7QUFDQU4sTUFBTSxDQUFDMkQsTUFBUCxDQUFjNkksTUFBZCxDQUFxQmhNLGNBQXJCO0FBQ0FSLE1BQU0sQ0FBQzJELE1BQVAsQ0FBYzZJLE1BQWQsQ0FBcUI5TCxZQUFZLENBQUMsUUFBRCxDQUFqQztBQUNBVixNQUFNLENBQUMyRCxNQUFQLENBQWM2SSxNQUFkLENBQXFCN0wsU0FBUyxDQUFDLE9BQUQsQ0FBOUI7QUFDQVgsTUFBTSxDQUFDMkQsTUFBUCxDQUFjNkksTUFBZCxDQUFxQjlMLFlBQVksQ0FBQyxjQUFELENBQWpDO0FBQ0FWLE1BQU0sQ0FBQ3lNLFlBQVAsQ0FBb0J6TSxNQUFNLENBQUMyRCxNQUEzQixFOzs7Ozs7Ozs7OztBQzFCQXJJLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNPLGNBQVksRUFBQyxNQUFJQTtBQUFsQixDQUFkO0FBQStDLElBQUlHLE1BQUo7QUFBV1gsTUFBTSxDQUFDRyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0ssVUFBTSxHQUFDTCxDQUFQO0FBQVM7O0FBQXJCLENBQTlCLEVBQXFELENBQXJEO0FBQXdELElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQWhDLEVBQW9ELENBQXBEO0FBQXVELElBQUltRSxPQUFKO0FBQVl6RSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDc0UsU0FBTyxDQUFDbkUsQ0FBRCxFQUFHO0FBQUNtRSxXQUFPLEdBQUNuRSxDQUFSO0FBQVU7O0FBQXRCLENBQXBDLEVBQTRELENBQTVEO0FBQStELElBQUlvRSxNQUFKO0FBQVcxRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDdUUsUUFBTSxDQUFDcEUsQ0FBRCxFQUFHO0FBQUNvRSxVQUFNLEdBQUNwRSxDQUFQO0FBQVM7O0FBQXBCLENBQWxDLEVBQXdELENBQXhEO0FBQTJELElBQUlxRSxNQUFKO0FBQVczRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDd0UsUUFBTSxDQUFDckUsQ0FBRCxFQUFHO0FBQUNxRSxVQUFNLEdBQUNyRSxDQUFQO0FBQVM7O0FBQXBCLENBQWxDLEVBQXdELENBQXhEO0FBQTJELElBQUlzRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDeUUsWUFBVSxDQUFDdEUsQ0FBRCxFQUFHO0FBQUNzRSxjQUFVLEdBQUN0RSxDQUFYO0FBQWE7O0FBQTVCLENBQTFDLEVBQXdFLENBQXhFO0FBQTJFLElBQUlzYSxxQkFBSixFQUEwQmpCLHVCQUExQjtBQUFrRDNaLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUN5YSx1QkFBcUIsQ0FBQ3RhLENBQUQsRUFBRztBQUFDc2EseUJBQXFCLEdBQUN0YSxDQUF0QjtBQUF3QixHQUFsRDs7QUFBbURxWix5QkFBdUIsQ0FBQ3JaLENBQUQsRUFBRztBQUFDcVosMkJBQXVCLEdBQUNyWixDQUF4QjtBQUEwQjs7QUFBeEcsQ0FBMUMsRUFBb0osQ0FBcEo7QUFBdUosSUFBSW9aLGlCQUFKO0FBQXNCMVosTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VaLG1CQUFpQixDQUFDcFosQ0FBRCxFQUFHO0FBQUNvWixxQkFBaUIsR0FBQ3BaLENBQWxCO0FBQW9COztBQUExQyxDQUFsQyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJSixNQUFKO0FBQVdGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsUUFBTSxDQUFDSSxDQUFELEVBQUc7QUFBQ0osVUFBTSxHQUFDSSxDQUFQO0FBQVM7O0FBQXBCLENBQTNCLEVBQWlELENBQWpEO0FBYS94QixNQUFNa2xCLE9BQU8sR0FBRztBQUNkOUQsZUFBYSxFQUFFLGFBREQ7QUFFZGxCLGVBQWEsRUFBRSxhQUZEO0FBR2Q1RCxTQUFPLEVBQUUsT0FISztBQUlkakMsU0FBTyxFQUFFLE9BSks7QUFLZDdZLFFBQU0sRUFBRTtBQUxNLENBQWhCLEMsQ0FRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ08sTUFBTXRCLFlBQVksR0FBR3NNLE1BQU0sSUFBSTtBQUNwQyxRQUFNMlksTUFBTSxHQUFHM1ksTUFBTSxDQUFDMEssTUFBUCxHQUFnQixVQUFoQixHQUE2QixPQUE1QztBQUNBLFFBQU07QUFBRTVULFlBQUY7QUFBWSxLQUFDNmhCLE1BQUQsR0FBVUM7QUFBdEIsTUFBc0N4bEIsTUFBNUM7QUFDQSxRQUFNeWxCLFNBQVMsR0FBRyxFQUFsQjs7QUFDQSxNQUFJRCxXQUFKLEVBQWlCO0FBQ2ZDLGFBQVMsQ0FBQy9YLElBQVYsQ0FBZThYLFdBQWY7QUFDRDs7QUFDRCxNQUFJOWhCLFFBQUosRUFBYztBQUNaK2hCLGFBQVMsQ0FBQy9YLElBQVYsQ0FBZWhLLFFBQWY7QUFDRDs7QUFDRCxNQUFJK2hCLFNBQVMsQ0FBQ3RZLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUI7QUFDRDs7QUFFRCxNQUFJUCxNQUFNLENBQUNpTCxJQUFQLElBQWUsQ0FBQ2pMLE1BQU0sQ0FBQzhGLFFBQTNCLEVBQXFDO0FBQ25DOUYsVUFBTSxDQUFDOEYsUUFBUCxHQUFrQmpTLE1BQU0sQ0FBQ0osZUFBUCxDQUF1QnVNLE1BQU0sQ0FBQ2lMLElBQTlCLENBQWxCO0FBQ0Q7O0FBRUQsTUFBSTNWLE1BQU0sR0FBRzBLLE1BQU0sQ0FBQ29NLE1BQXBCO0FBQUEsTUFDRTBNLFVBQVUsR0FBRyxRQURmOztBQUVBLE9BQUssTUFBTXRqQixHQUFYLElBQWtCa2pCLE9BQWxCLEVBQTJCO0FBQ3pCLFFBQUkxWSxNQUFNLENBQUN4SyxHQUFELENBQVYsRUFBaUI7QUFDZnNqQixnQkFBVSxHQUFHSixPQUFPLENBQUNsakIsR0FBRCxDQUFwQjtBQUNBRixZQUFNLEdBQUcwSyxNQUFNLENBQUMwWSxPQUFPLENBQUNsakIsR0FBRCxDQUFSLENBQWYsQ0FGZSxDQUdmOztBQUNBLFVBQUl3SyxNQUFNLENBQUMwSyxNQUFYLEVBQW1CO0FBQ2pCLFlBQUksQ0FBQ3BWLE1BQU0sQ0FBQytFLElBQVAsQ0FBWTJGLE1BQU0sQ0FBQ3hLLEdBQW5CLENBQUwsRUFBOEI7QUFDNUJGLGdCQUFNLENBQUMrRSxJQUFQLENBQVkyRixNQUFNLENBQUN4SyxHQUFuQixJQUEwQixDQUFDd0ssTUFBTSxDQUFDM0MsS0FBUixDQUExQjtBQUNELFNBRkQsTUFFTztBQUNML0gsZ0JBQU0sQ0FBQytFLElBQVAsQ0FBWTJGLE1BQU0sQ0FBQ3hLLEdBQW5CLElBQTBCRixNQUFNLENBQUMrRSxJQUFQLENBQVkyRixNQUFNLENBQUN4SyxHQUFuQixFQUF3QjhULEtBQXhCLENBQThCLENBQTlCLENBQTFCO0FBQ0FoVSxnQkFBTSxDQUFDK0UsSUFBUCxDQUFZMkYsTUFBTSxDQUFDeEssR0FBbkIsRUFBd0JzTCxJQUF4QixDQUE2QmQsTUFBTSxDQUFDM0MsS0FBcEM7QUFDRDtBQUNGLE9BUEQsTUFPTztBQUNML0gsY0FBTSxDQUFDK0UsSUFBUCxDQUFZMkYsTUFBTSxDQUFDeEssR0FBbkIsSUFBMEJ3SyxNQUFNLENBQUMzQyxLQUFqQztBQUNEOztBQUNEO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJO0FBQUUrTyxVQUFGO0FBQVU5WCxRQUFWO0FBQWdCd1ksU0FBaEI7QUFBdUJDO0FBQXZCLE1BQWlDL00sTUFBckM7QUFFQW9NLFFBQU0sR0FBR0EsTUFBTSxJQUFJelUsT0FBTyxDQUFDcEQsT0FBUixDQUFnQnlMLE1BQU0sQ0FBQzhGLFFBQXZCLENBQW5CO0FBQ0F4UixNQUFJLEdBQUdBLElBQUksSUFBSVAsS0FBSyxDQUFDUSxPQUFOLENBQWM2WCxNQUFNLENBQUNwWCxNQUFyQixDQUFmOztBQUNBLE1BQUksQ0FBQ1YsSUFBTCxFQUFXO0FBQ1RJLFdBQU8sQ0FBQ0ksS0FBUixXQUFpQmdrQixVQUFqQjtBQUNBO0FBQ0Q7O0FBQ0QvTCxPQUFLLEdBQUdBLEtBQUssSUFBSWxWLE1BQU0sQ0FBQ3RELE9BQVAsQ0FBZUQsSUFBSSxDQUFDMlksY0FBcEIsQ0FBakI7O0FBQ0EsTUFBSSxDQUFDRixLQUFMLEVBQVk7QUFDVnJZLFdBQU8sQ0FBQ0ksS0FBUixXQUFpQmdrQixVQUFqQjtBQUNBO0FBQ0Q7O0FBRUQsUUFBTTtBQUFFakw7QUFBRixNQUFjZCxLQUFwQjtBQUNBRCxPQUFLLEdBQUdBLEtBQUssSUFBSWxWLE1BQU0sQ0FBQ3JELE9BQVAsQ0FBZXNaLE9BQWYsQ0FBakI7QUFDQSxRQUFNbEosU0FBUyxHQUFHN00sVUFBVSxDQUFDdkQsT0FBWCxDQUFtQkQsSUFBSSxDQUFDd1EsV0FBeEIsQ0FBbEI7QUFFQThILG1CQUFpQixDQUFDO0FBQUV0WSxRQUFGO0FBQVFxUSxhQUFSO0FBQW1CbUksU0FBbkI7QUFBMEJDO0FBQTFCLEdBQUQsQ0FBakI7QUFFQWUsdUJBQXFCLENBQUN4WixJQUFELEVBQU95WSxLQUFQLEVBQWNELEtBQWQsQ0FBckI7QUFFQStMLFdBQVMsQ0FBQzlpQixPQUFWLENBQWtCK00sUUFBUSxJQUFJO0FBQzVCQSxZQUFRLENBQ054TyxJQURNLEVBRU53WSxLQUZNLEVBR05DLEtBSE0sRUFJTlgsTUFKTSxFQUtOOVcsTUFMTSxFQU1Od2pCLFVBTk0sRUFPTjlZLE1BQU0sQ0FBQ3hLLEdBUEQsRUFRTndLLE1BQU0sQ0FBQzNDLEtBUkQsRUFTTjJDLE1BQU0sQ0FBQ21MLFNBVEQsRUFVTm5MLE1BQU0sQ0FBQzBLLE1BVkQsQ0FVUTtBQVZSLEtBQVI7QUFZRCxHQWJEO0FBY0QsQ0EzRU0sQzs7Ozs7Ozs7Ozs7QUMzQlB4WCxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDUSxjQUFZLEVBQUMsTUFBSUE7QUFBbEIsQ0FBZDtBQUErQyxJQUFJRSxNQUFKO0FBQVdYLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNLLFVBQU0sR0FBQ0wsQ0FBUDtBQUFTOztBQUFyQixDQUE5QixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNVLE9BQUssQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLFNBQUssR0FBQ1AsQ0FBTjtBQUFROztBQUFsQixDQUFoQyxFQUFvRCxDQUFwRDtBQUF1RCxJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJb0UsTUFBSjtBQUFXMUUsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3dFLFFBQU0sQ0FBQ3JFLENBQUQsRUFBRztBQUFDcUUsVUFBTSxHQUFDckUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJc0UsVUFBSjtBQUFlNUUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUExQyxFQUF3RSxDQUF4RTtBQUEyRSxJQUFJc2EscUJBQUosRUFBMEJqQix1QkFBMUI7QUFBa0QzWixNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDeWEsdUJBQXFCLENBQUN0YSxDQUFELEVBQUc7QUFBQ3NhLHlCQUFxQixHQUFDdGEsQ0FBdEI7QUFBd0IsR0FBbEQ7O0FBQW1EcVoseUJBQXVCLENBQUNyWixDQUFELEVBQUc7QUFBQ3FaLDJCQUF1QixHQUFDclosQ0FBeEI7QUFBMEI7O0FBQXhHLENBQTFDLEVBQW9KLENBQXBKO0FBQXVKLElBQUlvWixpQkFBSjtBQUFzQjFaLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHFCQUFaLEVBQWtDO0FBQUN1WixtQkFBaUIsQ0FBQ3BaLENBQUQsRUFBRztBQUFDb1oscUJBQWlCLEdBQUNwWixDQUFsQjtBQUFvQjs7QUFBMUMsQ0FBbEMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSUosTUFBSjtBQUFXRixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNELFFBQU0sQ0FBQ0ksQ0FBRCxFQUFHO0FBQUNKLFVBQU0sR0FBQ0ksQ0FBUDtBQUFTOztBQUFwQixDQUEzQixFQUFpRCxDQUFqRDs7QUFheHhCLE1BQU1HLFlBQVksR0FBR3FNLE1BQU0sSUFBSTtBQUNwQyxRQUFNO0FBQUVqSjtBQUFGLE1BQWUzRCxNQUFyQjs7QUFDQSxNQUFJLENBQUMyRCxRQUFMLEVBQWU7QUFDYjtBQUNEOztBQUVELFFBQU07QUFBRStPLFlBQUY7QUFBWXFQO0FBQVosTUFBNEJuVixNQUFsQztBQUVBLFFBQU1vTSxNQUFNLEdBQUd6VSxPQUFPLENBQUNwRCxPQUFSLENBQWdCdVIsUUFBaEIsQ0FBZjtBQUNBLFFBQU14UixJQUFJLEdBQUdQLEtBQUssQ0FBQ1EsT0FBTixDQUFjNlgsTUFBTSxDQUFDcFgsTUFBckIsQ0FBYjs7QUFDQSxNQUFJLENBQUNWLElBQUwsRUFBVztBQUNUSSxXQUFPLENBQUNJLEtBQVIsV0FBaUJna0IsVUFBakI7QUFDQTtBQUNEOztBQUNELFFBQU0vTCxLQUFLLEdBQUdsVixNQUFNLENBQUN0RCxPQUFQLENBQWU0Z0IsV0FBVyxDQUFDckYsT0FBM0IsQ0FBZDs7QUFDQSxNQUFJLENBQUMvQyxLQUFMLEVBQVk7QUFDVnJZLFdBQU8sQ0FBQ0ksS0FBUixXQUFpQmdrQixVQUFqQjtBQUNBO0FBQ0Q7O0FBRUQsUUFBTTtBQUFFakw7QUFBRixNQUFjZCxLQUFwQjtBQUNBLFFBQU1ELEtBQUssR0FBR2xWLE1BQU0sQ0FBQ3JELE9BQVAsQ0FBZXNaLE9BQWYsQ0FBZDtBQUNBLFFBQU1sSixTQUFTLEdBQUc3TSxVQUFVLENBQUN2RCxPQUFYLENBQW1CRCxJQUFJLENBQUN3USxXQUF4QixDQUFsQjtBQUVBOEgsbUJBQWlCLENBQUM7QUFBRXRZLFFBQUY7QUFBUXFRLGFBQVI7QUFBbUJtSSxTQUFuQjtBQUEwQkM7QUFBMUIsR0FBRCxDQUFqQjtBQUVBZSx1QkFBcUIsQ0FBQ3haLElBQUQsRUFBT3lZLEtBQVAsRUFBY0QsS0FBZCxDQUFyQjtBQUVBVixRQUFNLENBQUNXLEtBQVAsR0FBZTFNLENBQUMsQ0FBQytELE1BQUYsQ0FBUyxFQUFULEVBQWEySSxLQUFiLENBQWY7QUFDQVgsUUFBTSxDQUFDVSxLQUFQLEdBQWV6TSxDQUFDLENBQUMrRCxNQUFGLENBQVMsRUFBVCxFQUFhMEksS0FBYixDQUFmO0FBQ0FELHlCQUF1QixDQUFDVCxNQUFELEVBQVNBLE1BQU0sQ0FBQ1csS0FBaEIsRUFBdUJYLE1BQU0sQ0FBQ1UsS0FBOUIsRUFBcUN4WSxJQUFyQyxDQUF2QjtBQUVBeUMsVUFBUSxDQUFDekMsSUFBRCxFQUFPd1ksS0FBUCxFQUFjQyxLQUFkLEVBQXFCWCxNQUFyQixDQUFSO0FBQ0QsQ0FqQ00sQzs7Ozs7Ozs7Ozs7QUNiUGxaLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNpZixZQUFVLEVBQUMsTUFBSUE7QUFBaEIsQ0FBZDtBQUEyQyxJQUFJN0csTUFBSjtBQUFXclksTUFBTSxDQUFDRyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDK1gsVUFBTSxHQUFDL1gsQ0FBUDtBQUFTOztBQUFyQixDQUFyQixFQUE0QyxDQUE1QztBQUErQyxJQUFJSixNQUFKO0FBQVdGLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0QsUUFBTSxDQUFDSSxDQUFELEVBQUc7QUFBQ0osVUFBTSxHQUFDSSxDQUFQO0FBQVM7O0FBQXBCLENBQTNCLEVBQWlELENBQWpEO0FBQW9ELElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQWhDLEVBQW9ELENBQXBEO0FBQXVELElBQUlzYSxxQkFBSixFQUEwQmpCLHVCQUExQjtBQUFrRDNaLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUN5YSx1QkFBcUIsQ0FBQ3RhLENBQUQsRUFBRztBQUFDc2EseUJBQXFCLEdBQUN0YSxDQUF0QjtBQUF3QixHQUFsRDs7QUFBbURxWix5QkFBdUIsQ0FBQ3JaLENBQUQsRUFBRztBQUFDcVosMkJBQXVCLEdBQUNyWixDQUF4QjtBQUEwQjs7QUFBeEcsQ0FBMUMsRUFBb0osQ0FBcEo7QUFBdUosSUFBSW9aLGlCQUFKO0FBQXNCMVosTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VaLG1CQUFpQixDQUFDcFosQ0FBRCxFQUFHO0FBQUNvWixxQkFBaUIsR0FBQ3BaLENBQWxCO0FBQW9COztBQUExQyxDQUFsQyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJbUUsT0FBSjtBQUFZekUsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ3NFLFNBQU8sQ0FBQ25FLENBQUQsRUFBRztBQUFDbUUsV0FBTyxHQUFDbkUsQ0FBUjtBQUFVOztBQUF0QixDQUFwQyxFQUE0RCxDQUE1RDtBQUErRCxJQUFJb0UsTUFBSjtBQUFXMUUsTUFBTSxDQUFDRyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQ3VFLFFBQU0sQ0FBQ3BFLENBQUQsRUFBRztBQUFDb0UsVUFBTSxHQUFDcEUsQ0FBUDtBQUFTOztBQUFwQixDQUFsQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJc0UsVUFBSjtBQUFlNUUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUExQyxFQUF3RSxDQUF4RTtBQUEyRSxJQUFJcUUsTUFBSjtBQUFXM0UsTUFBTSxDQUFDRyxJQUFQLENBQVksYUFBWixFQUEwQjtBQUFDd0UsUUFBTSxDQUFDckUsQ0FBRCxFQUFHO0FBQUNxRSxVQUFNLEdBQUNyRSxDQUFQO0FBQVM7O0FBQXBCLENBQTFCLEVBQWdELENBQWhEO0FBQW1ELElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUEzQyxFQUEyRSxDQUEzRTtBQWM5MEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNdWxCLElBQUksR0FBRyxFQUFiOztBQUVPLE1BQU0zRyxVQUFVLEdBQUd0QyxPQUFPLElBQUk7QUFDbkMsTUFBSWlKLElBQUksQ0FBQ2pKLE9BQUQsQ0FBUixFQUFtQjtBQUNqQjtBQUNEOztBQUVEaUosTUFBSSxDQUFDakosT0FBRCxDQUFKLEdBQWdCLElBQWhCO0FBRUEsUUFBTS9DLEtBQUssR0FBR2xWLE1BQU0sQ0FBQ3RELE9BQVAsQ0FBZXViLE9BQWYsQ0FBZDtBQUNBLFFBQU07QUFBRXBhLFNBQUY7QUFBU1YsVUFBVDtBQUFpQjZZO0FBQWpCLE1BQTZCZCxLQUFuQztBQUNBLFFBQU16WSxJQUFJLEdBQUdQLEtBQUssQ0FBQ1EsT0FBTixDQUFjUyxNQUFkLENBQWI7QUFDQSxRQUFNOFgsS0FBSyxHQUFHbFYsTUFBTSxDQUFDckQsT0FBUCxDQUFlc1osT0FBZixDQUFkO0FBQ0EsUUFBTWxKLFNBQVMsR0FBRzdNLFVBQVUsQ0FBQ3ZELE9BQVgsQ0FBbUJELElBQUksQ0FBQ3dRLFdBQXhCLENBQWxCO0FBRUE4SCxtQkFBaUIsQ0FBQztBQUFFdFksUUFBRjtBQUFRcVEsYUFBUjtBQUFtQm1JLFNBQW5CO0FBQTBCQztBQUExQixHQUFELENBQWpCO0FBRUFlLHVCQUFxQixDQUFDeFosSUFBRCxFQUFPeVksS0FBUCxFQUFjRCxLQUFkLENBQXJCO0FBRUEsUUFBTTtBQUFFclcsY0FBRjtBQUFjQyxjQUFkO0FBQTBCSCxnQkFBMUI7QUFBd0NDO0FBQXhDLE1BQXlEcEQsTUFBL0Q7O0FBQ0EsTUFBSXFELFVBQUosRUFBZ0I7QUFDZEEsY0FBVSxDQUFDbkMsSUFBRCxFQUFPd1ksS0FBUCxFQUFjQyxLQUFkLENBQVY7QUFDRDs7QUFFRCxRQUFNNEQsU0FBUyxHQUFHOVksTUFBTSxDQUFDdEQsT0FBUCxDQUFlO0FBQUVTLFVBQUY7QUFBVVUsU0FBSyxFQUFFQSxLQUFLLEdBQUc7QUFBekIsR0FBZixDQUFsQjs7QUFFQSxNQUFLZ0IsVUFBVSxJQUFJLENBQUNpYSxTQUFoQixJQUE4QjVELEtBQUssQ0FBQ2MsT0FBTixLQUFrQjhDLFNBQVMsQ0FBQzlDLE9BQTlELEVBQXVFO0FBQ3JFblgsY0FBVSxDQUFDcEMsSUFBRCxFQUFPd1ksS0FBUCxDQUFWO0FBQ0Q7O0FBRUQsTUFBSTZELFNBQVMsS0FBS3BhLFlBQVksSUFBSUMsWUFBckIsQ0FBYixFQUFpRDtBQUMvQyxVQUFNaWEsU0FBUyxHQUFHN1ksTUFBTSxDQUFDckQsT0FBUCxDQUFlb2MsU0FBUyxDQUFDOUMsT0FBekIsQ0FBbEI7QUFDQUMseUJBQXFCLENBQUN4WixJQUFELEVBQU9xYyxTQUFQLEVBQWtCRixTQUFsQixDQUFyQjtBQUNBbmMsUUFBSSxDQUFDdVMsT0FBTCxDQUFhOVEsT0FBYixDQUFxQnFXLE1BQU0sSUFBSTtBQUM3QkEsWUFBTSxDQUFDVSxLQUFQLEdBQWV6TSxDQUFDLENBQUMrRCxNQUFGLENBQVMsRUFBVCxFQUFhcU0sU0FBYixDQUFmO0FBQ0FyRSxZQUFNLENBQUNXLEtBQVAsR0FBZTFNLENBQUMsQ0FBQytELE1BQUYsQ0FBUyxFQUFULEVBQWF1TSxTQUFiLENBQWY7QUFDQTlELDZCQUF1QixDQUFDVCxNQUFELEVBQVNBLE1BQU0sQ0FBQ1csS0FBaEIsRUFBdUJYLE1BQU0sQ0FBQ1UsS0FBOUIsRUFBcUN4WSxJQUFyQyxDQUF2QjtBQUNELEtBSkQ7O0FBTUEsUUFBSWlDLFlBQVksSUFBSXdXLEtBQUssQ0FBQ2MsT0FBTixLQUFrQjhDLFNBQVMsQ0FBQzlDLE9BQWhELEVBQXlEO0FBQ3ZEdFgsa0JBQVksQ0FBQ2pDLElBQUQsRUFBT21jLFNBQVAsQ0FBWjtBQUNEOztBQUVELFFBQUlqYSxZQUFKLEVBQWtCO0FBQ2hCQSxrQkFBWSxDQUFDbEMsSUFBRCxFQUFPbWMsU0FBUCxFQUFrQkUsU0FBbEIsQ0FBWjtBQUNEO0FBQ0Y7O0FBRUQsTUFBSUEsU0FBSixFQUFlO0FBQ2I7QUFDQSxVQUFNMUQsY0FBYyxHQUFHMEQsU0FBUyxDQUFDbmMsR0FBakM7QUFDQVQsU0FBSyxDQUFDK0wsTUFBTixDQUFhOUssTUFBYixFQUFxQjtBQUNuQm1LLFVBQUksRUFBRTtBQUFFOE47QUFBRjtBQURhLEtBQXJCO0FBR0EsVUFBTXJCLFdBQVcsR0FBR0wsTUFBTSxHQUFHTyxHQUFULENBQWFqVSxNQUFNLENBQUMrWSxvQkFBcEIsQ0FBcEI7QUFDQS9ZLFVBQU0sQ0FBQ2lJLE1BQVAsQ0FBY21OLGNBQWQsRUFBOEI7QUFDNUI5TixVQUFJLEVBQUU7QUFDSnlNLG1CQUFXLEVBQUVBLFdBQVcsQ0FBQzBFLE1BQVo7QUFEVDtBQURzQixLQUE5QjtBQUtELEdBWkQsTUFZTztBQUNMLFVBQU0zWixTQUFTLEdBQUd2RCxNQUFNLENBQUN1RCxTQUF6Qjs7QUFDQSxRQUFJQSxTQUFKLEVBQWU7QUFDYkEsZUFBUyxDQUFDckMsSUFBRCxDQUFUO0FBQ0Q7O0FBQ0RxRCxXQUFPLENBQUNtSSxNQUFSLENBQ0U7QUFDRXRMLFNBQUcsRUFBRTtBQUNIZ1MsV0FBRyxFQUFFbkcsQ0FBQyxDQUFDa0csS0FBRixDQUFRalMsSUFBSSxDQUFDdVMsT0FBYixFQUFzQixLQUF0QixDQURGO0FBRUhILGVBQU8sRUFBRTtBQUFFQyxvQkFBVSxFQUFFO0FBQWQ7QUFGTjtBQURQLEtBREYsRUFPRTtBQUNFeEgsVUFBSSxFQUFFO0FBQUV3SCxrQkFBVSxFQUFFLFVBQWQ7QUFBMEJGLGNBQU0sRUFBRSxJQUFJbk4sSUFBSjtBQUFsQztBQURSLEtBUEYsRUFVRTtBQUFFNk0sV0FBSyxFQUFFO0FBQVQsS0FWRjtBQVlBcFMsU0FBSyxDQUFDK0wsTUFBTixDQUFhOUssTUFBYixFQUFxQjtBQUNuQm1LLFVBQUksRUFBRTtBQUFFMUssa0JBQVUsRUFBRSxJQUFJNkUsSUFBSixFQUFkO0FBQTBCcEUsY0FBTSxFQUFFO0FBQWxDO0FBRGEsS0FBckI7QUFHQW9DLGVBQVcsQ0FBQ3dJLE1BQVosQ0FDRTtBQUFFOUs7QUFBRixLQURGLEVBRUU7QUFDRW1LLFVBQUksRUFBRTtBQUFFakssY0FBTSxFQUFFO0FBQVY7QUFEUixLQUZGO0FBTUQ7O0FBRUQsU0FBTzZqQixJQUFJLENBQUNqSixPQUFELENBQVg7QUFDRCxDQXZGTSxDOzs7Ozs7Ozs7OztBQ3BCUDVjLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNraEIsaUJBQWUsRUFBQyxNQUFJQTtBQUFyQixDQUFkO0FBQXFELElBQUlsTixlQUFKO0FBQW9CalUsTUFBTSxDQUFDRyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhULGlCQUFlLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULG1CQUFlLEdBQUMzVCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUYsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlxRSxNQUFKO0FBQVczRSxNQUFNLENBQUNHLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUN3RSxRQUFNLENBQUNyRSxDQUFELEVBQUc7QUFBQ3FFLFVBQU0sR0FBQ3JFLENBQVA7QUFBUzs7QUFBcEIsQ0FBMUIsRUFBZ0QsQ0FBaEQ7QUFBbUQsSUFBSUssTUFBSjtBQUFXWCxNQUFNLENBQUNHLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSyxVQUFNLEdBQUNMLENBQVA7QUFBUzs7QUFBckIsQ0FBOUIsRUFBcUQsQ0FBckQ7QUFNNVMsTUFBTTZnQixlQUFlLEdBQUcsSUFBSWxOLGVBQUosQ0FBb0I7QUFDakRqVCxNQUFJLEVBQUUsMkJBRDJDO0FBR2pEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCd2MsV0FBTyxFQUFFO0FBQ1ByWCxVQUFJLEVBQUVDLE1BREM7QUFFUEUsV0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkM7QUFGbkIsS0FEZ0I7QUFLekJ0RCxPQUFHLEVBQUU7QUFDSGlELFVBQUksRUFBRUM7QUFESCxLQUxvQjtBQVF6QjJFLFNBQUssRUFBRTtBQUNMNUUsVUFBSSxFQUFFQztBQURELEtBUmtCO0FBV3pCZ1MsVUFBTSxFQUFFO0FBQ05qUyxVQUFJLEVBQUVnQixPQURBO0FBRU5kLGNBQVEsRUFBRTtBQUZKLEtBWGlCO0FBZXpCZ1MsY0FBVSxFQUFFO0FBQ1ZsUyxVQUFJLEVBQUVnQixPQURJO0FBRVZkLGNBQVEsRUFBRTtBQUZBO0FBZmEsR0FBakIsRUFtQlAyTyxTQW5CTyxFQUh1Qzs7QUF3QmpEQyxLQUFHLE9BQThDO0FBQUEsUUFBN0M7QUFBRXVJLGFBQUY7QUFBV3RhLFNBQVg7QUFBZ0I2SCxXQUFoQjtBQUF1QnFOLFlBQXZCO0FBQStCQztBQUEvQixLQUE2QztBQUMvQyxVQUFNb0MsS0FBSyxHQUFHbFYsTUFBTSxDQUFDdEQsT0FBUCxDQUFldWIsT0FBZixDQUFkOztBQUNBLFFBQUksQ0FBQy9DLEtBQUwsRUFBWTtBQUNWLFlBQU0sSUFBSW5YLEtBQUosQ0FBVSxpQkFBVixDQUFOO0FBQ0QsS0FKOEMsQ0FLL0M7OztBQUVBLFVBQU13SCxHQUFHLEdBQUdsQixJQUFJLENBQUMwTyxLQUFMLENBQVd2TixLQUFYLENBQVo7QUFDQSxRQUFJeUMsTUFBTSxHQUFHO0FBQUUsc0JBQVN0SyxHQUFULElBQWlCNEg7QUFBbkIsS0FBYjtBQUNBLFVBQU02SSxRQUFRLEdBQUd5RSxNQUFNLEdBQUc7QUFBRUcsV0FBSyxFQUFFL0s7QUFBVCxLQUFILEdBQXVCO0FBQUVYLFVBQUksRUFBRVc7QUFBUixLQUE5QztBQUVBakksVUFBTSxDQUFDaUksTUFBUCxDQUFjZ1EsT0FBZCxFQUF1QjdKLFFBQXZCLEVBQWlDO0FBQy9CdUIsaUJBQVcsRUFBRSxLQURrQjtBQUUvQkMsWUFBTSxFQUFFLEtBRnVCO0FBRy9CTCxjQUFRLEVBQUUsS0FIcUI7QUFJL0IwRCxpQkFBVyxFQUFFLEtBSmtCO0FBSy9CQyx3QkFBa0IsRUFBRTtBQUxXLEtBQWpDOztBQVFBLFFBQUkzUCxNQUFNLENBQUM0UCxRQUFQLElBQW1CLENBQUNMLFVBQXhCLEVBQW9DO0FBQ2xDOVcsWUFBTSxDQUFDSCxZQUFQLENBQW9CO0FBQ2xCdVgsWUFBSSxFQUFFLEtBQUtDLFVBRE87QUFFbEI0RSxlQUZrQjtBQUdsQi9DLGFBSGtCO0FBSWxCdlgsV0FKa0I7QUFLbEI2SCxhQUFLLEVBQUVELEdBTFc7QUFNbEIrTixpQkFBUyxFQUFFNEIsS0FBSyxDQUFDMVMsSUFBTixJQUFjMFMsS0FBSyxDQUFDMVMsSUFBTixDQUFXN0UsR0FBWCxDQU5QO0FBT2xCa1Y7QUFQa0IsT0FBcEI7QUFTRDtBQUNGOztBQXREZ0QsQ0FBcEIsQ0FBeEIsQzs7Ozs7Ozs7Ozs7QUNOUHhYLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUMwRSxRQUFNLEVBQUMsTUFBSUE7QUFBWixDQUFkO0FBQW1DLElBQUl2RSxZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSStYLE1BQUo7QUFBV3JZLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQytYLFVBQU0sR0FBQy9YLENBQVA7QUFBUzs7QUFBckIsQ0FBckIsRUFBNEMsQ0FBNUM7QUFBK0MsSUFBSStFLFNBQUosRUFBY0wsZUFBZCxFQUE4QkUsY0FBOUIsRUFBNkNFLFlBQTdDO0FBQTBEcEYsTUFBTSxDQUFDRyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ2tGLFdBQVMsQ0FBQy9FLENBQUQsRUFBRztBQUFDK0UsYUFBUyxHQUFDL0UsQ0FBVjtBQUFZLEdBQTFCOztBQUEyQjBFLGlCQUFlLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLG1CQUFlLEdBQUMxRSxDQUFoQjtBQUFrQixHQUFoRTs7QUFBaUU0RSxnQkFBYyxDQUFDNUUsQ0FBRCxFQUFHO0FBQUM0RSxrQkFBYyxHQUFDNUUsQ0FBZjtBQUFpQixHQUFwRzs7QUFBcUc4RSxjQUFZLENBQUM5RSxDQUFELEVBQUc7QUFBQzhFLGdCQUFZLEdBQUM5RSxDQUFiO0FBQWU7O0FBQXBJLENBQWpDLEVBQXVLLENBQXZLO0FBQTBLLElBQUlPLEtBQUo7QUFBVWIsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0JBQVosRUFBNkI7QUFBQ1UsT0FBSyxDQUFDUCxDQUFELEVBQUc7QUFBQ08sU0FBSyxHQUFDUCxDQUFOO0FBQVE7O0FBQWxCLENBQTdCLEVBQWlELENBQWpEO0FBQW9ELElBQUlrRSxZQUFKO0FBQWlCeEUsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ3FFLGNBQVksQ0FBQ2xFLENBQUQsRUFBRztBQUFDa0UsZ0JBQVksR0FBQ2xFLENBQWI7QUFBZTs7QUFBaEMsQ0FBN0MsRUFBK0UsQ0FBL0U7QUFBa0YsSUFBSW9FLE1BQUo7QUFBVzFFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUN1RSxRQUFNLENBQUNwRSxDQUFELEVBQUc7QUFBQ29FLFVBQU0sR0FBQ3BFLENBQVA7QUFBUzs7QUFBcEIsQ0FBL0IsRUFBcUQsQ0FBckQ7QUFhbGpCLE1BQU1xRSxNQUFNLEdBQUcsSUFBSThLLEtBQUssQ0FBQ0MsVUFBVixDQUFxQixRQUFyQixDQUFmO0FBRVAvSyxNQUFNLENBQUNtTCxPQUFQLENBQWU7QUFDYjhKLE9BQUssR0FBRztBQUNOLFdBQU9sVixNQUFNLENBQUNyRCxPQUFQLENBQWUsS0FBS3NaLE9BQXBCLENBQVA7QUFDRDs7QUFIWSxDQUFmO0FBTUFoVyxNQUFNLENBQUMrWSxvQkFBUCxHQUE4QnJGLE1BQU0sQ0FBQ3lOLFFBQVAsQ0FBZ0IsSUFBaEIsRUFBc0IsU0FBdEIsQ0FBOUI7QUFFQW5oQixNQUFNLENBQUMwRCxNQUFQLEdBQWdCLElBQUlqSSxZQUFKLENBQWlCO0FBQy9CO0FBQ0E7QUFDQW9DLE9BQUssRUFBRTtBQUNMK0MsUUFBSSxFQUFFbkYsWUFBWSxDQUFDcVEsT0FEZDtBQUVMSSxPQUFHLEVBQUUsQ0FGQTtBQUdMQyxPQUFHLEVBQUUsTUFIQSxDQUdPOztBQUhQLEdBSHdCO0FBUS9COVAsTUFBSSxFQUFFO0FBQ0p1RSxRQUFJLEVBQUVDLE1BREY7QUFFSnNMLE9BQUcsRUFBRTtBQUZELEdBUnlCO0FBWS9Cc0ssYUFBVyxFQUFFO0FBQ1g3VixRQUFJLEVBQUVDLE1BREs7QUFFWHNMLE9BQUcsRUFBRSxHQUZNLENBR1g7O0FBSFcsR0Faa0I7QUFpQi9CO0FBQ0E7QUFDQTRILGFBQVcsRUFBRTtBQUNYblQsUUFBSSxFQUFFYSxJQURLO0FBRVhYLFlBQVEsRUFBRTtBQUZDLEdBbkJrQjtBQXVCL0I0VixtQkFBaUIsRUFBRTtBQUNqQjlWLFFBQUksRUFBRW5GLFlBQVksQ0FBQ3FRLE9BREY7QUFFakI7QUFDQTtBQUNBSyxPQUFHLEVBQUUsS0FBSyxFQUFMLEdBQVUsRUFKRTtBQUtqQjtBQUNBO0FBQ0FELE9BQUcsRUFBRTtBQVBZO0FBdkJZLENBQWpCLENBQWhCO0FBa0NBbE0sTUFBTSxDQUFDMEQsTUFBUCxDQUFjNkksTUFBZCxDQUFxQmxNLGVBQXJCO0FBQ0FMLE1BQU0sQ0FBQzBELE1BQVAsQ0FBYzZJLE1BQWQsQ0FBcUJoTSxjQUFyQjtBQUNBUCxNQUFNLENBQUMwRCxNQUFQLENBQWM2SSxNQUFkLENBQXFCN0wsU0FBUyxDQUFDLFFBQUQsQ0FBOUI7QUFDQVYsTUFBTSxDQUFDMEQsTUFBUCxDQUFjNkksTUFBZCxDQUFxQjdMLFNBQVMsQ0FBQyxPQUFELENBQTlCO0FBQ0FWLE1BQU0sQ0FBQzBELE1BQVAsQ0FBYzZJLE1BQWQsQ0FBcUI5TCxZQUFZLENBQUMsY0FBRCxDQUFqQztBQUNBVCxNQUFNLENBQUN3TSxZQUFQLENBQW9CeE0sTUFBTSxDQUFDMEQsTUFBM0IsRTs7Ozs7Ozs7Ozs7QUM5REFySSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDOGxCLGlCQUFlLEVBQUMsTUFBSUEsZUFBckI7QUFBcUNDLGlCQUFlLEVBQUMsTUFBSUE7QUFBekQsQ0FBZDtBQUF5RixJQUFJL1IsZUFBSjtBQUFvQmpVLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUM4VCxpQkFBZSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxtQkFBZSxHQUFDM1QsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQTFDLEVBQWtGLENBQWxGO0FBQXFGLElBQUlGLFlBQUo7QUFBaUJKLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0YsZ0JBQVksR0FBQ0UsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJdUUsUUFBSjtBQUFhN0UsTUFBTSxDQUFDRyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQzBFLFVBQVEsQ0FBQ3ZFLENBQUQsRUFBRztBQUFDdUUsWUFBUSxHQUFDdkUsQ0FBVDtBQUFXOztBQUF4QixDQUFwQyxFQUE4RCxDQUE5RDtBQUFpRSxJQUFJd0ssV0FBSjtBQUFnQjlLLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUMySyxhQUFXLENBQUN4SyxDQUFELEVBQUc7QUFBQ3dLLGVBQVcsR0FBQ3hLLENBQVo7QUFBYzs7QUFBOUIsQ0FBOUMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSTZELE9BQUo7QUFBWW5FLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNnRSxTQUFPLENBQUM3RCxDQUFELEVBQUc7QUFBQzZELFdBQU8sR0FBQzdELENBQVI7QUFBVTs7QUFBdEIsQ0FBcEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSXNFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3lFLFlBQVUsQ0FBQ3RFLENBQUQsRUFBRztBQUFDc0UsY0FBVSxHQUFDdEUsQ0FBWDtBQUFhOztBQUE1QixDQUEzQixFQUF5RCxDQUF6RDtBQVFoaEIsTUFBTXlsQixlQUFlLEdBQUcsSUFBSTlSLGVBQUosQ0FBb0I7QUFDakRqVCxNQUFJLEVBQUUsMkJBRDJDO0FBR2pEa1QsVUFBUSxFQUFFLElBQUk5VCxZQUFKLENBQWlCO0FBQ3pCWSxRQUFJLEVBQUU7QUFDSnVFLFVBQUksRUFBRUMsTUFERjtBQUVKc0wsU0FBRyxFQUFFLEdBRkQ7QUFHSnJMLGNBQVEsRUFBRTtBQUhOLEtBRG1CO0FBTXpCdUgsYUFBUyxFQUFFO0FBQ1R6SCxVQUFJLEVBQUV3QyxLQURHO0FBRVQxQixXQUFLLEVBQUU7QUFGRSxLQU5jO0FBVXpCLG1CQUFlO0FBQ2JkLFVBQUksRUFBRUM7QUFETztBQVZVLEdBQWpCLEVBYVA0TyxTQWJPLEVBSHVDOztBQWtCakRDLEtBQUcsQ0FBQzVDLFNBQUQsRUFBWTtBQUNiLFFBQUksQ0FBQyxLQUFLeEwsTUFBVixFQUFrQjtBQUNoQixZQUFNLElBQUl2RCxLQUFKLENBQVUsY0FBVixDQUFOO0FBQ0QsS0FIWSxDQUtiOzs7QUFDQSxVQUFNdWpCLG1CQUFtQixHQUFHbmIsV0FBVyxDQUFDVixJQUFaLENBQWlCO0FBQzNDcEMsY0FBUSxFQUFFLElBRGlDO0FBRTNDN0IsZ0JBQVUsRUFBRTtBQUFFcU4sZUFBTyxFQUFFO0FBQVg7QUFGK0IsS0FBakIsRUFHekI3RixLQUh5QixFQUE1Qjs7QUFLQSxRQUFJc1ksbUJBQW1CLENBQUM1WSxNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNsQyxZQUFNNlksY0FBYyxHQUFHL2hCLE9BQU8sQ0FBQ2lHLElBQVIsQ0FBYTtBQUNsQzlJLFdBQUcsRUFBRTtBQUFFZ1MsYUFBRyxFQUFFN0IsU0FBUyxDQUFDekU7QUFBakI7QUFENkIsT0FBYixFQUVwQlcsS0FGb0IsRUFBdkI7QUFHQSxZQUFNd1ksa0JBQWtCLEdBQUdyYixXQUFXLENBQUNWLElBQVosQ0FBaUI7QUFDMUNnTyxZQUFJLEVBQUUsQ0FDSjtBQUNFOVcsYUFBRyxFQUFFO0FBQ0hnUyxlQUFHLEVBQUU0UyxjQUFjLENBQUNoWixHQUFmLENBQW1CVCxDQUFDLElBQUlBLENBQUMsQ0FBQ3BCLFlBQTFCO0FBREY7QUFEUCxTQURJLEVBTUo7QUFBRXJELGtCQUFRLEVBQUU7QUFBWixTQU5JO0FBRG9DLE9BQWpCLEVBU3hCMkYsS0FUd0IsRUFBM0I7O0FBV0EsVUFBSXNZLG1CQUFtQixDQUFDNVksTUFBcEIsS0FBK0I4WSxrQkFBa0IsQ0FBQzlZLE1BQXRELEVBQThEO0FBQzVELGNBQU0sSUFBSTNLLEtBQUosQ0FBVSw0QkFBVixDQUFOO0FBQ0Q7QUFDRjs7QUFFRGtDLGNBQVUsQ0FBQ2lJLE1BQVgsQ0FBa0I0RSxTQUFsQjtBQUNEOztBQWxEZ0QsQ0FBcEIsQ0FBeEI7QUFxREEsTUFBTXVVLGVBQWUsR0FBRyxJQUFJL1IsZUFBSixDQUFvQjtBQUNqRGpULE1BQUksRUFBRSwyQkFEMkM7QUFHakRrVCxVQUFRLEVBQUV0UCxVQUFVLENBQUN5RCxNQUFYLENBQ1BtRixJQURPLENBQ0YsTUFERSxFQUVQMEQsTUFGTyxDQUdOLElBQUk5USxZQUFKLENBQWlCO0FBQ2ZvVSxZQUFRLEVBQUU7QUFDUmpQLFVBQUksRUFBRWdCLE9BREU7QUFFUmQsY0FBUSxFQUFFO0FBRkY7QUFESyxHQUFqQixDQUhNLEVBVVB5TCxNQVZPLENBVUFyTSxRQVZBLEVBV1B1UCxTQVhPLEVBSHVDOztBQWdCakRDLEtBQUcsT0FBMEI7QUFBQSxRQUF6QjtBQUFFL1MsU0FBRjtBQUFPTixVQUFQO0FBQWF3VDtBQUFiLEtBQXlCOztBQUMzQixRQUFJLENBQUMsS0FBS3ZPLE1BQVYsRUFBa0I7QUFDaEIsWUFBTSxJQUFJdkQsS0FBSixDQUFVLGNBQVYsQ0FBTjtBQUNEOztBQUNELFVBQU0rTyxTQUFTLEdBQUc3TSxVQUFVLENBQUN2RCxPQUFYLENBQW1CQyxHQUFuQixDQUFsQjs7QUFDQSxRQUFJLENBQUNtUSxTQUFMLEVBQWdCO0FBQ2QsWUFBTSxJQUFJL08sS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVELFVBQU11SixJQUFJLEdBQUcsRUFBYjtBQUFBLFVBQ0VDLE1BQU0sR0FBRyxFQURYOztBQUVBLFFBQUlsTCxJQUFJLEtBQUtrRixTQUFiLEVBQXdCO0FBQ3RCK0YsVUFBSSxDQUFDakwsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBQ0QsUUFBSXdULFFBQVEsS0FBS3RPLFNBQWpCLEVBQTRCO0FBQzFCLFVBQUlzTyxRQUFKLEVBQWM7QUFDWixZQUFJL0MsU0FBUyxDQUFDdEwsVUFBZCxFQUEwQjtBQUN4QixnQkFBTSxJQUFJekQsS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEdUosWUFBSSxDQUFDOUYsVUFBTCxHQUFrQixJQUFJQyxJQUFKLEVBQWxCO0FBQ0E2RixZQUFJLENBQUNwRyxZQUFMLEdBQW9CLEtBQUtJLE1BQXpCO0FBQ0Q7O0FBQ0QsVUFBSSxDQUFDdU8sUUFBTCxFQUFlO0FBQ2IsWUFBSSxDQUFDL0MsU0FBUyxDQUFDdEwsVUFBZixFQUEyQjtBQUN6QixnQkFBTSxJQUFJekQsS0FBSixDQUFVLFdBQVYsQ0FBTjtBQUNEOztBQUVEd0osY0FBTSxDQUFDL0YsVUFBUCxHQUFvQixJQUFwQjtBQUNBK0YsY0FBTSxDQUFDckcsWUFBUCxHQUFzQixJQUF0QjtBQUNEO0FBQ0Y7O0FBRUQsVUFBTWtOLFFBQVEsR0FBRyxFQUFqQjs7QUFDQSxRQUFJalEsTUFBTSxDQUFDeVAsSUFBUCxDQUFZdEcsSUFBWixFQUFrQm9CLE1BQWxCLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDMEYsY0FBUSxDQUFDOUcsSUFBVCxHQUFnQkEsSUFBaEI7QUFDRDs7QUFDRCxRQUFJbkosTUFBTSxDQUFDeVAsSUFBUCxDQUFZckcsTUFBWixFQUFvQm1CLE1BQXBCLEdBQTZCLENBQWpDLEVBQW9DO0FBQ2xDMEYsY0FBUSxDQUFDN0csTUFBVCxHQUFrQkEsTUFBbEI7QUFDRDs7QUFDRCxRQUFJcEosTUFBTSxDQUFDeVAsSUFBUCxDQUFZUSxRQUFaLEVBQXNCMUYsTUFBdEIsS0FBaUMsQ0FBckMsRUFBd0M7QUFDdEM7QUFDRDs7QUFFRHpJLGNBQVUsQ0FBQ2dJLE1BQVgsQ0FBa0J0TCxHQUFsQixFQUF1QnlSLFFBQXZCO0FBQ0Q7O0FBN0RnRCxDQUFwQixDQUF4QixDOzs7Ozs7Ozs7OztBQzdEUC9TLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUMyRSxZQUFVLEVBQUMsTUFBSUE7QUFBaEIsQ0FBZDtBQUEyQyxJQUFJeEUsWUFBSjtBQUFpQkosTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDRixnQkFBWSxHQUFDRSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk2RCxPQUFKO0FBQVluRSxNQUFNLENBQUNHLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDZ0UsU0FBTyxDQUFDN0QsQ0FBRCxFQUFHO0FBQUM2RCxXQUFPLEdBQUM3RCxDQUFSO0FBQVU7O0FBQXRCLENBQXBDLEVBQTRELENBQTVEO0FBQStELElBQUl3SyxXQUFKO0FBQWdCOUssTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQzJLLGFBQVcsQ0FBQ3hLLENBQUQsRUFBRztBQUFDd0ssZUFBVyxHQUFDeEssQ0FBWjtBQUFjOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJMEUsZUFBSixFQUFvQkYsY0FBcEI7QUFBbUM5RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDNkUsaUJBQWUsQ0FBQzFFLENBQUQsRUFBRztBQUFDMEUsbUJBQWUsR0FBQzFFLENBQWhCO0FBQWtCLEdBQXRDOztBQUF1Q3dFLGdCQUFjLENBQUN4RSxDQUFELEVBQUc7QUFBQ3dFLGtCQUFjLEdBQUN4RSxDQUFmO0FBQWlCOztBQUExRSxDQUFqQyxFQUE2RyxDQUE3RztBQU0vVCxNQUFNc0UsVUFBVSxHQUFHLElBQUk2SyxLQUFLLENBQUNDLFVBQVYsQ0FBcUIsWUFBckIsQ0FBbkI7QUFFUDlLLFVBQVUsQ0FBQ2tMLE9BQVgsQ0FBbUI7QUFDakJzTCxhQUFXLEdBQUc7QUFDWixXQUFPLEtBQUtwYSxJQUFMLElBQWFtTSxDQUFDLENBQUNELEdBQUYsQ0FBTSxLQUFLdEIsT0FBTCxFQUFOLEVBQXNCbUQsQ0FBQyxJQUFJQSxDQUFDLENBQUM0RyxTQUFGLEVBQTNCLEVBQTBDYyxJQUExQyxDQUErQyxLQUEvQyxDQUFwQjtBQUNELEdBSGdCOztBQUtqQjNLLFFBQU0sQ0FBQzlLLElBQUQsRUFBTztBQUNYLFVBQU11RSxJQUFJLEdBQUd1RixXQUFXLENBQUN6SixPQUFaLENBQW9CO0FBQUVMO0FBQUYsS0FBcEIsQ0FBYjs7QUFDQSxRQUFJLENBQUN1RSxJQUFMLEVBQVc7QUFDVDtBQUNEOztBQUNELFdBQU8sS0FBS3FHLE9BQUwsR0FBZXhCLElBQWYsQ0FBb0IyRSxDQUFDLElBQUlBLENBQUMsQ0FBQzFELFlBQUYsS0FBbUI5RixJQUFJLENBQUNqRSxHQUFqRCxDQUFQO0FBQ0QsR0FYZ0I7O0FBYWpCc0ssU0FBTyxHQUFHO0FBQ1IsVUFBTWUsS0FBSyxHQUFHO0FBQUVyTCxTQUFHLEVBQUU7QUFBRWdTLFdBQUcsRUFBRSxLQUFLdEc7QUFBWjtBQUFQLEtBQWQ7QUFDQSxXQUFPN0ksT0FBTyxDQUFDaUcsSUFBUixDQUFhdUMsS0FBYixFQUFvQmdCLEtBQXBCLEVBQVA7QUFDRCxHQWhCZ0I7O0FBa0JqQjJNLGVBQWEsR0FBRztBQUNkLFVBQU0zSyxHQUFHLEdBQUcsRUFBWjtBQUNBLFNBQUsvRCxPQUFMLEdBQWUvSSxPQUFmLENBQXVCa00sQ0FBQyxJQUFJO0FBQzFCLFlBQU14SixJQUFJLEdBQUd1RixXQUFXLENBQUN6SixPQUFaLENBQW9CME4sQ0FBQyxDQUFDMUQsWUFBdEIsQ0FBYjtBQUNBc0UsU0FBRyxDQUFDcEssSUFBSSxDQUFDdkUsSUFBTixDQUFILEdBQWlCK04sQ0FBQyxDQUFDNUUsS0FBbkI7QUFDRCxLQUhEO0FBSUEsV0FBT3dGLEdBQVA7QUFDRDs7QUF6QmdCLENBQW5CO0FBNEJBL0ssVUFBVSxDQUFDeUQsTUFBWCxHQUFvQixJQUFJakksWUFBSixDQUFpQjtBQUNuQztBQUNBWSxNQUFJLEVBQUU7QUFDSnVFLFFBQUksRUFBRUMsTUFERjtBQUVKc0wsT0FBRyxFQUFFLEdBRkQ7QUFHSnJMLFlBQVEsRUFBRSxJQUhOOztBQUlKbUwsVUFBTSxHQUFHO0FBQ1AsVUFBSSxLQUFLNUssS0FBTCxJQUFjcEIsVUFBVSxDQUFDd0YsSUFBWCxDQUFnQjtBQUFFcEosWUFBSSxFQUFFLEtBQUttSjtBQUFiLE9BQWhCLEVBQXNDRSxLQUF0QyxLQUFnRCxDQUFsRSxFQUFxRTtBQUNuRSxlQUFPLFdBQVA7QUFDRDtBQUNGLEtBUkcsQ0FVSjs7O0FBVkksR0FGNkI7QUFlbkM7QUFDQTJDLFdBQVMsRUFBRTtBQUNUekgsUUFBSSxFQUFFd0MsS0FERztBQUVUZ0osWUFBUSxFQUFFakcsV0FBVyxDQUFDK0osYUFGYjtBQUdUeE8sU0FBSyxFQUFFLFNBSEU7QUFJVDdELFNBQUssRUFBRSxJQUpFO0FBS1RtSSxjQUFVLEVBQUUsSUFMSCxDQU1UO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQTdCUyxHQWhCd0I7QUFnRG5DLGlCQUFlO0FBQ2JwRixRQUFJLEVBQUVDLE1BRE87QUFFYkUsU0FBSyxFQUFFdEYsWUFBWSxDQUFDdUYsS0FBYixDQUFtQkMsRUFGYjtBQUdiUyxTQUFLO0FBSFE7QUFoRG9CLENBQWpCLENBQXBCO0FBdURBekIsVUFBVSxDQUFDeUQsTUFBWCxDQUFrQitkLGVBQWxCLENBQWtDLFVBQW1CO0FBQUEsTUFBbEI7QUFBRXBaO0FBQUYsR0FBa0I7O0FBQ25ELE1BQUksQ0FBQyxLQUFLdEcsUUFBVixFQUFvQjtBQUNsQixXQUFPLEVBQVA7QUFDRDs7QUFDRCxRQUFNaUcsS0FBSyxHQUFHO0FBQ1pLLGFBQVMsRUFBRTtBQUNUcVosV0FBSyxFQUFFclosU0FBUyxDQUFDSyxNQURSO0FBRVRpWixVQUFJLEVBQUV0WjtBQUZHO0FBREMsR0FBZDs7QUFNQSxNQUFJekcsT0FBTyxDQUFDM0IsVUFBVSxDQUFDdkQsT0FBWCxDQUFtQnNMLEtBQW5CLENBQUQsQ0FBWCxFQUF3QztBQUN0QyxXQUFPLENBQ0w7QUFDRTNMLFVBQUksRUFBRSxXQURSO0FBRUV1RSxVQUFJLEVBQUU7QUFGUixLQURLLENBQVA7QUFNRDs7QUFDRCxTQUFPLEVBQVA7QUFDRCxDQW5CRDtBQXFCQVgsVUFBVSxDQUFDeUQsTUFBWCxDQUFrQjZJLE1BQWxCLENBQXlCbE0sZUFBekI7QUFDQUosVUFBVSxDQUFDeUQsTUFBWCxDQUFrQjZJLE1BQWxCLENBQXlCcE0sY0FBekI7QUFDQUYsVUFBVSxDQUFDdU0sWUFBWCxDQUF3QnZNLFVBQVUsQ0FBQ3lELE1BQW5DLEU7Ozs7Ozs7Ozs7O0FDbEhBLElBQUl6RCxVQUFKO0FBQWU1RSxNQUFNLENBQUNHLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUN5RSxZQUFVLENBQUN0RSxDQUFELEVBQUc7QUFBQ3NFLGNBQVUsR0FBQ3RFLENBQVg7QUFBYTs7QUFBNUIsQ0FBNUIsRUFBMEQsQ0FBMUQ7QUFBNkQsSUFBSTZELE9BQUo7QUFBWW5FLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNnRSxTQUFPLENBQUM3RCxDQUFELEVBQUc7QUFBQzZELFdBQU8sR0FBQzdELENBQVI7QUFBVTs7QUFBdEIsQ0FBdkMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSXdLLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQWpELEVBQWlGLENBQWpGO0FBSTFLNEgsTUFBTSxDQUFDd00sT0FBUCxDQUFlLGtCQUFmLEVBQW1DLGdCQUF1QjtBQUFBLE1BQWQ7QUFBRUY7QUFBRixHQUFjOztBQUN4RCxNQUFJLENBQUMsS0FBS3ZPLE1BQVYsRUFBa0I7QUFDaEIsV0FBTyxJQUFQO0FBQ0Q7O0FBRUQsTUFBSXVPLFFBQVEsS0FBS3RPLFNBQWpCLEVBQTRCO0FBQzFCLFdBQU90QixVQUFVLENBQUN3RixJQUFYLEVBQVA7QUFDRDs7QUFFRCxTQUFPeEYsVUFBVSxDQUFDd0YsSUFBWCxDQUFnQjtBQUFFakUsY0FBVSxFQUFFO0FBQUVxTixhQUFPLEVBQUVqTixPQUFPLENBQUNpTyxRQUFEO0FBQWxCO0FBQWQsR0FBaEIsQ0FBUDtBQUNELENBVkQ7QUFZQXRNLE1BQU0sQ0FBQ3dNLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLFVBQVM5QyxXQUFULEVBQXNCO0FBQ2hELE1BQUksQ0FBQ0EsV0FBTCxFQUFrQjtBQUNoQixXQUFPLEVBQVA7QUFDRDs7QUFFRCxRQUFNSCxTQUFTLEdBQUc3TSxVQUFVLENBQUN2RCxPQUFYLENBQW1CdVEsV0FBbkIsQ0FBbEI7O0FBRUEsTUFBSSxDQUFDSCxTQUFMLEVBQWdCO0FBQ2QsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsU0FBTyxDQUNMN00sVUFBVSxDQUFDd0YsSUFBWCxDQUFnQndILFdBQWhCLENBREssRUFFTHpOLE9BQU8sQ0FBQ2lHLElBQVIsQ0FBYTtBQUNYOUksT0FBRyxFQUFFO0FBQ0hnUyxTQUFHLEVBQUU3QixTQUFTLENBQUN6RTtBQURaO0FBRE0sR0FBYixDQUZLLEVBT0xsQyxXQUFXLENBQUNWLElBQVosRUFQSyxDQUFQO0FBU0QsQ0FwQkQsRTs7Ozs7Ozs7Ozs7O0FDaEJBLE1BQUltYyxLQUFKO0FBQVVDLFNBQU8sQ0FBQ3JtQixJQUFSLENBQWEsT0FBYixFQUFxQjtBQUFDRSxXQUFPLENBQUNDLENBQUQsRUFBRztBQUFDaW1CLFdBQUssR0FBQ2ptQixDQUFOO0FBQVE7O0FBQXBCLEdBQXJCLEVBQTJDLENBQTNDOztBQUVWLFdBQVNtbUIsZ0JBQVQsQ0FBMEJDLFNBQTFCLEVBQXFDO0FBQ25DLFdBQU8sT0FBT0EsU0FBUCxLQUFxQixVQUFyQixJQUNMLENBQUMsQ0FBQ0EsU0FBUyxDQUFDQyxTQUFWLENBQW9CQyxnQkFEakIsR0FFSCxJQUZHLEdBR0gsS0FISjtBQUlEOztBQUVELFdBQVNDLG1CQUFULENBQTZCSCxTQUE3QixFQUF3QztBQUN0QyxXQUFPLE9BQU9BLFNBQVAsS0FBcUIsVUFBckIsSUFDTGxoQixNQUFNLENBQUNraEIsU0FBRCxDQUFOLENBQWtCMVgsUUFBbEIsQ0FBMkIsNEJBQTNCLENBREssR0FFSCxJQUZHLEdBR0gsS0FISjtBQUlEOztBQUVELFdBQVM0WCxnQkFBVCxDQUEwQkYsU0FBMUIsRUFBcUM7QUFDbkMsV0FBT0QsZ0JBQWdCLENBQUNDLFNBQUQsQ0FBaEIsSUFBK0JHLG1CQUFtQixDQUFDSCxTQUFELENBQWxELEdBQ0gsSUFERyxHQUVILEtBRko7QUFHRDs7QUFFRCxXQUFTSSxTQUFULENBQW1CQyxPQUFuQixFQUE0QjtBQUMxQixXQUFPUixLQUFLLENBQUNTLGNBQU4sQ0FBcUJELE9BQXJCLENBQVA7QUFDRDs7QUFFRCxXQUFTRSxnQkFBVCxDQUEwQkYsT0FBMUIsRUFBbUM7QUFDakMsV0FBT0QsU0FBUyxDQUFDQyxPQUFELENBQVQsSUFBc0IsT0FBT0EsT0FBTyxDQUFDeGhCLElBQWYsS0FBd0IsUUFBckQ7QUFDRDs7QUFFRCxXQUFTMmhCLHNCQUFULENBQWdDSCxPQUFoQyxFQUF5QztBQUN2QyxXQUFPRCxTQUFTLENBQUNDLE9BQUQsQ0FBVCxJQUFzQixPQUFPQSxPQUFPLENBQUN4aEIsSUFBZixLQUF3QixVQUFyRDtBQUNEOztBQUVEdkYsUUFBTSxDQUFDbW5CLE9BQVAsR0FBaUI7QUFDZlYsb0JBRGU7QUFFZkksdUJBRmU7QUFHZkQsb0JBSGU7QUFJZkUsYUFKZTtBQUtmRyxvQkFMZTtBQU1mQztBQU5lLEdBQWpCOzs7Ozs7Ozs7Ozs7QUNsQ0FsbkIsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ3NQLFNBQU8sRUFBQyxNQUFJQTtBQUFiLENBQWQ7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBSTZYLE1BQUo7O0FBQ0EsSUFBSWxmLE1BQU0sQ0FBQzRQLFFBQVgsRUFBcUI7QUFDbkIsUUFBTXVQLEdBQUcsR0FBRyxJQUFJNVgsS0FBSyxDQUFDQyxVQUFWLENBQXFCLFVBQXJCLEVBQWlDeEcsYUFBakMsRUFBWjtBQUNBb2UsZUFBYSxHQUFHcGYsTUFBTSxDQUFDaVUsU0FBUCxDQUFpQmtMLEdBQUcsQ0FBQ0MsYUFBckIsRUFBb0NELEdBQXBDLENBQWhCOztBQUVBRCxRQUFNLEdBQUdHLEVBQUUsSUFBSSxVQUFDdm1CLElBQUQsRUFBc0I7QUFBQSxRQUFmd21CLE1BQWUsdUVBQU4sQ0FBTTtBQUNuQyxVQUFNcGUsR0FBRyxHQUFHa2UsYUFBYSxDQUN2QjtBQUFFaG1CLFNBQUcsRUFBRU47QUFBUCxLQUR1QixFQUNSO0FBQ2YsUUFGdUIsRUFFakI7QUFDTjtBQUFFLGtCQUFLdW1CLEVBQUwsSUFBWTtBQUFFcGQsYUFBSyxFQUFFcWQ7QUFBVDtBQUFkLEtBSHVCLEVBR1k7QUFDbkM7QUFBRUMsU0FBRyxFQUFFLElBQVA7QUFBYTFLLFlBQU0sRUFBRTtBQUFyQixLQUp1QixDQUlLO0FBSkwsS0FBekI7QUFNQSxXQUFPM1QsR0FBRyxDQUFDZSxLQUFKLElBQWFmLEdBQUcsQ0FBQ2UsS0FBSixDQUFVQSxLQUE5QjtBQUNELEdBUkQ7QUFTRCxDQWJELE1BYU87QUFDTGlkLFFBQU0sR0FBR0csRUFBRSxJQUFJLE1BQU0sQ0FBRSxDQUF2QjtBQUNEOztBQUVNLE1BQU1oWSxPQUFPLEdBQUc7QUFDckJNLEtBQUcsRUFBRXVYLE1BQU0sQ0FBQyxLQUFELENBRFU7QUFFckJyTSxLQUFHLEVBQUVxTSxNQUFNLENBQUMsS0FBRDtBQUZVLENBQWhCLEM7Ozs7Ozs7Ozs7O0FDM0JQLElBQUlNLE9BQUo7QUFBWTFuQixNQUFNLENBQUNHLElBQVAsQ0FBWSxVQUFaLEVBQXVCO0FBQUMsTUFBSUcsQ0FBSixFQUFNO0FBQUNvbkIsV0FBTyxHQUFDcG5CLENBQVI7QUFBVTs7QUFBbEIsQ0FBdkIsRUFBMkMsQ0FBM0M7QUFHWixNQUFNbUIsR0FBRyxHQUFHaW1CLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQixNQUFsQixDQUFaLEMsQ0FFQTs7QUFDQWxtQixHQUFHLENBQUNtbUIsZUFBSixDQUFvQjFmLE1BQU0sQ0FBQzRGLGFBQVAsR0FBdUIsTUFBdkIsR0FBZ0MsTUFBcEQsRSxDQUVBO0FBQ0E7O0FBQ0EsSUFBSTVGLE1BQU0sQ0FBQzZGLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQXVCNlosUUFBM0IsRUFBcUM7QUFDbkNwbUIsS0FBRyxDQUFDcW1CLFFBQUosQ0FBYTVmLE1BQU0sQ0FBQzZGLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQXVCNlosUUFBcEM7QUFDRDs7QUFaRDduQixNQUFNLENBQUM4RCxhQUFQLENBY2VyQyxHQWRmLEU7Ozs7Ozs7Ozs7O0FDQUF6QixNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDa2pCLE9BQUssRUFBQyxNQUFJQSxLQUFYO0FBQWlCdEksZ0JBQWMsRUFBQyxNQUFJQSxjQUFwQztBQUFtRGtOLG1CQUFpQixFQUFDLE1BQUlBLGlCQUF6RTtBQUEyRm5uQix1QkFBcUIsRUFBQyxNQUFJQSxxQkFBckg7QUFBMkkyViwrQkFBNkIsRUFBQyxNQUFJQTtBQUE3SyxDQUFkO0FBQTJOLElBQUlrUSxnQkFBSixFQUFxQkksbUJBQXJCLEVBQXlDRCxnQkFBekMsRUFBMERFLFNBQTFEO0FBQW9FOW1CLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNzbUIsa0JBQWdCLENBQUNubUIsQ0FBRCxFQUFHO0FBQUNtbUIsb0JBQWdCLEdBQUNubUIsQ0FBakI7QUFBbUIsR0FBeEM7O0FBQXlDdW1CLHFCQUFtQixDQUFDdm1CLENBQUQsRUFBRztBQUFDdW1CLHVCQUFtQixHQUFDdm1CLENBQXBCO0FBQXNCLEdBQXRGOztBQUF1RnNtQixrQkFBZ0IsQ0FBQ3RtQixDQUFELEVBQUc7QUFBQ3NtQixvQkFBZ0IsR0FBQ3RtQixDQUFqQjtBQUFtQixHQUE5SDs7QUFBK0h3bUIsV0FBUyxDQUFDeG1CLENBQUQsRUFBRztBQUFDd21CLGFBQVMsR0FBQ3htQixDQUFWO0FBQVk7O0FBQXhKLENBQWpDLEVBQTJMLENBQTNMOztBQU94UixNQUFNNmlCLEtBQUssR0FBRzZFLEVBQUUsSUFBSTtBQUN6QixTQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFTQyxPQUFULEVBQWtCL2EsQ0FBbEIsRUFBcUI7QUFDdEMvRSxjQUFVLENBQUMsTUFBTTtBQUNmOGYsYUFBTztBQUNSLEtBRlMsRUFFUEYsRUFGTyxDQUFWO0FBR0QsR0FKTSxDQUFQO0FBS0QsQ0FOTTs7QUFRQSxNQUFNbk4sY0FBYyxHQUFHc04sTUFBTSxJQUFJO0FBQ3RDLFFBQU1DLE9BQU8sR0FBRyxFQUFoQjs7QUFFQSxPQUFLLElBQUlqSyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZ0ssTUFBTSxDQUFDOWEsTUFBM0IsRUFBbUM4USxDQUFDLElBQUksQ0FBeEMsRUFBMkM7QUFDekMsUUFDRSxDQUFDZ0ssTUFBTSxDQUFDaEssQ0FBRCxDQUFQLElBQ0EsQ0FBQ2dLLE1BQU0sQ0FBQ2hLLENBQUQsQ0FBTixDQUFVM1YsY0FBVixDQUF5QixPQUF6QixDQURELElBRUEsQ0FBQzJmLE1BQU0sQ0FBQ2hLLENBQUQsQ0FBTixDQUFVM1YsY0FBVixDQUF5QixRQUF6QixDQUhILEVBSUU7QUFDQSxZQUFNLHdFQUFOO0FBQ0Q7O0FBQ0QsU0FBSyxJQUFJNmYsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsTUFBTSxDQUFDaEssQ0FBRCxDQUFOLENBQVVHLE1BQTlCLEVBQXNDK0osQ0FBQyxJQUFJLENBQTNDLEVBQThDO0FBQzVDRCxhQUFPLENBQUN4YSxJQUFSLENBQWF1YSxNQUFNLENBQUNoSyxDQUFELENBQU4sQ0FBVWhVLEtBQXZCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLE1BQU1pZSxPQUFPLENBQUNFLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBZ0JKLE9BQU8sQ0FBQy9hLE1BQW5DLENBQUQsQ0FBcEI7QUFDRCxDQWpCTTs7QUFtQkEsTUFBTTBhLGlCQUFpQixHQUFHVSxVQUFVLElBQUk7QUFDN0MsTUFBSXpTLE9BQU8sR0FBRyxJQUFkOztBQUVBLE1BQUl5UyxVQUFVLElBQUl0YixDQUFDLENBQUN1YixPQUFGLENBQVVELFVBQVYsQ0FBbEIsRUFBeUM7QUFDdkMsU0FBSyxJQUFJdEssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3NLLFVBQVUsQ0FBQ3BiLE1BQS9CLEVBQXVDOFEsQ0FBQyxFQUF4QyxFQUE0QztBQUMxQyxVQUNFLENBQUNzSSxnQkFBZ0IsQ0FBQ2dDLFVBQVUsQ0FBQ3RLLENBQUQsQ0FBWCxDQUFqQixJQUNBLENBQUMwSSxtQkFBbUIsQ0FBQzRCLFVBQVUsQ0FBQ3RLLENBQUQsQ0FBWCxDQURwQixJQUVBLENBQUN5SSxnQkFBZ0IsQ0FBQzZCLFVBQVUsQ0FBQ3RLLENBQUQsQ0FBWCxDQUZqQixJQUdBLENBQUMySSxTQUFTLENBQUMyQixVQUFVLENBQUN0SyxDQUFELENBQVgsQ0FKWixFQUtFO0FBQ0EzYyxlQUFPLENBQUNJLEtBQVIsQ0FBYyxxQ0FBZCxFQUFxRDZtQixVQUFVLENBQUN0SyxDQUFELENBQS9EO0FBQ0FuSSxlQUFPLEdBQUcsS0FBVjtBQUNBO0FBQ0Q7QUFDRjtBQUNGLEdBYkQsTUFhTztBQUNMeFUsV0FBTyxDQUFDSSxLQUFSLENBQWMsMEJBQWQ7QUFDQW9VLFdBQU8sR0FBRyxLQUFWO0FBQ0Q7O0FBRUQsU0FBT0EsT0FBUDtBQUNELENBdEJNOztBQXdCUCxJQUFJMlMsY0FBYyxHQUFHLGtDQUFyQjtBQUNBLElBQUlDLGNBQWMsR0FBRyx1QkFBckI7O0FBRU8sTUFBTWhvQixxQkFBcUIsR0FBR0ssSUFBSSxJQUFJO0FBQzNDLE1BQUk0bkIsS0FBSyxHQUFHNW5CLElBQUksQ0FBQzZuQixRQUFMLEdBQWdCQyxPQUFoQixDQUF3QkosY0FBeEIsRUFBd0MsRUFBeEMsQ0FBWjtBQUNBRSxPQUFLLEdBQUdBLEtBQUssQ0FBQ3RtQixLQUFOLENBQVksSUFBWixFQUFrQixDQUFsQixDQUFSO0FBQ0EsUUFBTXltQixRQUFRLEdBQUdILEtBQUssQ0FBQ3pTLEtBQU4sQ0FBWXlTLEtBQUssQ0FBQzNLLE9BQU4sQ0FBYyxHQUFkLElBQXFCLENBQWpDLEVBQW9DMkssS0FBSyxDQUFDM0ssT0FBTixDQUFjLEdBQWQsQ0FBcEMsQ0FBakI7QUFDQSxRQUFNK0ssTUFBTSxHQUFHRCxRQUFRLENBQUNFLEtBQVQsQ0FBZU4sY0FBZixDQUFmOztBQUVBLE1BQUlLLE1BQU0sS0FBSyxJQUFmLEVBQXFCO0FBQ25CLFdBQU8sRUFBUDtBQUNELEdBRkQsTUFFTztBQUNMLFFBQUlFLFFBQVEsR0FBRyxFQUFmOztBQUNBLFNBQUssSUFBSWhMLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUc4SyxNQUFNLENBQUM1YixNQUEzQixFQUFtQzhRLENBQUMsRUFBcEMsRUFBd0M7QUFDdENnTCxjQUFRLENBQUN2YixJQUFULENBQWNxYixNQUFNLENBQUM5SyxDQUFELENBQU4sQ0FBVTRLLE9BQVYsQ0FBa0IsUUFBbEIsRUFBNEIsRUFBNUIsQ0FBZDtBQUNEOztBQUNELFdBQU9JLFFBQVA7QUFDRDtBQUNGLENBZk07O0FBaUJBLE1BQU01Uyw2QkFBNkIsR0FBRzNVLEtBQUssSUFBSTtBQUNwRCxVQUFRQSxLQUFLLENBQUMyRCxJQUFkO0FBQ0UsU0FBSyxXQUFMO0FBQ0EsU0FBSyxXQUFMO0FBQ0UsNERBQStDM0QsS0FBSyxDQUFDa1AsR0FBckQsY0FDRWxQLEtBQUssQ0FBQzJELElBQU4sS0FBZSxXQUFmLEdBQTZCLGNBQTdCLEdBQThDLEVBRGhEOztBQUlGLFNBQUssV0FBTDtBQUNBLFNBQUssV0FBTDtBQUNFLCtEQUFrRDNELEtBQUssQ0FBQ2lQLEdBQXhELGNBQ0VqUCxLQUFLLENBQUMyRCxJQUFOLEtBQWUsV0FBZixHQUE2QixjQUE3QixHQUE4QyxFQURoRDs7QUFJRixTQUFLLGNBQUw7QUFDRSx1QkFBVTNELEtBQUssQ0FBQ1osSUFBaEI7O0FBRUY7QUFDRSxhQUFPLGVBQVA7QUFqQko7QUFtQkQsQ0FwQk0sQzs7Ozs7Ozs7Ozs7QUM5RVBoQixNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWixFOzs7Ozs7Ozs7OztBQ0FBaXBCLFFBQVEsQ0FBQ2xwQixNQUFULENBQWdCO0FBQ2RtcEIsdUJBQXFCLEVBQUUsS0FEVDtBQUVkQyw2QkFBMkIsRUFBRSxJQUZmO0FBR2RDLHdCQUFzQixFQUFFO0FBSFYsQ0FBaEIsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJQyxNQUFKO0FBQVd4cEIsTUFBTSxDQUFDRyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDa3BCLFVBQU0sR0FBQ2xwQixDQUFQO0FBQVM7O0FBQXJCLENBQXJCLEVBQTRDLENBQTVDO0FBQStDLElBQUltcEIsU0FBSjtBQUFjenBCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ21wQixhQUFTLEdBQUNucEIsQ0FBVjtBQUFZOztBQUF4QixDQUEzQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJb3BCLFNBQUo7QUFBYzFwQixNQUFNLENBQUNHLElBQVAsQ0FBWSxXQUFaLEVBQXdCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNvcEIsYUFBUyxHQUFDcHBCLENBQVY7QUFBWTs7QUFBeEIsQ0FBeEIsRUFBa0QsQ0FBbEQ7QUFPOUlxcEIsTUFBTSxDQUFDQyxlQUFQLENBQXVCQyxHQUF2QixDQUEyQixVQUEzQixFQUF1QyxDQUFDQyxHQUFELEVBQU0xZ0IsR0FBTixLQUFjO0FBQ25ELFFBQU0sQ0FBQzdELElBQUQsRUFBT3lNLEVBQVAsSUFBYThYLEdBQUcsQ0FBQ0MsR0FBSixDQUFRM1QsS0FBUixDQUFjLENBQWQsRUFBaUI3VCxLQUFqQixDQUF1QixHQUF2QixDQUFuQjtBQUVBLFFBQU15bkIsSUFBSSxHQUFHUixNQUFNLENBQ2hCUyxVQURVLENBQ0MsTUFERCxFQUVWcmQsTUFGVSxDQUVIb0YsRUFGRyxFQUdWa1ksTUFIVSxDQUdILEtBSEcsQ0FBYjtBQUtBLE1BQUlDLEdBQUo7O0FBQ0EsVUFBUTVrQixJQUFSO0FBQ0UsU0FBSyxXQUFMO0FBQ0U0a0IsU0FBRyxHQUFHLElBQUlWLFNBQUosQ0FBY08sSUFBZCxFQUFvQjtBQUFFSSxZQUFJLEVBQUUsR0FBUjtBQUFhQyxjQUFNLEVBQUU7QUFBckIsT0FBcEIsRUFBa0R2QixRQUFsRCxDQUEyRCxJQUEzRCxDQUFOO0FBQ0E7O0FBQ0YsU0FBSyxXQUFMO0FBQ0VxQixTQUFHLEdBQUdULFNBQVMsQ0FBQ1ksS0FBVixDQUFnQk4sSUFBaEIsRUFBc0IsR0FBdEIsQ0FBTjtBQUNBOztBQUNGO0FBQ0U1Z0IsU0FBRyxDQUFDbWhCLFNBQUosQ0FBYyxHQUFkLEVBQW1CLEVBQW5CO0FBQ0FuaEIsU0FBRyxDQUFDaVosR0FBSjtBQUNBO0FBVko7O0FBYUFqWixLQUFHLENBQUNtaEIsU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFBRSxvQkFBZ0I7QUFBbEIsR0FBbkI7QUFDQW5oQixLQUFHLENBQUNpWixHQUFKLENBQVE4SCxHQUFSO0FBQ0QsQ0F4QkQsRTs7Ozs7Ozs7Ozs7QUNQQW5xQixNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDc1Ysb0JBQWtCLEVBQUMsTUFBSUEsa0JBQXhCO0FBQTJDeEssV0FBUyxFQUFDLE1BQUlBO0FBQXpELENBQWQ7QUFBbUYsSUFBSXRKLEdBQUo7QUFBUXpCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNtQixPQUFHLEdBQUNuQixDQUFKO0FBQU07O0FBQWxCLENBQS9CLEVBQW1ELENBQW5EO0FBRTNGLE1BQU1rcUIsTUFBTSxHQUFHLEVBQWY7QUFFQSxNQUFNQyxjQUFjLEdBQUd2aUIsTUFBTSxDQUFDNkYsUUFBUCxDQUFnQnljLE1BQXZDOztBQUNBLElBQUlDLGNBQUosRUFBb0I7QUFDbEIsTUFBSSxDQUFDdGQsQ0FBQyxDQUFDdWIsT0FBRixDQUFVK0IsY0FBVixDQUFMLEVBQWdDO0FBQzlCaHBCLE9BQUcsQ0FBQ0csS0FBSixDQUFVLDBDQUFWO0FBQ0QsR0FGRCxNQUVPO0FBQ0w2b0Isa0JBQWMsQ0FBQzVuQixPQUFmLENBQXVCLFVBQTRCO0FBQUEsVUFBM0I7QUFBRTZuQixnQkFBRjtBQUFZQztBQUFaLE9BQTJCOztBQUNqRCxVQUFJLENBQUNELFFBQUQsSUFBYSxDQUFDQyxRQUFsQixFQUE0QjtBQUMxQmxwQixXQUFHLENBQUNHLEtBQUosQ0FBVSxzREFBVjtBQUNELE9BRkQsTUFFTztBQUNMNG9CLGNBQU0sQ0FBQzVjLElBQVAsQ0FBWTtBQUFFOGMsa0JBQUY7QUFBWUM7QUFBWixTQUFaO0FBQ0Q7QUFDRixLQU5EO0FBT0Q7QUFDRjs7QUFFRCxJQUFJSCxNQUFNLENBQUNuZCxNQUFQLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLFFBQU11ZCxZQUFZLEdBQ2hCdEMsSUFBSSxDQUFDRSxNQUFMLEdBQ0dNLFFBREgsQ0FDWSxFQURaLEVBRUcxUyxLQUZILENBRVMsQ0FGVCxJQUdBa1MsSUFBSSxDQUFDRSxNQUFMLEdBQ0dNLFFBREgsQ0FDWSxFQURaLEVBRUcxUyxLQUZILENBRVMsQ0FGVCxDQUpGO0FBUUFvVSxRQUFNLENBQUM1YyxJQUFQLENBQVk7QUFDVjhjLFlBQVEsRUFBRSxPQURBO0FBRVZDLFlBQVEsRUFBRUM7QUFGQSxHQUFaO0FBS0FucEIsS0FBRyxDQUFDa0gsSUFBSixtVUFNY2lpQixZQU5kO0FBU0Q7O0FBRU0sTUFBTXJWLGtCQUFrQixHQUFHLEVBQTNCOztBQUNBLE1BQU14SyxTQUFTLEdBQUcsTUFBTTtBQUM3QndLLG9CQUFrQixDQUFDMVMsT0FBbkIsQ0FBMkI0SixDQUFDLElBQUlBLENBQUMsRUFBakM7QUFDQWhMLEtBQUcsQ0FBQ1gsS0FBSixDQUFVLGVBQVY7QUFDRCxDQUhNOztBQUtQb0gsTUFBTSxDQUFDQyxPQUFQLENBQWUsTUFBTTtBQUNuQjRDLFdBQVM7QUFDVixDQUZEO0FBSUF3SyxrQkFBa0IsQ0FBQzNILElBQW5CLENBQXdCLE1BQU07QUFDNUI0YyxRQUFNLENBQUMzbkIsT0FBUCxDQUFlZ29CLEtBQUssSUFBSTtBQUN0QixVQUFNbmUsTUFBTSxHQUFHeEUsTUFBTSxDQUFDNGlCLEtBQVAsQ0FBYXpwQixPQUFiLENBQXFCOEwsQ0FBQyxDQUFDZ0gsSUFBRixDQUFPMFcsS0FBUCxFQUFjLFVBQWQsQ0FBckIsQ0FBZjs7QUFDQSxRQUFJLENBQUNuZSxNQUFMLEVBQWE7QUFDWDBjLGNBQVEsQ0FBQzJCLFVBQVQsQ0FBb0JGLEtBQXBCO0FBQ0QsS0FGRCxNQUVPO0FBQ0x6QixjQUFRLENBQUM0QixXQUFULENBQXFCdGUsTUFBTSxDQUFDcEwsR0FBNUIsRUFBaUN1cEIsS0FBSyxDQUFDRixRQUF2QyxFQUFpRDtBQUFFTSxjQUFNLEVBQUU7QUFBVixPQUFqRDtBQUNEO0FBQ0YsR0FQRDtBQVFELENBVEQsRTs7Ozs7Ozs7Ozs7QUN0REEsSUFBSXJnQixhQUFKOztBQUFrQjVLLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHNDQUFaLEVBQW1EO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNzSyxpQkFBYSxHQUFDdEssQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBbkQsRUFBaUYsQ0FBakY7QUFBbEJOLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNpckIsYUFBVyxFQUFDLE1BQUlBLFdBQWpCO0FBQTZCM3FCLGlCQUFlLEVBQUMsTUFBSUEsZUFBakQ7QUFBaUVra0IsY0FBWSxFQUFDLE1BQUlBLFlBQWxGO0FBQStGMEcsZ0JBQWMsRUFBQyxNQUFJQTtBQUFsSCxDQUFkO0FBQWlKLElBQUkvbUIsV0FBSjtBQUFnQnBFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHdDQUFaLEVBQXFEO0FBQUNpRSxhQUFXLENBQUM5RCxDQUFELEVBQUc7QUFBQzhELGVBQVcsR0FBQzlELENBQVo7QUFBYzs7QUFBOUIsQ0FBckQsRUFBcUYsQ0FBckY7QUFBd0YsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBM0MsRUFBbUUsQ0FBbkU7QUFHOVAsTUFBTTRxQixXQUFXLEdBQUcsRUFBcEI7O0FBRVAsTUFBTUUsYUFBYSxHQUFHLFVBQUN4WSxRQUFELEVBQWlDO0FBQUEsTUFBdEJ0USxHQUFzQix1RUFBaEIsV0FBZ0I7QUFDckQsUUFBTXFLLEtBQUssR0FBRztBQUNaM0ssVUFBTSxFQUFFLFNBREk7QUFFWkYsVUFBTSxFQUFFO0FBQUUwUixhQUFPLEVBQUU7QUFBWCxLQUZJO0FBR1ptRCxjQUFVLEVBQUU7QUFBRW5ELGFBQU8sRUFBRTtBQUFYLEtBSEE7QUFJWixLQUFDbFIsR0FBRCxHQUFPc1E7QUFKSyxHQUFkO0FBT0EsU0FBT3hPLFdBQVcsQ0FBQy9DLE9BQVosQ0FBb0JzTCxLQUFwQixDQUFQO0FBQ0QsQ0FURDs7QUFXTyxNQUFNcE0sZUFBZSxHQUFHd1gsSUFBSSxJQUFJO0FBQ3JDLFNBQU9tVCxXQUFXLENBQUNuVCxJQUFJLENBQUMvRixFQUFOLENBQWxCO0FBQ0QsQ0FGTTs7QUFJQSxNQUFNeVMsWUFBWSxHQUFHLENBQUMxTSxJQUFELEVBQU9uRixRQUFQLEtBQW9CO0FBQzlDc1ksYUFBVyxDQUFDblQsSUFBSSxDQUFDL0YsRUFBTixDQUFYLEdBQXVCWSxRQUF2QjtBQUVBLFFBQU15WSxHQUFHLEdBQUduakIsTUFBTSxDQUFDNkYsUUFBUCxDQUFnQnVkLFVBQWhCLEdBQ1I7QUFBRUMsTUFBRSxFQUFFeFQsSUFBSSxDQUFDeVQsYUFBWDtBQUEwQkMsYUFBUyxFQUFFMVQsSUFBSSxDQUFDMlQsV0FBTCxDQUFpQixZQUFqQjtBQUFyQyxHQURRLEdBRVIsRUFGSjtBQUlBam5CLFNBQU8sQ0FBQ21JLE1BQVIsQ0FBZWdHLFFBQWYsRUFBeUI7QUFDdkIzRyxRQUFJLEVBQUU7QUFDSnNZLFlBQU0sRUFBRSxJQURKO0FBRUpDLGVBQVM7QUFDUG1ILFVBQUUsRUFBRSxJQUFJdmxCLElBQUo7QUFERyxTQUVKaWxCLEdBRkk7QUFGTDtBQURpQixHQUF6QjtBQVVBLFFBQU1uUyxNQUFNLEdBQUd6VSxPQUFPLENBQUNwRCxPQUFSLENBQWdCdVIsUUFBaEIsQ0FBZjs7QUFDQSxNQUFJLENBQUNzRyxNQUFNLENBQUN4RyxPQUFaLEVBQXFCO0FBQ25CO0FBQ0Q7O0FBRUQsUUFBTThGLEtBQUssR0FBRzRTLGFBQWEsQ0FBQ3hZLFFBQUQsRUFBVyxpQkFBWCxDQUEzQjs7QUFDQSxNQUFJLENBQUM0RixLQUFMLEVBQVk7QUFDVjtBQUNEOztBQUVEcFUsYUFBVyxDQUFDd0ksTUFBWixDQUFtQjRMLEtBQUssQ0FBQ2xYLEdBQXpCLEVBQThCO0FBQzVCaWQsYUFBUyxFQUFFO0FBQUUvTCxlQUFTLEVBQUVJO0FBQWI7QUFEaUIsR0FBOUI7QUFHRCxDQTlCTTs7QUFnQ0EsTUFBTXVZLGNBQWMsR0FBR3BULElBQUksSUFBSTtBQUNwQyxNQUFJLENBQUNtVCxXQUFXLENBQUNuVCxJQUFJLENBQUMvRixFQUFOLENBQWhCLEVBQTJCO0FBQ3pCO0FBQ0Q7O0FBRUQsUUFBTVksUUFBUSxHQUFHc1ksV0FBVyxDQUFDblQsSUFBSSxDQUFDL0YsRUFBTixDQUE1QjtBQUVBdk4sU0FBTyxDQUFDbUksTUFBUixDQUFlZ0csUUFBZixFQUF5QjtBQUN2QjNHLFFBQUksRUFBRTtBQUFFc1ksWUFBTSxFQUFFO0FBQVYsS0FEaUI7QUFFdkJyWSxVQUFNLEVBQUU7QUFDTmlZLFVBQUksRUFBRTtBQURBO0FBRmUsR0FBekI7QUFPQSxRQUFNM0wsS0FBSyxHQUFHNFMsYUFBYSxDQUFDeFksUUFBRCxDQUEzQjs7QUFFQSxNQUFJLENBQUM0RixLQUFMLEVBQVk7QUFDVjtBQUNEOztBQUVEcFUsYUFBVyxDQUFDd0ksTUFBWixDQUFtQjRMLEtBQUssQ0FBQ2xYLEdBQXpCLEVBQThCO0FBQzVCK1gsU0FBSyxFQUFFO0FBQUU3RyxlQUFTLEVBQUVJO0FBQWI7QUFEcUIsR0FBOUI7QUFJQSxTQUFPc1ksV0FBVyxDQUFDblQsSUFBSSxDQUFDL0YsRUFBTixDQUFsQjtBQUNELENBekJNOztBQTJCUDlKLE1BQU0sQ0FBQzBqQixZQUFQLENBQW9CN1QsSUFBSSxJQUFJO0FBQzFCQSxNQUFJLENBQUM4VCxPQUFMLENBQWEsTUFBTTtBQUNqQlYsa0JBQWMsQ0FBQ3BULElBQUQsQ0FBZDtBQUNELEdBRkQ7QUFHRCxDQUpELEU7Ozs7Ozs7Ozs7O0FDL0VBLElBQUkzWCxZQUFKO0FBQWlCSixNQUFNLENBQUNHLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNGLGdCQUFZLEdBQUNFLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXdyQixNQUFKO0FBQVc5ckIsTUFBTSxDQUFDRyxJQUFQLENBQVksYUFBWixFQUEwQjtBQUFDRSxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDd3JCLFVBQU0sR0FBQ3hyQixDQUFQO0FBQVM7O0FBQXJCLENBQTFCLEVBQWlELENBQWpEO0FBR3ZGLE1BQU15ckIsS0FBSyxHQUFHLEVBQWQ7QUFFQSxNQUFNelQsSUFBSSxHQUFHO0FBQ1hNLEtBQUcsQ0FBQzlQLE9BQUQsRUFBVTtBQUNYLFFBQUkxSSxZQUFKLENBQWlCO0FBQ2ZZLFVBQUksRUFBRTtBQUFFdUUsWUFBSSxFQUFFQztBQUFSLE9BRFM7QUFFZjhULGNBQVEsRUFBRTtBQUFFL1QsWUFBSSxFQUFFbkYsWUFBWSxDQUFDcVE7QUFBckIsT0FGSztBQUUyQjtBQUMxQzhJLFVBQUksRUFBRTtBQUFFaFUsWUFBSSxFQUFFeW1CO0FBQVI7QUFIUyxLQUFqQixFQUlHOVgsUUFKSCxDQUlZcEwsT0FKWjs7QUFNQSxRQUFJaWpCLEtBQUssQ0FBQ2pqQixPQUFPLENBQUM5SCxJQUFULENBQVQsRUFBeUI7QUFDdkIsMENBQTZCOEgsT0FBTyxDQUFDOUgsSUFBckM7QUFDRDs7QUFFRCtxQixTQUFLLENBQUNqakIsT0FBTyxDQUFDOUgsSUFBVCxDQUFMLEdBQXNCOEgsT0FBdEI7QUFDRDs7QUFiVSxDQUFiO0FBZ0JBLE1BQU1takIsT0FBTyxHQUFJL2pCLE1BQU0sQ0FBQ2drQixJQUFQLElBQWVoa0IsTUFBTSxDQUFDZ2tCLElBQVAsQ0FBWXpxQixHQUE1QixJQUFvQyxLQUFwRDs7QUFDQSxNQUFNMHFCLE9BQU8sR0FBR0MsR0FBRyxJQUFJSCxPQUFPLElBQUl6cUIsT0FBTyxDQUFDbVIsSUFBUixDQUFheVosR0FBYixDQUFsQzs7QUFDQSxNQUFNQyxVQUFVLEdBQUdELEdBQUcsSUFBSUgsT0FBTyxJQUFJenFCLE9BQU8sQ0FBQ0ksS0FBUixDQUFjd3FCLEdBQWQsQ0FBckM7O0FBRUFsa0IsTUFBTSxDQUFDQyxPQUFQLENBQWUsTUFBTTtBQUNuQixPQUFLLE1BQU1uSCxJQUFYLElBQW1CK3FCLEtBQW5CLEVBQTBCO0FBQ3hCLFFBQUksQ0FBQ0EsS0FBSyxDQUFDdmpCLGNBQU4sQ0FBcUJ4SCxJQUFyQixDQUFMLEVBQWlDO0FBQy9CO0FBQ0Q7O0FBQ0QsVUFBTXVZLElBQUksR0FBR3dTLEtBQUssQ0FBQy9xQixJQUFELENBQWxCO0FBRUFrSCxVQUFNLENBQUNva0IsS0FBUCxDQUFhLE1BQU07QUFDakIsWUFBTUMsUUFBUSxHQUFHVCxNQUFNLENBQUNVLElBQVAsQ0FBWWpULElBQUksQ0FBQ3ZZLElBQWpCLENBQWpCO0FBQ0EsWUFBTXlyQixRQUFRLGFBQU1YLE1BQU0sQ0FBQ1ksS0FBUCxDQUFhLEdBQWIsQ0FBTixjQUEyQkgsUUFBM0IsQ0FBZDs7QUFDQSxZQUFNSSxPQUFPLEdBQUcsQ0FBQ0MsSUFBRCxFQUFPQyxJQUFQLEtBQWdCO0FBQzlCLGVBQ0UsVUFBR2YsTUFBTSxDQUFDZ0IsR0FBUCxDQUFXLEdBQVgsQ0FBSCxjQUFzQlAsUUFBdEIsdUJBQTJDSyxJQUEzQyxrQ0FDZUMsSUFBSSxHQUFHLENBQVAsR0FBVyxDQUFYLEdBQWVBLElBRDlCLFFBREY7QUFJRCxPQUxEOztBQU1BLFlBQU1wckIsR0FBRyxHQUFHO0FBQ1ZrUixZQUFJLENBQUN5WixHQUFELEVBQU07QUFDUkQsaUJBQU8sV0FBSUwsTUFBTSxDQUFDaUIsR0FBUCxDQUFXLEdBQVgsQ0FBSixjQUF1QlIsUUFBdkIsZUFBb0NILEdBQXBDLE9BQVA7QUFDRCxTQUhTOztBQUlWeHFCLGFBQUssQ0FBQ3dxQixHQUFELEVBQU07QUFDVEQsaUJBQU8sV0FBSUwsTUFBTSxDQUFDZ0IsR0FBUCxDQUFXLEdBQVgsQ0FBSixjQUF1QmhCLE1BQU0sQ0FBQ2dCLEdBQVAsQ0FBV1AsUUFBUSxHQUFHLEdBQXRCLENBQXZCLGNBQXFESCxHQUFyRCxPQUFQO0FBQ0Q7O0FBTlMsT0FBWjs7QUFRQSxVQUFJL1gsR0FBRyxHQUFHLE1BQU07QUFDZDhYLGVBQU8sQ0FBQ00sUUFBRCxDQUFQO0FBQ0EsY0FBTU8sS0FBSyxHQUFHLElBQUk1bUIsSUFBSixFQUFkO0FBQ0FtVCxZQUFJLENBQUNBLElBQUwsQ0FBVTlYLEdBQVY7QUFDQSxjQUFNbXJCLElBQUksR0FBRyxJQUFJeG1CLElBQUosS0FBYTRtQixLQUExQjtBQUNBLGNBQU1ILElBQUksR0FBR3RULElBQUksQ0FBQ0QsUUFBTCxHQUFnQnNULElBQTdCO0FBQ0FULGVBQU8sQ0FBQ1EsT0FBTyxDQUFDQyxJQUFELEVBQU9DLElBQVAsQ0FBUixDQUFQOztBQUNBLFlBQUlBLElBQUksSUFBSSxDQUFaLEVBQWU7QUFDYjNrQixnQkFBTSxDQUFDb2tCLEtBQVAsQ0FBYWpZLEdBQWI7QUFDRCxTQUZELE1BRU87QUFDTG5NLGdCQUFNLENBQUNFLFVBQVAsQ0FBa0JpTSxHQUFsQixFQUF1QndZLElBQXZCO0FBQ0Q7QUFDRixPQVpEOztBQWFBeFksU0FBRztBQUNKLEtBL0JEO0FBZ0NEO0FBQ0YsQ0F4Q0Q7QUF6QkFyVSxNQUFNLENBQUM4RCxhQUFQLENBbUVld1UsSUFuRWYsRTs7Ozs7Ozs7Ozs7QUNBQXRZLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNndEIsS0FBRyxFQUFDLE1BQUlBLEdBQVQ7QUFBYUMsTUFBSSxFQUFDLE1BQUlBLElBQXRCO0FBQTJCQyxXQUFTLEVBQUMsTUFBSUEsU0FBekM7QUFBbURDLGlCQUFlLEVBQUMsTUFBSUEsZUFBdkU7QUFBdUZDLFlBQVUsRUFBQyxNQUFJQSxVQUF0RztBQUFpSEMsYUFBVyxFQUFDLE1BQUlBO0FBQWpJLENBQWQ7QUFBNkosSUFBSUMsUUFBSjtBQUFhdnRCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFVBQVosRUFBdUI7QUFBQ0UsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ2l0QixZQUFRLEdBQUNqdEIsQ0FBVDtBQUFXOztBQUF2QixDQUF2QixFQUFnRCxDQUFoRDtBQUFtRCxJQUFJa3RCLGtCQUFKO0FBQXVCeHRCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLHFCQUFaLEVBQWtDO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNrdEIsc0JBQWtCLEdBQUNsdEIsQ0FBbkI7QUFBcUI7O0FBQWpDLENBQWxDLEVBQXFFLENBQXJFO0FBQXdFLElBQUkrWCxNQUFKO0FBQVdyWSxNQUFNLENBQUNHLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUMrWCxVQUFNLEdBQUMvWCxDQUFQO0FBQVM7O0FBQXJCLENBQXJCLEVBQTRDLENBQTVDO0FBQStDLElBQUltdEIsT0FBSjtBQUFZenRCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNtdEIsV0FBTyxHQUFDbnRCLENBQVI7QUFBVTs7QUFBdEIsQ0FBN0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSTRELE9BQUo7QUFBWWxFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUMrRCxTQUFPLENBQUM1RCxDQUFELEVBQUc7QUFBQzRELFdBQU8sR0FBQzVELENBQVI7QUFBVTs7QUFBdEIsQ0FBM0MsRUFBbUUsQ0FBbkU7QUFBc0UsSUFBSXdLLFdBQUo7QUFBZ0I5SyxNQUFNLENBQUNHLElBQVAsQ0FBWSx3Q0FBWixFQUFxRDtBQUFDMkssYUFBVyxDQUFDeEssQ0FBRCxFQUFHO0FBQUN3SyxlQUFXLEdBQUN4SyxDQUFaO0FBQWM7O0FBQTlCLENBQXJELEVBQXFGLENBQXJGO0FBQXdGLElBQUk2RCxPQUFKO0FBQVluRSxNQUFNLENBQUNHLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDZ0UsU0FBTyxDQUFDN0QsQ0FBRCxFQUFHO0FBQUM2RCxXQUFPLEdBQUM3RCxDQUFSO0FBQVU7O0FBQXRCLENBQTNDLEVBQW1FLENBQW5FO0FBQXNFLElBQUk4RCxXQUFKO0FBQWdCcEUsTUFBTSxDQUFDRyxJQUFQLENBQVksd0NBQVosRUFBcUQ7QUFBQ2lFLGFBQVcsQ0FBQzlELENBQUQsRUFBRztBQUFDOEQsZUFBVyxHQUFDOUQsQ0FBWjtBQUFjOztBQUE5QixDQUFyRCxFQUFxRixDQUFyRjtBQUF3RixJQUFJTyxLQUFKO0FBQVViLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNVLE9BQUssQ0FBQ1AsQ0FBRCxFQUFHO0FBQUNPLFNBQUssR0FBQ1AsQ0FBTjtBQUFROztBQUFsQixDQUF2QyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJK0QsWUFBSjtBQUFpQnJFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBDQUFaLEVBQXVEO0FBQUNrRSxjQUFZLENBQUMvRCxDQUFELEVBQUc7QUFBQytELGdCQUFZLEdBQUMvRCxDQUFiO0FBQWU7O0FBQWhDLENBQXZELEVBQXlGLENBQXpGO0FBQTRGLElBQUlnRSxZQUFKO0FBQWlCdEUsTUFBTSxDQUFDRyxJQUFQLENBQVksMENBQVosRUFBdUQ7QUFBQ21FLGNBQVksQ0FBQ2hFLENBQUQsRUFBRztBQUFDZ0UsZ0JBQVksR0FBQ2hFLENBQWI7QUFBZTs7QUFBaEMsQ0FBdkQsRUFBeUYsRUFBekY7QUFBNkYsSUFBSStmLFVBQUo7QUFBZXJnQixNQUFNLENBQUNHLElBQVAsQ0FBWSxzQ0FBWixFQUFtRDtBQUFDa2dCLFlBQVUsQ0FBQy9mLENBQUQsRUFBRztBQUFDK2YsY0FBVSxHQUFDL2YsQ0FBWDtBQUFhOztBQUE1QixDQUFuRCxFQUFpRixFQUFqRjtBQUFxRixJQUFJaUUsWUFBSjtBQUFpQnZFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBDQUFaLEVBQXVEO0FBQUNvRSxjQUFZLENBQUNqRSxDQUFELEVBQUc7QUFBQ2lFLGdCQUFZLEdBQUNqRSxDQUFiO0FBQWU7O0FBQWhDLENBQXZELEVBQXlGLEVBQXpGO0FBQTZGLElBQUlrRSxZQUFKO0FBQWlCeEUsTUFBTSxDQUFDRyxJQUFQLENBQVksMENBQVosRUFBdUQ7QUFBQ3FFLGNBQVksQ0FBQ2xFLENBQUQsRUFBRztBQUFDa0UsZ0JBQVksR0FBQ2xFLENBQWI7QUFBZTs7QUFBaEMsQ0FBdkQsRUFBeUYsRUFBekY7QUFBNkYsSUFBSW1FLE9BQUo7QUFBWXpFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNzRSxTQUFPLENBQUNuRSxDQUFELEVBQUc7QUFBQ21FLFdBQU8sR0FBQ25FLENBQVI7QUFBVTs7QUFBdEIsQ0FBM0MsRUFBbUUsRUFBbkU7QUFBdUUsSUFBSW9FLE1BQUo7QUFBVzFFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDRCQUFaLEVBQXlDO0FBQUN1RSxRQUFNLENBQUNwRSxDQUFELEVBQUc7QUFBQ29FLFVBQU0sR0FBQ3BFLENBQVA7QUFBUzs7QUFBcEIsQ0FBekMsRUFBK0QsRUFBL0Q7QUFBbUUsSUFBSXFFLE1BQUo7QUFBVzNFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDRCQUFaLEVBQXlDO0FBQUN3RSxRQUFNLENBQUNyRSxDQUFELEVBQUc7QUFBQ3FFLFVBQU0sR0FBQ3JFLENBQVA7QUFBUzs7QUFBcEIsQ0FBekMsRUFBK0QsRUFBL0Q7QUFBbUUsSUFBSXNFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUN5RSxZQUFVLENBQUN0RSxDQUFELEVBQUc7QUFBQ3NFLGNBQVUsR0FBQ3RFLENBQVg7QUFBYTs7QUFBNUIsQ0FBakQsRUFBK0UsRUFBL0U7QUFBbUYsSUFBSW1CLEdBQUo7QUFBUXpCLE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNFLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNtQixPQUFHLEdBQUNuQixDQUFKO0FBQU07O0FBQWxCLENBQS9CLEVBQW1ELEVBQW5EO0FBb0JudUQsTUFBTTJzQixHQUFHLEdBQUcsUUFBWjs7QUFFUDtBQUNBO0FBQ0EsTUFBTVMsV0FBVyxHQUFHam1CLElBQUksSUFBSTtBQUMxQixRQUFNeUYsR0FBRyxHQUFHLEVBQVo7QUFDQXpGLE1BQUksQ0FBQzJDLElBQUwsQ0FBVSxFQUFWLEVBQWM7QUFBRXdLLFVBQU0sRUFBRTtBQUFFek4sVUFBSSxFQUFFO0FBQVI7QUFBVixHQUFkLEVBQXVDdEUsT0FBdkMsQ0FBK0M4cUIsTUFBTSxJQUFJO0FBQ3ZEeGdCLEtBQUMsQ0FBQ29GLElBQUYsQ0FBT29iLE1BQU0sQ0FBQ3htQixJQUFkLEVBQW9CdEUsT0FBcEIsQ0FBNEJQLEdBQUcsSUFBSzRLLEdBQUcsQ0FBQzVLLEdBQUQsQ0FBSCxHQUFXLElBQS9DO0FBQ0QsR0FGRDtBQUdBLFNBQU82SyxDQUFDLENBQUNvRixJQUFGLENBQU9yRixHQUFQLENBQVA7QUFDRCxDQU5EOztBQVFPLE1BQU1nZ0IsSUFBSSxHQUFHeGYsR0FBRyxJQUFJO0FBQ3pCLE1BQUlQLENBQUMsQ0FBQ3ViLE9BQUYsQ0FBVWhiLEdBQVYsQ0FBSixFQUFvQjtBQUNsQjtBQUNBLFdBQU9BLEdBQUcsQ0FBQ1IsR0FBSixDQUFRMGdCLENBQUMsSUFBSVYsSUFBSSxDQUFDVSxDQUFELENBQWpCLEVBQXNCblgsSUFBdEIsQ0FBMkIsR0FBM0IsQ0FBUDtBQUNEOztBQUNELE1BQUl0SixDQUFDLENBQUMwZ0IsTUFBRixDQUFTbmdCLEdBQVQsQ0FBSixFQUFtQjtBQUNqQixXQUFPMkssTUFBTSxDQUFDM0ssR0FBRCxDQUFOLENBQ0pvZ0IsR0FESSxHQUVKekQsTUFGSSxFQUFQO0FBR0Q7O0FBQ0QsTUFBSWxkLENBQUMsQ0FBQzRnQixRQUFGLENBQVdyZ0IsR0FBWCxDQUFKLEVBQXFCO0FBQ25CLFdBQU8xRSxJQUFJLENBQUNDLFNBQUwsQ0FBZXlFLEdBQWYsQ0FBUDtBQUNEOztBQUNELE1BQUlQLENBQUMsQ0FBQzZnQixRQUFGLENBQVd0Z0IsR0FBWCxDQUFKLEVBQXFCO0FBQ25CLFdBQU9BLEdBQUcsQ0FBQ3FiLE9BQUosQ0FBWSxLQUFaLEVBQW1CLEtBQW5CLENBQVA7QUFDRDs7QUFFRCxNQUFJcmIsR0FBRyxLQUFLLEtBQVIsSUFBaUJBLEdBQUcsS0FBSyxDQUE3QixFQUFnQztBQUM5QixXQUFPQSxHQUFHLENBQUNvYixRQUFKLEVBQVA7QUFDRDs7QUFDRCxTQUFPLENBQUNwYixHQUFHLElBQUksRUFBUixFQUFZb2IsUUFBWixFQUFQO0FBQ0QsQ0FyQk07O0FBdUJBLE1BQU1xRSxTQUFTLEdBQUcsR0FBbEI7QUFDQSxNQUFNQyxlQUFlLEdBQUcsSUFBeEI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsSUFBbkI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHVyxJQUFJLElBQUk7QUFDakMsUUFBTUMsR0FBRyxHQUFHRCxJQUFJLENBQUM3WCxLQUFMLENBQVcsQ0FBWCxDQUFaOztBQUNBLE9BQUssSUFBSStILENBQUMsR0FBRyxDQUFSLEVBQVczQyxHQUFHLEdBQUcwUyxHQUFHLENBQUM3Z0IsTUFBMUIsRUFBa0M4USxDQUFDLEdBQUczQyxHQUF0QyxFQUEyQzJDLENBQUMsRUFBNUMsRUFBZ0Q7QUFDOUMrUCxPQUFHLENBQUMvUCxDQUFELENBQUgsR0FBUytPLElBQUksQ0FBQ2dCLEdBQUcsQ0FBQy9QLENBQUQsQ0FBSixDQUFiOztBQUNBLFFBQUkrUCxHQUFHLENBQUMvUCxDQUFELENBQUgsQ0FBT0QsT0FBUCxDQUFlaVAsU0FBZixNQUE4QixDQUFDLENBQW5DLEVBQXNDO0FBQ3BDZSxTQUFHLENBQUMvUCxDQUFELENBQUgsR0FDRWdQLFNBQVMsR0FBR2UsR0FBRyxDQUFDL1AsQ0FBRCxDQUFILENBQU80SyxPQUFQLENBQWVzRSxVQUFmLEVBQTJCRCxlQUEzQixDQUFaLEdBQTBERCxTQUQ1RDtBQUVELEtBSEQsTUFHTyxJQUFJZSxHQUFHLENBQUMvUCxDQUFELENBQUgsQ0FBT0QsT0FBUCxDQUFlLEdBQWYsTUFBd0IsQ0FBQyxDQUF6QixJQUE4QmdRLEdBQUcsQ0FBQy9QLENBQUQsQ0FBSCxDQUFPRCxPQUFQLENBQWUsS0FBZixNQUEwQixDQUFDLENBQTdELEVBQWdFO0FBQ3JFZ1EsU0FBRyxDQUFDL1AsQ0FBRCxDQUFILEdBQVNnUCxTQUFTLEdBQUdlLEdBQUcsQ0FBQy9QLENBQUQsQ0FBZixHQUFxQmdQLFNBQTlCO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPZSxHQUFHLENBQUN6WCxJQUFKLENBQVMsR0FBVCxJQUFnQixJQUF2QjtBQUNELENBWk07O0FBY1AsTUFBTW5GLEtBQUssR0FBRyxVQUFDN0osSUFBRDtBQUFBLE1BQU9rRixLQUFQLHVFQUFlLEVBQWY7QUFBQSxNQUFtQmtSLElBQW5CLHVFQUEwQixFQUExQjtBQUFBLE1BQThCc1EsS0FBOUIsdUVBQXNDLElBQXRDO0FBQUEsU0FBK0NDLFFBQVEsSUFBSTtBQUN2RSxRQUFJQyxJQUFJLEdBQUcsQ0FBWDtBQUFBLFFBQ0VDLE9BREY7O0FBRUEsV0FBTyxDQUFDQSxPQUFELElBQVlBLE9BQU8sQ0FBQ2poQixNQUFSLEdBQWlCLENBQXBDLEVBQXVDO0FBQ3JDaWhCLGFBQU8sR0FBRzdtQixJQUFJLENBQUMyQyxJQUFMLENBQVV1QyxLQUFWLEVBQWlCO0FBQUVrUixZQUFGO0FBQVFzUSxhQUFSO0FBQWVFO0FBQWYsT0FBakIsRUFBd0MxZ0IsS0FBeEMsRUFBVjtBQUNBMmdCLGFBQU8sQ0FBQ3pyQixPQUFSLENBQWdCdXJCLFFBQWhCO0FBQ0FDLFVBQUksSUFBSUYsS0FBUjtBQUNEO0FBQ0YsR0FSYTtBQUFBLENBQWQ7O0FBVUF4RSxNQUFNLENBQUNDLGVBQVAsQ0FBdUJDLEdBQXZCLENBQTJCLGVBQTNCLEVBQTRDLENBQUNDLEdBQUQsRUFBTTFnQixHQUFOLEVBQVdtbEIsSUFBWCxLQUFvQjtBQUM5RDtBQUNBO0FBQ0E7QUFFQSxRQUFNQyxVQUFVLEdBQUcxRSxHQUFHLENBQUMyRSxPQUFKLElBQWUzRSxHQUFHLENBQUMyRSxPQUFKLENBQVlDLGtCQUE5QztBQUNBLE1BQUlDLElBQUo7O0FBQ0EsTUFBSUgsVUFBSixFQUFnQjtBQUNkLFVBQU1JLFdBQVcsR0FBR3hGLFFBQVEsQ0FBQ3lGLGVBQVQsQ0FBeUJMLFVBQXpCLENBQXBCOztBQUNBLFVBQU03aEIsS0FBSyxHQUFHO0FBQUUsaURBQTJDaWlCO0FBQTdDLEtBQWQ7QUFDQSxVQUFNOWxCLE9BQU8sR0FBRztBQUFFOEwsWUFBTSxFQUFFO0FBQUV0VCxXQUFHLEVBQUU7QUFBUDtBQUFWLEtBQWhCO0FBQ0FxdEIsUUFBSSxHQUFHem1CLE1BQU0sQ0FBQzRpQixLQUFQLENBQWF6cEIsT0FBYixDQUFxQnNMLEtBQXJCLEVBQTRCN0QsT0FBNUIsQ0FBUDtBQUNEOztBQUVELE1BQUksQ0FBQzZsQixJQUFMLEVBQVc7QUFDVHZsQixPQUFHLENBQUNtaEIsU0FBSixDQUFjLEdBQWQ7QUFDQW5oQixPQUFHLENBQUNpWixHQUFKO0FBQ0E7QUFDRCxHQWxCNkQsQ0FvQjlEO0FBQ0E7QUFDQTs7O0FBRUEsTUFBSWdJLE1BQUo7O0FBQ0EsVUFBUSxJQUFSO0FBQ0UsU0FBS1AsR0FBRyxDQUFDQyxHQUFKLEtBQVksR0FBakI7QUFDRXdFLFVBQUk7QUFDSjs7QUFDRixTQUFLekUsR0FBRyxDQUFDQyxHQUFKLENBQVEvYSxRQUFSLENBQWlCLFFBQWpCLENBQUw7QUFDRXFiLFlBQU0sR0FBRyxNQUFUO0FBQ0E7O0FBQ0YsU0FBS1AsR0FBRyxDQUFDQyxHQUFKLENBQVEvYSxRQUFSLENBQWlCLFNBQWpCLENBQUw7QUFDRXFiLFlBQU0sR0FBRyxPQUFUO0FBQ0E7O0FBQ0YsU0FBS1AsR0FBRyxDQUFDQyxHQUFKLENBQVEvYSxRQUFSLENBQWlCLE9BQWpCLENBQUw7QUFDRXFiLFlBQU0sR0FBRyxLQUFUO0FBQ0E7O0FBQ0Y7QUFDRWpoQixTQUFHLENBQUNtaEIsU0FBSixDQUFjLEdBQWQ7QUFDQW5oQixTQUFHLENBQUNpWixHQUFKO0FBQ0E7QUFoQkosR0F6QjhELENBNEM5RDtBQUNBO0FBQ0E7OztBQUVBLE1BQUl5TSxhQUFhLEdBQUcsS0FBcEI7QUFBQSxNQUNFQyxlQUFlLEdBQUcsS0FEcEI7QUFHQWpGLEtBQUcsQ0FBQ3RnQixFQUFKLENBQU8sT0FBUCxFQUFnQixVQUFTN0gsR0FBVCxFQUFjO0FBQzVCLFFBQUksQ0FBQ290QixlQUFMLEVBQXNCO0FBQ3BCdHRCLFNBQUcsQ0FBQ2tSLElBQUosQ0FBUyw4QkFBVDtBQUNBbWMsbUJBQWEsR0FBRyxJQUFoQjtBQUNEO0FBQ0YsR0FMRCxFQW5EOEQsQ0EwRDlEO0FBQ0E7QUFDQTs7QUFFQSxRQUFNRSxFQUFFLEdBQUczVyxNQUFNLEdBQUdnUyxNQUFULENBQWdCLHFCQUFoQixDQUFYO0FBQ0EsUUFBTTRFLFFBQVEsNkJBQXNCRCxFQUF0QixDQUFkO0FBQ0E1bEIsS0FBRyxDQUFDOGxCLFNBQUosQ0FBYyxxQkFBZCxFQUFxQzFCLGtCQUFrQixDQUFDeUIsUUFBUSxHQUFHLE1BQVosQ0FBdkQ7QUFDQTdsQixLQUFHLENBQUM4bEIsU0FBSixDQUFjLGNBQWQsRUFBOEIsaUJBQTlCO0FBQ0E5bEIsS0FBRyxDQUFDbWhCLFNBQUosQ0FBYyxHQUFkLEVBbEU4RCxDQW9FOUQ7QUFDQTtBQUNBOztBQUVBLE1BQUk0RSxPQUFPLEdBQUc1QixRQUFRLENBQUMsS0FBRCxDQUF0QixDQXhFOEQsQ0EwRTlEOztBQUNBNEIsU0FBTyxDQUFDM2xCLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFVBQVM3SCxHQUFULEVBQWM7QUFDbEMsUUFBSUEsR0FBRyxDQUFDeXRCLElBQUosS0FBYSxRQUFqQixFQUEyQjtBQUN6QjN0QixTQUFHLENBQUNrSCxJQUFKLENBQVMsaUJBQVQsRUFBNEJoSCxHQUE1QjtBQUNELEtBRkQsTUFFTztBQUNMRixTQUFHLENBQUNFLEdBQUosQ0FBUSxlQUFSLEVBREssQ0FFTDs7QUFDQSxZQUFNQSxHQUFOO0FBQ0Q7QUFDRixHQVJELEVBM0U4RCxDQXFGOUQ7O0FBQ0F3dEIsU0FBTyxDQUFDM2xCLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLFVBQVM3SCxHQUFULEVBQWM7QUFDaENGLE9BQUcsQ0FBQ0UsR0FBSixDQUFRLGVBQVI7QUFDQSxVQUFNQSxHQUFOO0FBQ0QsR0FIRCxFQXRGOEQsQ0EyRjlEOztBQUNBd3RCLFNBQU8sQ0FBQ0UsSUFBUixDQUFham1CLEdBQWIsRUE1RjhELENBOEY5RDtBQUNBO0FBQ0E7O0FBRUEsUUFBTWttQixZQUFZLEdBQUcsRUFBckI7O0FBQ0EsUUFBTUMsUUFBUSxHQUFHLFVBQUN2dUIsSUFBRCxFQUFPdVIsSUFBUCxFQUFhdFIsSUFBYixFQUFxQztBQUFBLFFBQWxCdXVCLFFBQWtCLHVFQUFQLEVBQU87O0FBQ3BELFFBQUlGLFlBQVksQ0FBQ3R1QixJQUFELENBQWhCLEVBQXdCO0FBQ3RCLHNEQUF5Q0EsSUFBekM7QUFDRDs7QUFDRHN1QixnQkFBWSxDQUFDdHVCLElBQUQsQ0FBWixHQUFxQixJQUFyQjtBQUVBLFVBQU15dUIsSUFBSSxHQUFHLElBQUloQyxPQUFPLENBQUNpQyxvQkFBWixFQUFiO0FBQ0FQLFdBQU8sQ0FBQzNYLE1BQVIsQ0FBZWlZLElBQWYsRUFBcUI7QUFBRXp1QixVQUFJLFlBQUtpdUIsUUFBTCxjQUFpQmp1QixJQUFqQixjQUF5QnFwQixNQUF6QjtBQUFOLEtBQXJCOztBQUNBLFFBQUlBLE1BQU0sS0FBSyxLQUFmLEVBQXNCO0FBQ3BCb0YsVUFBSSxDQUFDRSxHQUFMLENBQVMxQyxHQUFUO0FBQ0F3QyxVQUFJLENBQUNFLEdBQUwsQ0FBU3JDLFdBQVcsQ0FBQy9hLElBQUksQ0FBQ3BILE1BQUwsQ0FBWXFrQixRQUFRLENBQUN0aUIsR0FBVCxDQUFhK04sQ0FBQyxtQkFBWUEsQ0FBWixDQUFkLENBQVosQ0FBRCxDQUFwQjtBQUNEOztBQUVEb1AsVUFBTSxLQUFLLE1BQVgsSUFBcUJvRixJQUFJLENBQUNFLEdBQUwsQ0FBUyxHQUFULENBQXJCO0FBRUEsUUFBSUMsV0FBVyxHQUFHLElBQWxCO0FBRUEzdUIsUUFBSSxDQUFDLFVBQUNrRyxJQUFELEVBQXlCO0FBQUEsVUFBbEIwb0IsUUFBa0IsdUVBQVAsRUFBTzs7QUFDNUIsY0FBUXhGLE1BQVI7QUFDRSxhQUFLLEtBQUw7QUFDRSxnQkFBTTNjLEdBQUcsR0FBRyxFQUFaO0FBQ0E2RSxjQUFJLENBQUMxUCxPQUFMLENBQWFvWSxDQUFDLElBQUk7QUFDaEJ2TixlQUFHLENBQUNFLElBQUosQ0FBU3pHLElBQUksQ0FBQzhULENBQUQsQ0FBYjtBQUNELFdBRkQ7QUFHQXVVLGtCQUFRLENBQUMzc0IsT0FBVCxDQUFpQm9ZLENBQUMsSUFBSTtBQUNwQnZOLGVBQUcsQ0FBQ0UsSUFBSixDQUFTaWlCLFFBQVEsQ0FBQzVVLENBQUQsQ0FBakI7QUFDRCxXQUZEO0FBR0F3VSxjQUFJLENBQUNFLEdBQUwsQ0FBU3JDLFdBQVcsQ0FBQzVmLEdBQUQsQ0FBcEI7QUFDQTs7QUFDRixhQUFLLE9BQUw7QUFDRVAsV0FBQyxDQUFDMmlCLElBQUYsQ0FBT0QsUUFBUCxFQUFpQixDQUFDdnZCLENBQUQsRUFBSTJhLENBQUosS0FBVzlULElBQUksZ0JBQVM4VCxDQUFULEVBQUosR0FBb0IzYSxDQUFoRDs7QUFDQW12QixjQUFJLENBQUNFLEdBQUwsQ0FBUzNtQixJQUFJLENBQUNDLFNBQUwsQ0FBZTlCLElBQWYsSUFBdUIsSUFBaEM7QUFDQTs7QUFDRixhQUFLLE1BQUw7QUFDRWdHLFdBQUMsQ0FBQzJpQixJQUFGLENBQU9ELFFBQVAsRUFBaUIsQ0FBQ3Z2QixDQUFELEVBQUkyYSxDQUFKLEtBQVc5VCxJQUFJLGdCQUFTOFQsQ0FBVCxFQUFKLEdBQW9CM2EsQ0FBaEQ7O0FBQ0EsY0FBSXN2QixXQUFKLEVBQWlCO0FBQ2ZBLHVCQUFXLEdBQUcsS0FBZDtBQUNBSCxnQkFBSSxDQUFDRSxHQUFMLENBQVMsT0FBTzNtQixJQUFJLENBQUNDLFNBQUwsQ0FBZTlCLElBQWYsQ0FBaEI7QUFDRCxXQUhELE1BR087QUFDTHNvQixnQkFBSSxDQUFDRSxHQUFMLENBQVMsUUFBUTNtQixJQUFJLENBQUNDLFNBQUwsQ0FBZTlCLElBQWYsQ0FBakI7QUFDRDs7QUFDRDs7QUFDRjtBQUNFLDBDQUF5QmtqQixNQUF6QjtBQXpCSjtBQTJCRCxLQTVCRyxDQUFKO0FBOEJBQSxVQUFNLEtBQUssTUFBWCxJQUFxQm9GLElBQUksQ0FBQ0UsR0FBTCxDQUFTLEtBQVQsQ0FBckI7QUFFQUYsUUFBSSxDQUFDTSxJQUFMO0FBQ0QsR0FsREQsQ0FuRzhELENBdUo5RDtBQUNBO0FBQ0E7OztBQUVBLFFBQU1DLGdCQUFnQixHQUFHLENBQ3ZCLEtBRHVCLEVBRXZCLE1BRnVCLEVBR3ZCLFVBSHVCLEVBSXZCLGFBSnVCLEVBS3ZCLE1BTHVCLEVBTXZCLEtBTnVCLEVBT3ZCLEtBUHVCLEVBUXZCLFdBUnVCLEVBU3ZCLFlBVHVCLENBQXpCO0FBV0FULFVBQVEsQ0FBQyxjQUFELEVBQWlCUyxnQkFBakIsRUFBbUNDLElBQUksSUFBSTtBQUNqRG5sQixlQUFXLENBQUNWLElBQVosR0FBbUJ2SCxPQUFuQixDQUEyQnF0QixFQUFFLElBQUlELElBQUksQ0FBQzlpQixDQUFDLENBQUNLLElBQUYsQ0FBTzBpQixFQUFQLEVBQVdGLGdCQUFYLENBQUQsQ0FBckM7QUFDRCxHQUZPLENBQVI7QUFJQSxRQUFNRyxZQUFZLEdBQUcsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixPQUFoQixFQUF5QixjQUF6QixFQUF5QyxXQUF6QyxDQUFyQjtBQUNBWixVQUFRLENBQUMsU0FBRCxFQUFZWSxZQUFaLEVBQTBCRixJQUFJLElBQUk7QUFDeEMzZSxTQUFLLENBQUNuTixPQUFELENBQUwsQ0FBZXNJLENBQUMsSUFBSXdqQixJQUFJLENBQUM5aUIsQ0FBQyxDQUFDSyxJQUFGLENBQU9mLENBQVAsRUFBVTBqQixZQUFWLENBQUQsQ0FBeEI7QUFDRCxHQUZPLENBQVI7QUFJQSxRQUFNQyxlQUFlLEdBQUcsQ0FDdEIsS0FEc0IsRUFFdEIsTUFGc0IsRUFHdEIsV0FIc0IsRUFJdEIsV0FKc0IsRUFLdEIsWUFMc0IsQ0FBeEI7QUFPQWIsVUFBUSxDQUFDLFlBQUQsRUFBZWEsZUFBZixFQUFnQ0gsSUFBSSxJQUFJO0FBQzlDM2UsU0FBSyxDQUFDMU0sVUFBRCxDQUFMLENBQWtCNkgsQ0FBQyxJQUFJd2pCLElBQUksQ0FBQzlpQixDQUFDLENBQUNLLElBQUYsQ0FBT2YsQ0FBUCxFQUFVMmpCLGVBQVYsQ0FBRCxDQUEzQjtBQUNELEdBRk8sQ0FBUjtBQUlBLFFBQU1DLGlCQUFpQixHQUFHLENBQ3hCLEtBRHdCLEVBRXhCLE1BRndCLEVBR3hCLGFBSHdCLEVBSXhCLGtCQUp3QixFQUt4QixpQkFMd0IsRUFNeEIsYUFOd0IsRUFPeEIsYUFQd0IsRUFReEIsV0FSd0IsRUFTeEIsWUFUd0IsQ0FBMUI7QUFXQWQsVUFBUSxDQUFDLGVBQUQsRUFBa0JjLGlCQUFsQixFQUFxQ0osSUFBSSxJQUFJO0FBQ25EM2UsU0FBSyxDQUFDak4sWUFBRCxDQUFMLENBQW9Cb0ksQ0FBQyxJQUFJd2pCLElBQUksQ0FBQzlpQixDQUFDLENBQUNLLElBQUYsQ0FBT2YsQ0FBUCxFQUFVNGpCLGlCQUFWLENBQUQsQ0FBN0I7QUFDRCxHQUZPLENBQVI7QUFJQSxRQUFNQyxXQUFXLEdBQUcsQ0FDbEIsS0FEa0IsRUFFbEIsT0FGa0IsRUFHbEIsWUFIa0IsRUFJbEIsTUFKa0IsRUFLbEIsV0FMa0IsRUFNbEIsWUFOa0IsRUFPbEIsUUFQa0IsRUFRbEIsU0FSa0IsRUFTbEIsY0FUa0IsRUFVbEIsV0FWa0IsRUFXbEIsWUFYa0IsQ0FBcEI7QUFhQWYsVUFBUSxDQUFDLFNBQUQsRUFBWWUsV0FBWixFQUF5QkwsSUFBSSxJQUFJO0FBQ3ZDM2UsU0FBSyxDQUFDcE4sT0FBRCxDQUFMLENBQWV1SSxDQUFDLElBQUl3akIsSUFBSSxDQUFDOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPZixDQUFQLEVBQVU2akIsV0FBVixDQUFELENBQXhCO0FBQ0QsR0FGTyxDQUFSO0FBSUEsUUFBTUMsZUFBZSxHQUFHLENBQ3RCLEtBRHNCLEVBRXRCLE9BRnNCLEVBR3RCLGdCQUhzQixFQUl0QixrQkFKc0IsRUFLdEIsWUFMc0IsRUFNdEIsaUJBTnNCLEVBT3RCLFdBUHNCLEVBUXRCLFFBUnNCLEVBU3RCLGFBVHNCLEVBVXRCLFNBVnNCLEVBV3RCLGVBWHNCLEVBWXRCLFdBWnNCLENBQXhCO0FBY0FoQixVQUFRLENBQUMsY0FBRCxFQUFpQmdCLGVBQWpCLEVBQWtDTixJQUFJLElBQUk7QUFDaEQzZSxTQUFLLENBQUNsTixXQUFELENBQUwsQ0FBbUJxSSxDQUFDLElBQUl3akIsSUFBSSxDQUFDOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPZixDQUFQLEVBQVU4akIsZUFBVixDQUFELENBQTVCO0FBQ0QsR0FGTyxDQUFSO0FBSUEsUUFBTUMsVUFBVSxHQUFHLENBQ2pCLEtBRGlCLEVBRWpCLFlBRmlCLEVBR2pCLGFBSGlCLEVBSWpCLGFBSmlCLEVBS2pCLFVBTGlCLEVBTWpCLFdBTmlCLEVBT2pCLFNBUGlCLEVBUWpCLFdBUmlCLENBQW5CO0FBVUEsUUFBTUMsY0FBYyxHQUFHL0MsV0FBVyxDQUFDN3NCLEtBQUQsQ0FBbEM7QUFDQTB1QixVQUFRLENBQ04sT0FETSxFQUVOaUIsVUFGTSxFQUdOUCxJQUFJLElBQUk7QUFDTjNlLFNBQUssQ0FBQ3pRLEtBQUQsQ0FBTCxDQUFhNEwsQ0FBQyxJQUNad2pCLElBQUksQ0FBQzlpQixDQUFDLENBQUNLLElBQUYsQ0FBT2YsQ0FBUCxFQUFVK2pCLFVBQVYsQ0FBRCxFQUF3QnJqQixDQUFDLENBQUNLLElBQUYsQ0FBT2YsQ0FBQyxDQUFDdEYsSUFBVCxFQUFlc3BCLGNBQWYsQ0FBeEIsQ0FETjtBQUdELEdBUEssRUFRTkEsY0FSTSxDQUFSO0FBV0EsUUFBTUMsWUFBWSxHQUFHLENBQ25CLEtBRG1CLEVBRW5CLEtBRm1CLEVBR25CLFNBSG1CLEVBSW5CLGtCQUptQixFQUtuQixrQkFMbUIsRUFNbkIsZUFObUIsRUFPbkIsUUFQbUIsRUFRbkIsWUFSbUIsRUFTbkIsWUFUbUIsRUFVbkIsV0FWbUIsRUFXbkIsZUFYbUIsRUFZbkIsV0FabUIsQ0FBckI7O0FBY0EsTUFBSTVHLEdBQUcsQ0FBQ25kLEtBQUosQ0FBVWdrQixXQUFWLEtBQTBCLE1BQTlCLEVBQXNDO0FBQ3BDRCxnQkFBWSxDQUFDRSxNQUFiLENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCLElBQTFCLEVBQWdDLFdBQWhDO0FBQ0FGLGdCQUFZLENBQUNFLE1BQWIsQ0FBb0JGLFlBQVksQ0FBQ3JqQixNQUFqQyxFQUF5QyxDQUF6QyxFQUE0QyxXQUE1QztBQUNEOztBQUVELFFBQU13akIsZ0JBQWdCLEdBQUduRCxXQUFXLENBQUNqcEIsT0FBRCxDQUFwQztBQUNBOHFCLFVBQVEsQ0FDTixTQURNLEVBRU5tQixZQUZNLEVBR05ULElBQUksSUFBSTtBQUNOM2UsU0FBSyxDQUFDN00sT0FBRCxDQUFMLENBQWV5UyxDQUFDLElBQ2QrWSxJQUFJLENBQUM5aUIsQ0FBQyxDQUFDSyxJQUFGLENBQU8wSixDQUFQLEVBQVV3WixZQUFWLENBQUQsRUFBMEJ2akIsQ0FBQyxDQUFDSyxJQUFGLENBQU8wSixDQUFDLENBQUMvUCxJQUFULEVBQWUwcEIsZ0JBQWYsQ0FBMUIsQ0FETjtBQUdELEdBUEssRUFRTkEsZ0JBUk0sQ0FBUjtBQVdBLFFBQU1DLFdBQVcsR0FBRyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFVBQWpCLEVBQTZCLFFBQTdCLEVBQXVDLFdBQXZDLENBQXBCO0FBQ0EsUUFBTUMsZUFBZSxHQUFHckQsV0FBVyxDQUFDaHBCLE1BQUQsQ0FBbkM7QUFDQTZxQixVQUFRLENBQ04sUUFETSxFQUVOdUIsV0FGTSxFQUdOYixJQUFJLElBQUk7QUFDTjNlLFNBQUssQ0FBQzVNLE1BQUQsQ0FBTCxDQUFjd1MsQ0FBQyxJQUNiK1ksSUFBSSxDQUFDOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBUCxFQUFVNFosV0FBVixDQUFELEVBQXlCM2pCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBQyxDQUFDL1AsSUFBVCxFQUFlNHBCLGVBQWYsQ0FBekIsQ0FETjtBQUdELEdBUEssRUFRTkEsZUFSTSxDQUFSO0FBV0EsUUFBTUMsV0FBVyxHQUFHLENBQ2xCLEtBRGtCLEVBRWxCLE9BRmtCLEVBR2xCLE1BSGtCLEVBSWxCLGFBSmtCLEVBS2xCLGFBTGtCLEVBTWxCLG1CQU5rQixFQU9sQixTQVBrQixFQVFsQixRQVJrQixFQVNsQixXQVRrQixDQUFwQjtBQVdBLFFBQU1DLGVBQWUsR0FBR3ZELFdBQVcsQ0FBQy9vQixNQUFELENBQW5DO0FBQ0E0cUIsVUFBUSxDQUNOLFFBRE0sRUFFTnlCLFdBRk0sRUFHTmYsSUFBSSxJQUFJO0FBQ04zZSxTQUFLLENBQUMzTSxNQUFELENBQUwsQ0FBY3VTLENBQUMsSUFDYitZLElBQUksQ0FBQzlpQixDQUFDLENBQUNLLElBQUYsQ0FBTzBKLENBQVAsRUFBVThaLFdBQVYsQ0FBRCxFQUF5QjdqQixDQUFDLENBQUNLLElBQUYsQ0FBTzBKLENBQUMsQ0FBQy9QLElBQVQsRUFBZThwQixlQUFmLENBQXpCLENBRE47QUFHRCxHQVBLLEVBUU5BLGVBUk0sQ0FBUjtBQVdBLFFBQU1DLGlCQUFpQixHQUFHLENBQ3hCLEtBRHdCLEVBRXhCLFNBRndCLEVBR3hCLFVBSHdCLEVBSXhCLFNBSndCLEVBS3hCLFFBTHdCLEVBTXhCLFdBTndCLENBQTFCO0FBUUEsUUFBTUMscUJBQXFCLEdBQUd6RCxXQUFXLENBQUNucEIsWUFBRCxDQUF6QztBQUNBZ3JCLFVBQVEsQ0FDTixlQURNLEVBRU4yQixpQkFGTSxFQUdOakIsSUFBSSxJQUFJO0FBQ04zZSxTQUFLLENBQUMvTSxZQUFELENBQUwsQ0FBb0IyUyxDQUFDLElBQ25CK1ksSUFBSSxDQUNGOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBUCxFQUFVZ2EsaUJBQVYsQ0FERSxFQUVGL2pCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBQyxDQUFDL1AsSUFBVCxFQUFlZ3FCLHFCQUFmLENBRkUsQ0FETjtBQU1ELEdBVkssRUFXTkEscUJBWE0sQ0FBUjtBQWNBLFFBQU1DLGlCQUFpQixHQUFHLENBQ3hCLEtBRHdCLEVBRXhCLFNBRndCLEVBR3hCLFVBSHdCLEVBSXhCLFNBSndCLEVBS3hCLFNBTHdCLEVBTXhCLFFBTndCLEVBT3hCLFdBUHdCLEVBUXhCLGFBUndCLENBQTFCO0FBVUEsUUFBTUMscUJBQXFCLEdBQUczRCxXQUFXLENBQUNscEIsWUFBRCxDQUF6QztBQUNBK3FCLFVBQVEsQ0FDTixlQURNLEVBRU42QixpQkFGTSxFQUdObkIsSUFBSSxJQUFJO0FBQ04zZSxTQUFLLENBQUM5TSxZQUFELENBQUwsQ0FBb0IwUyxDQUFDLElBQ25CK1ksSUFBSSxDQUNGOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBUCxFQUFVa2EsaUJBQVYsQ0FERSxFQUVGamtCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBQyxDQUFDL1AsSUFBVCxFQUFla3FCLHFCQUFmLENBRkUsQ0FETjtBQU1ELEdBVkssRUFXTkEscUJBWE0sQ0FBUjtBQWNBLFFBQU1DLGlCQUFpQixHQUFHLENBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsUUFBcEIsRUFBOEIsV0FBOUIsQ0FBMUI7QUFDQSxRQUFNQyxxQkFBcUIsR0FBRzdELFdBQVcsQ0FBQ3BwQixZQUFELENBQXpDO0FBQ0FpckIsVUFBUSxDQUNOLGVBRE0sRUFFTitCLGlCQUZNLEVBR05yQixJQUFJLElBQUk7QUFDTjNlLFNBQUssQ0FBQ2hOLFlBQUQsQ0FBTCxDQUFvQjRTLENBQUMsSUFDbkIrWSxJQUFJLENBQ0Y5aUIsQ0FBQyxDQUFDSyxJQUFGLENBQU8wSixDQUFQLEVBQVVvYSxpQkFBVixDQURFLEVBRUZua0IsQ0FBQyxDQUFDSyxJQUFGLENBQU8wSixDQUFDLENBQUMvUCxJQUFULEVBQWVvcUIscUJBQWYsQ0FGRSxDQUROO0FBTUQsR0FWSyxFQVdOQSxxQkFYTSxDQUFSO0FBY0EsUUFBTUMsZUFBZSxHQUFHLENBQ3RCLEtBRHNCLEVBRXRCLFVBRnNCLEVBR3RCLFFBSHNCLEVBSXRCLFNBSnNCLEVBS3RCLFNBTHNCLEVBTXRCLE1BTnNCLEVBT3RCLFVBUHNCLEVBUXRCLFdBUnNCLENBQXhCO0FBVUFqQyxVQUFRLENBQUMsYUFBRCxFQUFnQmlDLGVBQWhCLEVBQWlDdkIsSUFBSSxJQUFJO0FBQy9DM2UsU0FBSyxDQUFDK08sVUFBRCxDQUFMLENBQWtCbkosQ0FBQyxJQUFJK1ksSUFBSSxDQUFDOWlCLENBQUMsQ0FBQ0ssSUFBRixDQUFPMEosQ0FBUCxFQUFVc2EsZUFBVixDQUFELENBQTNCO0FBQ0QsR0FGTyxDQUFSO0FBSUFyQyxTQUFPLENBQUNzQyxRQUFSO0FBQ0ExQyxpQkFBZSxHQUFHLElBQWxCO0FBQ0QsQ0FyWkQsRTs7Ozs7Ozs7Ozs7QUNuRkEvdUIsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVo7QUFBZ0NILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLFdBQVo7QUFBeUJILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdCQUFaO0FBQThCSCxNQUFNLENBQUNHLElBQVAsQ0FBWSxXQUFaO0FBQXlCSCxNQUFNLENBQUNHLElBQVAsQ0FBWSxtQkFBWjtBQUFpQ0gsTUFBTSxDQUFDRyxJQUFQLENBQVksY0FBWjtBQUE0QkgsTUFBTSxDQUFDRyxJQUFQLENBQVksYUFBWjtBQUEyQkgsTUFBTSxDQUFDRyxJQUFQLENBQVksa0JBQVo7QUFBZ0NILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9CQUFaO0FBQWtDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSxzQkFBWixFOzs7Ozs7Ozs7OztBQ0ExUUgsTUFBTSxDQUFDRyxJQUFQLENBQVksNEJBQVo7QUFBMENILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaO0FBQTRDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSw0QkFBWjtBQUEwQ0gsTUFBTSxDQUFDRyxJQUFQLENBQVksMENBQVo7QUFBd0RILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaO0FBQTRDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSwwQ0FBWjtBQUF3REgsTUFBTSxDQUFDRyxJQUFQLENBQVksbUNBQVo7QUFBaURILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlDQUFaO0FBQStDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSwrQ0FBWjtBQUE2REgsTUFBTSxDQUFDRyxJQUFQLENBQVksNENBQVo7QUFBMERILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGlDQUFaO0FBQStDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSx1Q0FBWjtBQUFxREgsTUFBTSxDQUFDRyxJQUFQLENBQVksK0NBQVo7QUFBNkRILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDBCQUFaO0FBQXdDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSw0QkFBWjtBQUEwQ0gsTUFBTSxDQUFDRyxJQUFQLENBQVksd0NBQVo7QUFBc0RILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLGdDQUFaO0FBQThDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQ0FBWjtBQUFrREgsTUFBTSxDQUFDRyxJQUFQLENBQVksZ0RBQVo7QUFBOERILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDhCQUFaO0FBQTRDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSx1Q0FBWjtBQUFxREgsTUFBTSxDQUFDRyxJQUFQLENBQVksb0NBQVo7QUFBa0RILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLG9DQUFaO0FBQWtESCxNQUFNLENBQUNHLElBQVAsQ0FBWSxvQ0FBWjtBQUFrREgsTUFBTSxDQUFDRyxJQUFQLENBQVksa0NBQVo7QUFBZ0RILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZCQUFaO0FBQTJDSCxNQUFNLENBQUNHLElBQVAsQ0FBWSw2QkFBWjtBQUEyQ0gsTUFBTSxDQUFDRyxJQUFQLENBQVksaUNBQVo7QUFBK0NILE1BQU0sQ0FBQ0csSUFBUCxDQUFZLDZDQUFaLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2VtcGlyaWNhX2NvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuL3N0YXJ0dXAvc2VydmVyL2luZGV4LmpzXCI7XG5cbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuU2ltcGxlU2NoZW1hLmRlYnVnID0gdHJ1ZTtcblxuaW1wb3J0IHsgcGxheWVySWRGb3JDb25uIH0gZnJvbSBcIi4vc3RhcnR1cC9zZXJ2ZXIvY29ubmVjdGlvbnMuanNcIjtcbmltcG9ydCB7IGNhbGxPbkNoYW5nZSB9IGZyb20gXCIuL2FwaS9zZXJ2ZXIvb25jaGFuZ2UuanNcIjtcbmltcG9ydCB7IGNhbGxPblN1Ym1pdCB9IGZyb20gXCIuL2FwaS9zZXJ2ZXIvb25zdWJtaXQuanNcIjtcbmltcG9ydCB7IGVhcmx5RXhpdEdhbWUgfSBmcm9tIFwiLi9hcGkvZ2FtZXMvbWV0aG9kcy5qc1wiO1xuaW1wb3J0IHNoYXJlZCBmcm9tIFwiLi9zaGFyZWRcIjtcbmltcG9ydCB7IGdldEZ1bmN0aW9uUGFyYW1ldGVycyB9IGZyb20gXCIuL2xpYi91dGlsc1wiO1xuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi9hcGkvZ2FtZXMvZ2FtZXMuanNcIjtcblxuY29uc3Qgc2FmZUNhbGxiYWNrID0gZnVuY3Rpb24obmFtZSwgZnVuYywgYXJndW1lbnRzKSB7XG4gIHRyeSB7XG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlIFwib25HYW1lU3RhcnRcIjpcbiAgICAgIGNhc2UgXCJvblJvdW5kU3RhcnRcIjpcbiAgICAgIGNhc2UgXCJvblN0YWdlU3RhcnRcIjpcbiAgICAgIGNhc2UgXCJvblN0YWdlRW5kXCI6XG4gICAgICBjYXNlIFwib25Sb3VuZEVuZFwiOlxuICAgICAgY2FzZSBcIm9uR2FtZUVuZFwiOlxuICAgICAgICBoYW5kbGVDYWxsYmFja0Z1bmNQYXJhbWV0ZXJzKGZ1bmMpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgZ2FtZSA9IEdhbWVzLmZpbmRPbmUoYXJndW1lbnRzWzBdLl9pZCk7XG5cbiAgICBpZiAoZ2FtZS5maW5pc2hlZEF0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcInNhZmVDYWxsYmFjazogZ2FtZSBhbHJlYWR5IGVuZGVkLlwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGBGYXRhbCBlcnJvciBlbmNvdW50ZXIgY2FsbGluZyBFbXBpcmljYS4ke25hbWV9OmApO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICBjb25zdCBnYW1lID0gYXJndW1lbnRzWzBdO1xuXG4gICAgZWFybHlFeGl0R2FtZS5jYWxsKHtcbiAgICAgIGdhbWVJZDogZ2FtZS5faWQsXG4gICAgICBlbmRSZWFzb246IGBGYWlsZWQgb24gJHtuYW1lfSBjYWxsYmFja2AsXG4gICAgICBzdGF0dXM6IFwiZmFpbGVkXCJcbiAgICB9KTtcbiAgfVxufTtcblxuY29uc3QgaGFuZGxlQ2FsbGJhY2tGdW5jUGFyYW1ldGVycyA9IGZ1bmMgPT4ge1xuICBjb25zdCBwYXJhbWV0ZXJzID0gZ2V0RnVuY3Rpb25QYXJhbWV0ZXJzKGZ1bmMpO1xuICBjb25zdCBoYW5kbGVyID0ge1xuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleUluZGV4KSB7XG4gICAgICBjb25zdCBrZXkgPSBrZXlJbmRleC5zcGxpdChcIl9fLV9fXCIpWzBdO1xuICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChrZXlJbmRleC5zcGxpdChcIl9fLV9fXCIpWzFdKTtcbiAgICAgIGlmIChcbiAgICAgICAgKGtleSA9PT0gXCJnYW1lXCIgJiYgaW5kZXggPT09IDApIHx8XG4gICAgICAgIChrZXkgPT09IFwicm91bmRcIiAmJiBpbmRleCA9PT0gMSkgfHxcbiAgICAgICAgKGtleSA9PT0gXCJzdGFnZVwiICYmIGluZGV4ID09PSAyKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInBsYXllcnNcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYHRoZSBcInBsYXllcnNcIiBhcmd1bWVudCBoYXMgYmVlbiBkZXByZWNhdGVkLCB1c2UgXCJnYW1lLnBsYXllcnNcIiBpbnN0ZWFkYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7a2V5fVwiIHByb3BlcnR5IGlzIG5vdCBhbGxvd2VkIG9uIHRoaXMgY2FsbGJhY2tgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkoe30sIGhhbmRsZXIpO1xuICBwYXJhbWV0ZXJzLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBrZXlJbmRleCA9IGtleSArIFwiX18tX19cIiArIGluZGV4O1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJveHksIGtleUluZGV4KTtcbiAgfSk7XG59O1xuXG4vLyBNYXliZSBjb3VsZCBkbyBiZXR0ZXIuLi5cbmNvbnN0IGNvbmZpZyA9IHsgYm90czoge30gfTtcblxuY29uc3QgRW1waXJpY2EgPSB7XG4gIC8vIE5ldyBuYW1lIGZvciBpbml0OiBnYW1lSW5pdFxuICBnYW1lSW5pdChmdW5jKSB7XG4gICAgY29uZmlnLmdhbWVJbml0ID0gZnVuYztcbiAgfSxcblxuICBib3QobmFtZSwgb2JqKSB7XG4gICAgaWYgKGNvbmZpZy5ib3RzW25hbWVdKSB7XG4gICAgICB0aHJvdyBgQm90IFwiJHtuYW1lfVwiIHdhcyBkZWNsYXJlZCB0d2ljZSFgO1xuICAgIH1cbiAgICBjb25maWcuYm90c1tuYW1lXSA9IG9iajtcbiAgfSxcblxuICBvbkdhbWVTdGFydChmdW5jKSB7XG4gICAgY29uZmlnLm9uR2FtZVN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25HYW1lU3RhcnRcIiwgZnVuYywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LFxuXG4gIG9uUm91bmRTdGFydChmdW5jKSB7XG4gICAgY29uZmlnLm9uUm91bmRTdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNhZmVDYWxsYmFjayhcIm9uUm91bmRTdGFydFwiLCBmdW5jLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0sXG5cbiAgb25TdGFnZVN0YXJ0KGZ1bmMpIHtcbiAgICBjb25maWcub25TdGFnZVN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25TdGFnZVN0YXJ0XCIsIGZ1bmMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSxcblxuICBvblN0YWdlRW5kKGZ1bmMpIHtcbiAgICBjb25maWcub25TdGFnZUVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNhZmVDYWxsYmFjayhcIm9uU3RhZ2VFbmRcIiwgZnVuYywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LFxuXG4gIG9uUm91bmRFbmQoZnVuYykge1xuICAgIGNvbmZpZy5vblJvdW5kRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25Sb3VuZEVuZFwiLCBmdW5jLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0sXG5cbiAgb25HYW1lRW5kKGZ1bmMpIHtcbiAgICBjb25maWcub25HYW1lRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25HYW1lRW5kXCIsIGZ1bmMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSxcblxuICBvblNldChmdW5jKSB7XG4gICAgY29uZmlnLm9uU2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25TZXRcIiwgZnVuYywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LFxuXG4gIG9uQXBwZW5kKGZ1bmMpIHtcbiAgICBjb25maWcub25BcHBlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzYWZlQ2FsbGJhY2soXCJvbkFwcGVuZFwiLCBmdW5jLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0sXG5cbiAgb25DaGFuZ2UoZnVuYykge1xuICAgIGNvbmZpZy5vbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNhZmVDYWxsYmFjayhcIm9uQ2hhbmdlXCIsIGZ1bmMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSxcblxuICBvblN1Ym1pdChmdW5jKSB7XG4gICAgY29uZmlnLm9uU3VibWl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc2FmZUNhbGxiYWNrKFwib25TdWJtaXRcIiwgZnVuYywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgeyBjb25maWcgfTtcbmV4cG9ydCBkZWZhdWx0IEVtcGlyaWNhO1xuXG4vLyBIZWxwIGFjY2VzcyB0byBzZXJ2ZXIgb25seSBtb2R1bGVzIGZyb20gc2hhcmVkIG1vZHVsZXNcbnNoYXJlZC5wbGF5ZXJJZEZvckNvbm4gPSBwbGF5ZXJJZEZvckNvbm47XG5zaGFyZWQuY2FsbE9uQ2hhbmdlID0gY2FsbE9uQ2hhbmdlO1xuc2hhcmVkLmNhbGxPblN1Ym1pdCA9IGNhbGxPblN1Ym1pdDtcbiIsImNvbnN0IGdhbWVMb2JieUxvY2sgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvYmJ5TG9jaztcbiIsIi8vIHNoYXJlZE5hbWVzcGFjZSBpcyB1c2VkIGZvciBiZWluZyBhYmxlIHRvIGxvYWRpbmcgZmlsZXMgb24gY2xpZW50IG9yIHNlcnZlclxuLy8gZXhjbHVzaXZlbHksIGZyb20gZmlsZXMgd2hpY2ggYXJlIHRoZW1zZWx2ZXMgc2hhcmVkLlxuXG5jb25zdCBzaGFyZWROYW1lc3BhY2UgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgc2hhcmVkTmFtZXNwYWNlO1xuIiwiaW1wb3J0IHsgQmF0Y2hlcyB9IGZyb20gXCIuL2JhdGNoZXMvYmF0Y2hlcy5qc1wiO1xuaW1wb3J0IHsgRmFjdG9ycyB9IGZyb20gXCIuL2ZhY3RvcnMvZmFjdG9ycy5qc1wiO1xuaW1wb3J0IHsgR2FtZUxvYmJpZXMgfSBmcm9tIFwiLi9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzLmpzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuL2dhbWVzL2dhbWVzLmpzXCI7XG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi9sb2JieS1jb25maWdzL2xvYmJ5LWNvbmZpZ3MuanNcIjtcbmltcG9ydCB7IFBsYXllcklucHV0cyB9IGZyb20gXCIuL3BsYXllci1pbnB1dHMvcGxheWVyLWlucHV0cy5qc1wiO1xuaW1wb3J0IHsgUGxheWVyUm91bmRzIH0gZnJvbSBcIi4vcGxheWVyLXJvdW5kcy9wbGF5ZXItcm91bmRzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJTdGFnZXMgfSBmcm9tIFwiLi9wbGF5ZXItc3RhZ2VzL3BsYXllci1zdGFnZXMuanNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi9wbGF5ZXJzL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IFJvdW5kcyB9IGZyb20gXCIuL3JvdW5kcy9yb3VuZHMuanNcIjtcbmltcG9ydCB7IFN0YWdlcyB9IGZyb20gXCIuL3N0YWdlcy9zdGFnZXMuanNcIjtcbmltcG9ydCB7IFRyZWF0bWVudHMgfSBmcm9tIFwiLi90cmVhdG1lbnRzL3RyZWF0bWVudHMuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNvbGxlY3Rpb25zID0gW1xuICBCYXRjaGVzLFxuICBGYWN0b3JzLFxuICBHYW1lTG9iYmllcyxcbiAgR2FtZXMsXG4gIExvYmJ5Q29uZmlncyxcbiAgUGxheWVySW5wdXRzLFxuICBQbGF5ZXJSb3VuZHMsXG4gIFBsYXllclN0YWdlcyxcbiAgUGxheWVycyxcbiAgUm91bmRzLFxuICBTdGFnZXMsXG4gIFRyZWF0bWVudHNcbl07XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCBpbmZsZWN0aW9uIGZyb20gXCJpbmZsZWN0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCBJZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IEFyY2hpdmVkU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGFyY2hpdmVkQnlJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgIGF1dG9WYWx1ZSgpIHtcbiAgICAgIGlmICh0aGlzLmZpZWxkKFwiYXJjaGl2ZWRBdFwiKS5pc1NldCkge1xuICAgICAgICByZXR1cm4gdGhpcy51c2VySWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSxcbiAgYXJjaGl2ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgbGFiZWw6IFwiQXJjaGl2ZWQgYXRcIixcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IERlYnVnTW9kZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkZWJ1Z01vZGU6IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHRWYWx1ZTogZmFsc2VcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBUaW1lc3RhbXBTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBsYWJlbDogXCJDcmVhdGVkIGF0XCIsXG4gICAgLy8gZGVueVVwZGF0ZTogdHJ1ZSxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBhdXRvVmFsdWUoKSB7XG4gICAgICBpZiAodGhpcy5pc0luc2VydCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pc1Vwc2VydCkge1xuICAgICAgICByZXR1cm4geyAkc2V0T25JbnNlcnQ6IG5ldyBEYXRlKCkgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudW5zZXQoKTsgLy8gUHJldmVudCB1c2VyIGZyb20gc3VwcGx5aW5nIHRoZWlyIG93biB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdXBkYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBsYWJlbDogXCJMYXN0IHVwZGF0ZWQgYXRcIixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAvLyBkZW55SW5zZXJ0OiB0cnVlLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGF1dG9WYWx1ZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbi8vIFVzZXJmdWwgZm9yIGFkbWluIG9wZXJhdGlvbnMsIHRyYWNraW5nIHdobyBjcmVhdGVkIHdoYXQuXG5leHBvcnQgY29uc3QgQ3JlYXRvclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBjcmVhdGVkQnlJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBsYWJlbDogXCJDcmVhdGVkIGJ5XCIsXG4gICAgLy8gZGVueVVwZGF0ZTogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgIGF1dG9WYWx1ZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzSW5zZXJ0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2V0ICYmIHRoaXMuaXNGcm9tVHJ1c3RlZENvZGUgPyB1bmRlZmluZWQgOiB0aGlzLnVzZXJJZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICBpbmRleDogdHJ1ZVxuICB9LFxuICB1cGRhdGVkQnlJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBsYWJlbDogXCJMYXN0IHVwZGF0ZWQgYnlcIixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgIGF1dG9WYWx1ZSgpIHtcbiAgICAgIGlmICh0aGlzLmlzVXBkYXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzZXJJZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluZGV4OiB0cnVlXG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgVXNlckRhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZGF0YToge1xuICAgIHR5cGU6IE9iamVjdCxcbiAgICBibGFja2JveDogdHJ1ZSxcbiAgICBkZWZhdWx0VmFsdWU6IHt9XG4gIH1cbn0pO1xuXG4vLyBUaGUgUG9seW1vcnBoaWNTY2hlbWEgYWxsb3dzIHRvIGhhdmUgcmVjb3JkcyBiZSBhdHRhY2hlZCB0byBkaWZmZXJlbnRcbi8vIHR5cGVzIG9mIGNvbGxlY3Rpb24uIChiZWxvbmdzX3RvIDpjb2xsLCBwb2x5bW9ycGhpYzogdHJ1ZSlcbi8vIG9iamVjdFR5cGUgYW5kIG9iamVjdElkIHBvaW50IHRvIHRoZSBvd25pbmcgb2JqZWN0IG9mIHRoZSByZWNvcmRcbi8vIG9iamVjdFR5cGVzIGFyZSB0aGUgbmFtZXMgb2YgdGhlIGNvbGxlY3Rpb24gdGhhdCB0aGUgcmVjb3JkIGNhbiBiZVxuLy8gYXNzb2NpYXRlZCB3aXRoLiBleC4gW1wiQnJpZWZTZWN0aW9uXCIsIFwiQnJpZWZcIiwgXCJCb2FyZFwiXVxuZXhwb3J0IGNvbnN0IFBvbHltb3JwaGljU2NoZW1hID0gZnVuY3Rpb24oY29sbFR5cGVzKSB7XG4gIHJldHVybiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBvYmplY3RUeXBlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBhbGxvd2VkVmFsdWVzOiBjb2xsVHlwZXMsXG4gICAgICAvLyBkZW55VXBkYXRlOiB0cnVlLFxuICAgICAgaW5kZXg6IHRydWVcbiAgICB9LFxuICAgIG9iamVjdElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgICAgLy8gZGVueVVwZGF0ZTogdHJ1ZSxcbiAgICAgIGluZGV4OiB0cnVlXG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBIYXNNYW55QnlSZWYgPSBmdW5jdGlvbihjb2xsKSB7XG4gIGNvbnN0IGNhbWVsID0gaW5mbGVjdGlvbi5jYW1lbGl6ZShpbmZsZWN0aW9uLnNpbmd1bGFyaXplKGNvbGwpLCB0cnVlKTtcbiAgY29uc3QgbGFiZWwgPSBpbmZsZWN0aW9uLnRpdGxlaXplKGNvbGwpO1xuICBjb25zdCBmaWVsZE5hbWUgPSBgJHtjYW1lbH1JZHNgO1xuICByZXR1cm4gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgW2ZpZWxkTmFtZV06IHtcbiAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgZGVmYXVsdFZhbHVlOiBbXSxcbiAgICAgIGxhYmVsLFxuICAgICAgaW5kZXg6IHRydWVcbiAgICB9LFxuICAgIFtgJHtmaWVsZE5hbWV9LiRgXToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICAgIGxhYmVsOiBgJHtsYWJlbH0gSXRlbWBcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEJlbG9uZ3NUbyA9IGZ1bmN0aW9uKGNvbGwsIHJlcXVpcmVkID0gdHJ1ZSkge1xuICBjb25zdCBzaW5ndWxhciA9IGluZmxlY3Rpb24uc2luZ3VsYXJpemUoY29sbCk7XG4gIGNvbnN0IGNhbWVsID0gaW5mbGVjdGlvbi5jYW1lbGl6ZShzaW5ndWxhciwgdHJ1ZSk7XG4gIGNvbnN0IGxhYmVsID0gaW5mbGVjdGlvbi50aXRsZWl6ZShzaW5ndWxhcik7XG4gIGNvbnN0IGZpZWxkTmFtZSA9IGAke2NhbWVsfUlkYDtcbiAgcmV0dXJuIG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIFtmaWVsZE5hbWVdOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgICAgbGFiZWwsXG4gICAgICAvLyBkZW55VXBkYXRlLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICBvcHRpb25hbDogIXJlcXVpcmVkXG4gICAgfVxuICB9KTtcbn07XG4iLCIvLyBUaGlzIGZpbGUgaGFuZGxlcyBpbmRleCBjcmVhdGlvbi5cbi8vXG4vLyBZb3UgY2FuIGFkZCBtYW51YWwgaW5kZXhlcyBiZWxvdyBpbiB0aGUgTWV0ZW9yLnN0YXJ0dXAgY2FsbGJhY2suIEJ1dCBpdCBpc1xuLy8gZmlyc3QgcmVjb21tZW5kZWQgdG8gdHJ5IGFuZCBhZGQgdGhlIGluZGV4ZXMgZGlyZWN0bHkgdG8gdGhlIHNjaGVtYXMuXG4vL1xuLy8gRHVlIHRvIGNpcmN1bGFyIHJlZmVyZW5jZXMgaW4gdGhlIHNjaGVtYXMsIHRoZSBzY2hlbWFzIGFyZSBub3QgYWx3YXlzIGFsbFxuLy8gY29tcG9zZWQgYmVmb3JlIFNpbXBsZVNjaGVtYSdzIGF0dGVtcHQgdG8gY3JlYXRlIGluZGV4ZXMuIFRoZXJlZm9yIHdlXG4vLyBzb21ldGltZXMgZW5kIHVwIG1pc3Npbmcgc29tZSBpbmRleGVzLiBUaGUgbG9vcCBvdmVyIGFsbCBjb2xsZWNpdG9ucyBiZWxvd1xuLy8gaXMgdHJ5aW5nIHRvIHJlbWVkeSB0aGlzIHByb2JsZW0gYnkgcnVubmluZyBpbmRleCBjcmVhdGlvbiBhZnRlciBhIGRlbGF5LlxuLy9cblxuaW1wb3J0IGluZmxlY3Rpb24gZnJvbSBcImluZmxlY3Rpb25cIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4uL2xpYi9sb2cuanNcIjtcbmltcG9ydCB7IGNvbGxlY3Rpb25zIH0gZnJvbSBcIi4vY29sbGVjdGlvbnMuanNcIjtcblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAvLyBBZGQgbWFudWFsIGluZGV4ZXMgaGVyZS4gRXhhbXBsZTpcbiAgLy9cbiAgLy8gQmF0Y2hlcy5yYXdDb2xsZWN0aW9uKCkuY3JlYXRlSW5kZXgoe1xuICAvLyAgIFwiZmllbGRuYW1lXCI6IDFcbiAgLy8gfSwgeyB1bmlxdWU6IHRydWUgfSlcblxuICAvL1xuICAvLyBUaGUgZm9sbG93aW5nIGxvb3Agd2lsbCB0cnkgdG8gYWRkIGluZGV4ZXMgbWFya2VkIGluIHRoZSBTY2hlbWFzXG4gIC8vXG5cbiAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGNvbGxlY3Rpb25zLmZvckVhY2goY29sbCA9PiB7XG4gICAgICBpZiAoIWNvbGwuc2NoZW1hKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGluZmxlY3Rpb24udGl0bGVpemUoY29sbC5fbmFtZSk7XG4gICAgICAgIGxvZy5kZWJ1ZyhcIkFkZGluZyBpbmRleGVzIHRvXCIsIG5hbWUpO1xuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbGwuc2NoZW1hLl9zY2hlbWEpIHtcbiAgICAgICAgICBpZiAoY29sbC5zY2hlbWEuX3NjaGVtYS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBkZWYgPSBjb2xsLnNjaGVtYS5fc2NoZW1hW2tleV07XG5cbiAgICAgICAgICAgIGNvbnN0IGRlc2MgPSBgXCIke25hbWV9XCIg4oCTIHsgJHtrZXl9OiB7IGluZGV4OiAke2RlZi5pbmRleH0gfSB9YDtcblxuICAgICAgICAgICAgLy8gTm8gaW5kZXggd2FudGVkXG4gICAgICAgICAgICBpZiAoZGVmLmluZGV4ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdhbnRpbmcgaW5kZXggdG8gYmUgcmVtb3ZlZCwgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgaWYgKGRlZi5pbmRleCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgbG9nLndhcm4oYHsgaW5kZXg6IGZhbHNlIH0gbm90IHN1cHBvcnRlZCBvbiAke2Rlc2N9YCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBPbmx5IDEsIC0xIGFuZCB0cnVlIHZhbHVlcyBzdXBwb3J0ZWRcbiAgICAgICAgICAgIGlmICghKGRlZi5pbmRleCA9PT0gdHJ1ZSB8fCBkZWYuaW5kZXggPT09IDEgfHwgZGVmLmluZGV4ID09PSAtMSkpIHtcbiAgICAgICAgICAgICAgbG9nLndhcm4oYHVua25vd24gaW5kZXggdmFsdWUgb24gJHtkZXNjfWApO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIG9wdHMgc3VwcG9ydGVkIGJ5IFNpbXBsZVNjaGVtYTppbmRleFxuICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHt9O1xuICAgICAgICAgICAgaWYgKGRlZi5zcGFyc2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5zcGFyc2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRlZi51bmlxdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgb3B0cy51bmlxdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB7fTtcbiAgICAgICAgICAgIHN3aXRjaCAoZGVmLmluZGV4KSB7XG4gICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIGluZGV4ID0geyBba2V5XTogMSB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgICAgIGluZGV4ID0geyBba2V5XTogLTEgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbG9nLmRlYnVnKFxuICAgICAgICAgICAgICBgICAtIGNyZWF0ZUluZGV4KCR7SlNPTi5zdHJpbmdpZnkoaW5kZXgpfSwgJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICBvcHRzXG4gICAgICAgICAgICAgICl9KWBcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbGwucmF3Q29sbGVjdGlvbigpLmNyZWF0ZUluZGV4KGluZGV4LCBvcHRzLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVyciAmJiBlcnIuY29kZU5hbWUgIT09IFwiSW5kZXhPcHRpb25zQ29uZmxpY3RcIikge1xuICAgICAgICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgICAgICAgIGBjYW4ndCBjcmVhdGUgaW5kZXg6ICR7bmFtZX0vJHtKU09OLnN0cmluZ2lmeShpbmRleCl9LiAke2Vycn1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICB9KTtcbiAgfSwgMTAwMCk7XG59KTtcbiIsImltcG9ydCBDb2xsZWN0aW9uMiBmcm9tIFwibWV0ZW9yL2FsZGVlZDpjb2xsZWN0aW9uMlwiO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tIFwic2ltcGwtc2NoZW1hXCI7XG5cbi8vIE11c3QgYmUgdW5pcXVlIHNjb3BlZCBieSBvdGhlciBmaWVsZCAoZm9yIGdpdmVuIHZhbHVlIG9mIHBhc3NlZCBmaWVsZCxcbi8vIFRoZSBjdXJyZW50IGZpZWxkIHNob3VsZCBiZSB1bmlxdWUpLiBGb3IgZXg6XG4vLyAgIE5hbWU6IHtcbi8vICAgICBUeXBlOiBTdHJpbmcsXG4vLyAgICAgU2NvcGVkVW5pcXVlOiBcIm9yZ0lkXCJcbi8vICAgfVxuLy8gTmFtZSBtdXN0IGJlIHVuaXF1ZSBmb3IgZG9jdW1lbnQgd2l0aCBlcXVhbCBvcmdJZC5cbi8vIERvY3VtZW50cyB3aXRoIGRpZmZlcmVudCBvcmdJZCBjYW4gaGF2ZSBzYW1lIG5hbWUuXG5TaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyhbXCJzY29wZWRVbmlxdWVcIl0pO1xuXG5Db2xsZWN0aW9uMi5vbihcInNjaGVtYS5hdHRhY2hlZFwiLCAoY29sbGVjdGlvbiwgc3MpID0+IHtcbiAgaWYgKHNzLnZlcnNpb24gPj0gMikge1xuICAgIHNzLm1lc3NhZ2VCb3gubWVzc2FnZXMoe1xuICAgICAgc2NvcGVkVW5pcXVlOiBcIkFscmVhZHkgZXhpc3RzXCJcbiAgICB9KTtcbiAgfVxuXG4gIHNzLmFkZFZhbGlkYXRvcihmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuaXNTZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkZWYgPSB0aGlzLmRlZmluaXRpb247XG4gICAgY29uc3QgdW5pcXVlRmllbGRTY29wZSA9IGRlZi5zY29wZWRVbmlxdWU7XG5cbiAgICBpZiAoIXVuaXF1ZUZpZWxkU2NvcGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB2YWwgPSB0aGlzLmZpZWxkKHVuaXF1ZUZpZWxkU2NvcGUpLnZhbHVlO1xuICAgIGNvbnN0IGtleSA9IHRoaXMua2V5O1xuICAgIGlmIChcbiAgICAgIGNvbGxlY3Rpb25cbiAgICAgICAgLmZpbmQoe1xuICAgICAgICAgIFt1bmlxdWVGaWVsZFNjb3BlXTogdmFsLFxuICAgICAgICAgIFtrZXldOiB0aGlzLnZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIC5jb3VudCgpID4gMFxuICAgICkge1xuICAgICAgcmV0dXJuIFwidW5pcXVlU2NvcGVkXCI7XG4gICAgfVxuICB9KTtcbn0pO1xuXG4vLyBFeHRlbmQgdGhlIHNjaGVtYSBvcHRpb25zIGFsbG93ZWQgYnkgU2ltcGxlU2NoZW1hXG5TaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyhbXCJkZW55SW5zZXJ0XCIsIFwiZGVueVVwZGF0ZVwiXSk7XG5cbkNvbGxlY3Rpb24yLm9uKFwic2NoZW1hLmF0dGFjaGVkXCIsIChjb2xsZWN0aW9uLCBzcykgPT4ge1xuICBpZiAoXG4gICAgc3MudmVyc2lvbiA+PSAyICYmXG4gICAgc3MubWVzc2FnZUJveCAmJlxuICAgIHR5cGVvZiBzcy5tZXNzYWdlQm94Lm1lc3NhZ2VzID09PSBcImZ1bmN0aW9uXCJcbiAgKSB7XG4gICAgc3MubWVzc2FnZUJveC5tZXNzYWdlcyh7XG4gICAgICBlbjoge1xuICAgICAgICBpbnNlcnROb3RBbGxvd2VkOiBcInt7bGFiZWx9fSBjYW5ub3QgYmUgc2V0IGR1cmluZyBhbiBpbnNlcnRcIixcbiAgICAgICAgdXBkYXRlTm90QWxsb3dlZDogXCJ7e2xhYmVsfX0gY2Fubm90IGJlIHNldCBkdXJpbmcgYW4gdXBkYXRlXCJcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNzLmFkZFZhbGlkYXRvcihmdW5jdGlvbiBzY2hlbWFEZW55VmFsaWRhdG9yKCkge1xuICAgIGlmICghdGhpcy5pc1NldCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGVmID0gdGhpcy5kZWZpbml0aW9uO1xuXG4gICAgaWYgKGRlZi5kZW55SW5zZXJ0ICYmIHRoaXMuaXNJbnNlcnQpIHJldHVybiBcImluc2VydE5vdEFsbG93ZWRcIjtcbiAgICBpZiAoZGVmLmRlbnlVcGRhdGUgJiYgKHRoaXMuaXNVcGRhdGUgfHwgdGhpcy5pc1Vwc2VydCkpXG4gICAgICByZXR1cm4gXCJ1cGRhdGVOb3RBbGxvd2VkXCI7XG4gIH0pO1xufSk7XG5cbi8vIEV4dGVuZCB0aGUgc2NoZW1hIG9wdGlvbnMgYWxsb3dlZCBieSBTaW1wbGVTY2hlbWFcblNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKFtcbiAgXCJpbmRleFwiLCAvLyBvbmUgb2YgTnVtYmVyLCBTdHJpbmcsIEJvb2xlYW5cbiAgXCJ1bmlxdWVcIiwgLy8gQm9vbGVhblxuICBcInNwYXJzZVwiIC8vIEJvb2xlYW5cbl0pO1xuIiwiLy8gVGhpcyBzaG91bGQgY29udGFpbiBhZG1pbiB0b3AgbGV2ZWwgdHlwZSBvcGVyYXRpb25zIGxpa2UgcmVzZXR0aW5nIHRoZSBEQlxuLy8gb3IgcGVyZm9ybWluZyBvdGhlciBncmFuZCBvcGVyYXRpb25zLiBVc2Ugd2l0aCBleHRyZW1lIGNhdXRpb24uXG5pbXBvcnQgeWFtbCBmcm9tIFwianMteWFtbFwiO1xuXG5pbXBvcnQgeyBUcmVhdG1lbnRzIH0gZnJvbSBcIi4uLy4uL2FwaS90cmVhdG1lbnRzL3RyZWF0bWVudHMuanNcIjtcbmltcG9ydCB7IEZhY3RvcnMgfSBmcm9tIFwiLi4vLi4vYXBpL2ZhY3RvcnMvZmFjdG9ycy5qc1wiO1xuaW1wb3J0IHsgRmFjdG9yVHlwZXMgfSBmcm9tIFwiLi4vLi4vYXBpL2ZhY3Rvci10eXBlcy9mYWN0b3ItdHlwZXMuanNcIjtcbmltcG9ydCB7IExvYmJ5Q29uZmlncyB9IGZyb20gXCIuLi8uLi9hcGkvbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBib290c3RyYXAgfSBmcm9tIFwiLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvYm9vdHN0cmFwLmpzXCI7XG5pbXBvcnQgbG9nIGZyb20gXCIuLi8uLi9saWIvbG9nLmpzXCI7XG5cbmNvbnN0IHVzZXJDb2xscyA9IFtcIm1ldGVvcl9hY2NvdW50c19sb2dpblNlcnZpY2VDb25maWd1cmF0aW9uXCIsIFwidXNlcnNcIl07XG5jb25zdCBrZWVwUGFydGlhbCA9IFtcInRyZWF0bWVudHNcIiwgXCJmYWN0b3JzXCIsIFwiZmFjdG9yX3R5cGVzXCIsIFwibG9iYnlfY29uZmlnc1wiXTtcbmNvbnN0IGRlbGV0ZUNvbGxzID0gW1xuICBcImdhbWVfbG9iYmllc1wiLFxuICBcInBsYXllcl9pbnB1dHNcIixcbiAgXCJiYXRjaGVzXCIsXG4gIFwicm91bmRzXCIsXG4gIFwiY291bnRlcnNcIixcbiAgXCJnYW1lc1wiLFxuICBcInBsYXllcl9yb3VuZHNcIixcbiAgXCJwbGF5ZXJzXCIsXG4gIFwicGxheWVyX3N0YWdlc1wiLFxuICBcInBsYXllcl9sb2dzXCIsXG4gIFwic3RhZ2VzXCJcbl0uY29uY2F0KGtlZXBQYXJ0aWFsKTtcblxuY29uc3QgbG9jYWxUeXBlRm9ySW1wb3J0ZWQgPSBkYXRhID0+IHtcbiAgcmV0dXJuIGZhY3RvclR5cGVJZCA9PiB7XG4gICAgY29uc3QgaW1wb3J0ZWRUeXBlID0gZGF0YS5mYWN0b3JUeXBlcy5maW5kKHQgPT4gdC5faWQgPT09IGZhY3RvclR5cGVJZCk7XG4gICAgaWYgKCFpbXBvcnRlZFR5cGUpIHtcbiAgICAgIGxvZy53YXJuKFwiY291bGQgbm90IGZpbmQgY29ycmVzcG9uZGluZyBmYWN0b3JUeXBlSWRcIiwgZmFjdG9yVHlwZUlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IEZhY3RvclR5cGVzLmZpbmRPbmUoeyBuYW1lOiBpbXBvcnRlZFR5cGUubmFtZSB9KTtcbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIGxvZy53YXJuKFwiY291bGQgbm90IGltcG9ydCBmYWN0b3IgdHlwZSwgbm8gY29ycmVwb25kaW5nIHR5cGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGUuX2lkO1xuICB9O1xufTtcblxuY29uc3QgbG9jYWxGYWN0b3JGb3JJbXBvcnRlZCA9IGRhdGEgPT4ge1xuICByZXR1cm4gZmFjdG9ySWQgPT4ge1xuICAgIGNvbnN0IGltcG9ydGVkRmFjdG9yID0gZGF0YS5mYWN0b3JzLmZpbmQodCA9PiB0Ll9pZCA9PT0gZmFjdG9ySWQpO1xuICAgIGlmICghaW1wb3J0ZWRGYWN0b3IpIHtcbiAgICAgIGxvZy53YXJuKFwiY291bGQgbm90IGltcG9ydCBmYWN0b3IsIG5vIGNvcnJlcG9uZGluZyBpbXBvcnRlZCBmYWN0b3JcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHsgdmFsdWUsIGZhY3RvclR5cGVJZDogaW1wb3J0ZWRGYWN0b3JUeXBlSWQgfSA9IGltcG9ydGVkRmFjdG9yO1xuXG4gICAgY29uc3QgZmFjdG9yVHlwZUlkID0gbG9jYWxUeXBlRm9ySW1wb3J0ZWQoZGF0YSkoaW1wb3J0ZWRGYWN0b3JUeXBlSWQpO1xuICAgIGlmICghZmFjdG9yVHlwZUlkKSB7XG4gICAgICBsb2cud2FybihcImNvdWxkIG5vdCBjb252ZXJ0IGZhY3RvciB0eXBlc1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yID0gRmFjdG9ycy5maW5kT25lKHsgdmFsdWUsIGZhY3RvclR5cGVJZCB9KTtcbiAgICBpZiAoIWZhY3Rvcikge1xuICAgICAgbG9nLndhcm4oXCJjb3VsZCBub3QgaW1wb3J0IGZhY3Rvciwgbm8gY29ycmVwb25kaW5nIGZhY3RvclwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFjdG9yLl9pZDtcbiAgfTtcbn07XG5cbmNvbnN0IGFyY2hpdmVkVXBkYXRlID0gKGFyY2hpdmVkQXQsIGV4aXN0aW5nQXJjaGl2ZWRBdCkgPT5cbiAgISFhcmNoaXZlZEF0ID09PSAhIWV4aXN0aW5nQXJjaGl2ZWRBdFxuICAgID8gbnVsbFxuICAgIDogYXJjaGl2ZWRBdFxuICAgID8geyAkc2V0OiB7IGFyY2hpdmVkQXQ6IG5ldyBEYXRlKCkgfSB9XG4gICAgOiB7ICR1bnNldDogeyBhcmNoaXZlZEF0OiB0cnVlLCBhcmNoaXZlZEJ5SWQ6IHRydWUgfSB9O1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIGFkbWluSW1wb3J0Q29uZmlndXJhdGlvbih7IHRleHQgfSkge1xuICAgIGxvZy5kZWJ1ZyhcIkltcG9ydCBzdGFydGluZy5cIik7XG4gICAgY29uc3QgZGF0YSA9IHlhbWwuc2FmZUxvYWQodGV4dCk7XG4gICAgY29uc3QgY29udmVydEZhY3RvclR5cGVJZCA9IGxvY2FsVHlwZUZvckltcG9ydGVkKGRhdGEpO1xuICAgIGNvbnN0IGNvbnZlcnRGYWN0b3JJZCA9IGxvY2FsRmFjdG9yRm9ySW1wb3J0ZWQoZGF0YSk7XG5cbiAgICAoZGF0YS5mYWN0b3JUeXBlcyB8fCBbXSkuZm9yRWFjaChmID0+IHtcbiAgICAgIGNvbnN0IHsgYXJjaGl2ZWRBdCwgbmFtZSB9ID0gZjtcbiAgICAgIGNvbnN0IGV4aXN0cyA9IEZhY3RvclR5cGVzLmZpbmRPbmUoeyBuYW1lIH0pO1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICBsb2cuZGVidWcoXCJleGlzdHMgRmFjdG9yVHlwZXNcIik7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gYXJjaGl2ZWRVcGRhdGUoYXJjaGl2ZWRBdCwgZXhpc3RzLmFyY2hpdmVkQXQpO1xuICAgICAgICBpZiAocXVlcnkpIHtcbiAgICAgICAgICBGYWN0b3JUeXBlcy51cGRhdGUoZXhpc3RzLl9pZCwgcXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxvZy5kZWJ1ZyhcIm5ldyBGYWN0b3JUeXBlc1wiKTtcbiAgICAgIEZhY3RvclR5cGVzLmluc2VydChmKTtcbiAgICB9KTtcblxuICAgIChkYXRhLmZhY3RvcnMgfHwgW10pLmZvckVhY2goZiA9PiB7XG4gICAgICBjb25zdCB7IGZhY3RvclR5cGVJZDogaW1wb3J0ZWRGYWN0b3JUeXBlSWQsIHZhbHVlIH0gPSBmO1xuICAgICAgY29uc3QgZmFjdG9yVHlwZUlkID0gY29udmVydEZhY3RvclR5cGVJZChpbXBvcnRlZEZhY3RvclR5cGVJZCk7XG4gICAgICBpZiAoIWZhY3RvclR5cGVJZCkge1xuICAgICAgICBsb2cuZGVidWcoXCJjb3VsZCBub3QgY29udmVydCBmYWN0b3JUeXBlSWRzXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBleGlzdHMgPSBGYWN0b3JzLmZpbmRPbmUoeyBmYWN0b3JUeXBlSWQsIHZhbHVlIH0pO1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICBsb2cuZGVidWcoXCJleGlzdHMgRmFjdG9yc1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFyYW1zID0geyAuLi5mLCBmYWN0b3JUeXBlSWQgfTtcbiAgICAgIGxvZy5kZWJ1ZyhcIm5ldyBGYWN0b3JzXCIsIHBhcmFtcyk7XG4gICAgICBGYWN0b3JzLmluc2VydChwYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgKGRhdGEudHJlYXRtZW50cyB8fCBbXSkuZm9yRWFjaCh0ID0+IHtcbiAgICAgIGNvbnN0IHsgYXJjaGl2ZWRBdCwgZmFjdG9ySWRzOiBpbXBvcnRlZEZhY3RvcklkcyB9ID0gdDtcbiAgICAgIGNvbnN0IGZhY3RvcklkcyA9IGltcG9ydGVkRmFjdG9ySWRzLm1hcChjb252ZXJ0RmFjdG9ySWQpO1xuICAgICAgaWYgKF8uY29tcGFjdChmYWN0b3JJZHMpLmxlbmd0aCAhPT0gaW1wb3J0ZWRGYWN0b3JJZHMubGVuZ3RoKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcImNvdWxkIG5vdCBjb252ZXJ0IGZhY3Rvcklkc1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhpc3RzID0gVHJlYXRtZW50cy5maW5kT25lKHsgZmFjdG9ySWRzIH0pO1xuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICBsb2cuZGVidWcoXCJleGlzdHMgVHJlYXRtZW50c1wiKTtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBhcmNoaXZlZFVwZGF0ZShhcmNoaXZlZEF0LCBleGlzdHMuYXJjaGl2ZWRBdCk7XG4gICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgIFRyZWF0bWVudHMudXBkYXRlKGV4aXN0cy5faWQsIHF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwYXJhbXMgPSB7IC4uLnQsIGZhY3RvcklkcyB9O1xuICAgICAgbG9nLmRlYnVnKFwibmV3IFRyZWF0bWVudHNcIiwgcGFyYW1zKTtcbiAgICAgIFRyZWF0bWVudHMuaW5zZXJ0KHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICAoZGF0YS5sb2JieUNvbmZpZ3MgfHwgW10pLmZvckVhY2gobCA9PiB7XG4gICAgICBjb25zdCBxdWVyeSA9IF8ucGljayhcbiAgICAgICAgbCxcbiAgICAgICAgXCJ0aW1lb3V0VHlwZVwiLFxuICAgICAgICBcInRpbWVvdXRJblNlY29uZHNcIixcbiAgICAgICAgXCJ0aW1lb3V0U3RyYXRlZ3lcIixcbiAgICAgICAgXCJ0aW1lb3V0Qm90c1wiLFxuICAgICAgICBcImV4dGVuZENvdW50XCJcbiAgICAgICk7XG4gICAgICBjb25zdCBleGlzdHMgPSBMb2JieUNvbmZpZ3MuZmluZE9uZShxdWVyeSk7XG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGxvZy5kZWJ1ZyhcImV4aXN0cyBMb2JieUNvbmZpZ3NcIik7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gYXJjaGl2ZWRVcGRhdGUobC5hcmNoaXZlZEF0LCBleGlzdHMuYXJjaGl2ZWRBdCk7XG4gICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgIExvYmJ5Q29uZmlncy51cGRhdGUoZXhpc3RzLl9pZCwgcXVlcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxvZy5kZWJ1ZyhcIm5ldyBMb2JieUNvbmZpZ3NcIik7XG4gICAgICBMb2JieUNvbmZpZ3MuaW5zZXJ0KGwpO1xuICAgIH0pO1xuXG4gICAgbG9nLmRlYnVnKFwiSW1wb3J0IGRvbmUuXCIpO1xuICB9LFxuXG4gIGFkbWluRXhwb3J0Q29uZmlndXJhdGlvbigpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmF1dGhvcml6ZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3Qgb3V0ID0ge1xuICAgICAgdHJlYXRtZW50czogW10sXG4gICAgICBmYWN0b3JUeXBlczogW10sXG4gICAgICBmYWN0b3JzOiBbXSxcbiAgICAgIGxvYmJ5Q29uZmlnczogW11cbiAgICB9O1xuXG4gICAgY29uc3QgdHJlYXRtZW50cyA9IFRyZWF0bWVudHMuZmluZCgpLmZldGNoKCk7XG4gICAgdHJlYXRtZW50cy5mb3JFYWNoKHQgPT5cbiAgICAgIG91dC50cmVhdG1lbnRzLnB1c2goXy5waWNrKHQsIFwibmFtZVwiLCBcImZhY3Rvcklkc1wiLCBcImFyY2hpdmVkQXRcIikpXG4gICAgKTtcblxuICAgIGNvbnN0IGZhY3RvclR5cGVzID0gRmFjdG9yVHlwZXMuZmluZCgpLmZldGNoKCk7XG4gICAgZmFjdG9yVHlwZXMuZm9yRWFjaCh0ID0+XG4gICAgICBvdXQuZmFjdG9yVHlwZXMucHVzaChcbiAgICAgICAgXy5waWNrKFxuICAgICAgICAgIHQsXG4gICAgICAgICAgXCJfaWRcIixcbiAgICAgICAgICBcIm5hbWVcIixcbiAgICAgICAgICBcImRlc2NyaXB0aW9uXCIsXG4gICAgICAgICAgXCJyZXF1aXJlZFwiLFxuICAgICAgICAgIFwidHlwZVwiLFxuICAgICAgICAgIFwibWluXCIsXG4gICAgICAgICAgXCJtYXhcIixcbiAgICAgICAgICBcImFyY2hpdmVkQXRcIlxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IGZhY3RvcnMgPSBGYWN0b3JzLmZpbmQoKS5mZXRjaCgpO1xuICAgIGZhY3RvcnMuZm9yRWFjaChmID0+XG4gICAgICBvdXQuZmFjdG9ycy5wdXNoKFxuICAgICAgICBfLnBpY2soZiwgXCJfaWRcIiwgXCJuYW1lXCIsIFwidmFsdWVcIiwgXCJmYWN0b3JUeXBlSWRcIiwgXCJhcmNoaXZlZEF0XCIpXG4gICAgICApXG4gICAgKTtcblxuICAgIGNvbnN0IGxvYmJ5Q29uZmlncyA9IExvYmJ5Q29uZmlncy5maW5kKCkuZmV0Y2goKTtcbiAgICBsb2JieUNvbmZpZ3MuZm9yRWFjaChsID0+XG4gICAgICBvdXQubG9iYnlDb25maWdzLnB1c2goXG4gICAgICAgIF8ucGljayhcbiAgICAgICAgICBsLFxuICAgICAgICAgIFwibmFtZVwiLFxuICAgICAgICAgIFwidGltZW91dFR5cGVcIixcbiAgICAgICAgICBcInRpbWVvdXRJblNlY29uZHNcIixcbiAgICAgICAgICBcInRpbWVvdXRTdHJhdGVneVwiLFxuICAgICAgICAgIFwidGltZW91dEJvdHNcIixcbiAgICAgICAgICBcImV4dGVuZENvdW50XCIsXG4gICAgICAgICAgXCJiYWN0aElkc1wiLFxuICAgICAgICAgIFwiZ2FtZUxvYmJ5SWRzXCIsXG4gICAgICAgICAgXCJhcmNoaXZlZEF0XCJcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgICByZXR1cm4geWFtbC5zYWZlRHVtcChvdXQpO1xuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc0RldmVsb3BtZW50IHx8IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuZGVidWdfcmVzZXREYXRhYmFzZSkge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgYWRtaW5SZXNldERCKHBhcnRpYWwpIHtcbiAgICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZHJpdmVyID0gTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoKTtcbiAgICAgIGNvbnN0IGRiID0gZHJpdmVyLm1vbmdvLmRiO1xuXG4gICAgICBkYi5saXN0Q29sbGVjdGlvbnMoKS50b0FycmF5KFxuICAgICAgICBNZXRlb3IuYmluZEVudmlyb25tZW50KChlcnIsIGNvbGxzKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb2xscyA9IF8uc29ydEJ5KGNvbGxzLCBjID0+IChjLm5hbWUgPT09IFwicGxheWVyc1wiID8gMCA6IDEpKTtcbiAgICAgICAgICBjb2xscy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgICAgICAgaWYgKCFkZWxldGVDb2xscy5pbmNsdWRlcyhjb2xsZWN0aW9uLm5hbWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJ0aWFsICYmIGtlZXBQYXJ0aWFsLmluY2x1ZGVzKGNvbGxlY3Rpb24ubmFtZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY29sbCA9IGRyaXZlci5vcGVuKGNvbGxlY3Rpb24ubmFtZSk7XG4gICAgICAgICAgICBjb2xsLnJhd0NvbGxlY3Rpb24oKS5kcm9wKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkYi5saXN0Q29sbGVjdGlvbnMoKS50b0FycmF5KFxuICAgICAgICAgICAgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZXJyLCBjb2xscykgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxvZy5kZWJ1ZyhcIktlZXBpbmc6XCIpO1xuICAgICAgICAgICAgICBjb2xscy5mb3JFYWNoKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgICAgICAgICAgIGxldCBleHRyYSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHVzZXJDb2xscy5pbmNsdWRlcyhjb2xsZWN0aW9uLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICBleHRyYSA9IFwiKHVzZWQgYnkgYWRtaW4gbG9naW4gc3lzdGVtKVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCIgLSBcIiArIGNvbGxlY3Rpb24ubmFtZSwgZXh0cmEpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBsb2cuZGVidWcoXCJDbGVhcmVkIERCXCIpO1xuXG4gICAgICAgICAgICAgIGJvb3RzdHJhcCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH0pO1xufVxuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7fSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgc3RhdHVzU2NoZW1hIH0gZnJvbSBcIi4vc3RhdHVzLXNjaGVtYVwiO1xuaW1wb3J0IHtcbiAgQXJjaGl2ZWRTY2hlbWEsXG4gIFRpbWVzdGFtcFNjaGVtYSxcbiAgSGFzTWFueUJ5UmVmLFxuICBEZWJ1Z01vZGVTY2hlbWFcbn0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuLi90cmVhdG1lbnRzL3RyZWF0bWVudHNcIjtcbmltcG9ydCB7IENvdW50ZXIgfSBmcm9tIFwiLi4vLi4vbGliL2NvdW50ZXJzXCI7XG5cbmNsYXNzIEJhdGNoZXNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgZG9jLmluZGV4ID0gQ291bnRlci5pbmMoXCJiYXRjaGVzXCIpO1xuICAgIHJldHVybiBzdXBlci5pbnNlcnQoZG9jLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEJhdGNoZXMgPSBuZXcgQmF0Y2hlc0NvbGxlY3Rpb24oXCJiYXRjaGVzXCIpO1xuXG5CYXRjaGVzLmhlbHBlcnMoe1xuICBnYW1lQ291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzaWdubWVudCA9PT0gXCJzaW1wbGVcIlxuICAgICAgPyB0aGlzLnNpbXBsZUNvbmZpZy5jb3VudFxuICAgICAgOiB0aGlzLmNvbXBsZXRlR2FtZUNvdW50KCk7XG4gIH0sXG5cbiAgY29tcGxldGVHYW1lQ291bnQoKSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKFxuICAgICAgdGhpcy5jb21wbGV0ZUNvbmZpZy50cmVhdG1lbnRzLFxuICAgICAgKHN1bSwgdCkgPT4gc3VtICsgdC5jb3VudCxcbiAgICAgIDBcbiAgICApO1xuICB9LFxuXG4gIGR1cGxpY2F0ZSgpIHtcbiAgICBjb25zdCB7IGFzc2lnbm1lbnQsIHNpbXBsZUNvbmZpZywgY29tcGxldGVDb25maWcgfSA9IHRoaXM7XG4gICAgQmF0Y2hlcy5pbnNlcnQoe1xuICAgICAgYXNzaWdubWVudCxcbiAgICAgIHNpbXBsZUNvbmZpZyxcbiAgICAgIGNvbXBsZXRlQ29uZmlnLFxuICAgICAgc3RhdHVzOiBcImluaXRcIlxuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG1heEdhbWVzQ291bnQgPSAxMDAwMDAwMDtcblxuZXhwb3J0IGNvbnN0IGFzc2lnbm1lbnRUeXBlcyA9IHtcbiAgc2ltcGxlOiBcIlNpbXBsZVwiLFxuICBjb21wbGV0ZTogXCJDb21wbGV0ZVwiXG59O1xuXG5CYXRjaGVzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAvLyBBdXRvLWluY3JlbWVudGVkIG51bWJlciBhc3NpZ25lZCB0byBiYXRjaGVzIGFzIHRoZXkgYXJlIGNyZWF0ZWRcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlclxuICB9LFxuXG4gIGFzc2lnbm1lbnQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgLy8gXCJjdXN0b21cIiBub3QgeWV0IHN1cHBvcnRlZFxuICAgIGFsbG93ZWRWYWx1ZXM6IFtcInNpbXBsZVwiLCBcImNvbXBsZXRlXCIsIFwiY3VzdG9tXCJdXG4gIH0sXG5cbiAgZnVsbDoge1xuICAgIGxhYmVsOiBcIkJhdGNoIGlzIGZ1bGwsIGFsbCBnYW1lcyBhcmUgcnVubmluZ1wiLFxuICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgZGVmYXVsdFZhbHVlOiBmYWxzZVxuICB9LFxuXG4gIHJ1bm5pbmdBdDoge1xuICAgIGxhYmVsOiBcIlRpbWUgd2hlbiBiYXRjaCBzdGFydGVkIHJ1bm5pbmdcIixcbiAgICB0eXBlOiBEYXRlLFxuICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG5cbiAgZmluaXNoZWRBdDoge1xuICAgIGxhYmVsOiBcIlRpbWUgd2hlbiBiYXRjaCBmaW5pc2hlZCBydW5uaW5nXCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuXG4gIC8vIFNpbXBsZSBjb25maWd1cmF0aW9uIGF0IGluaXRcbiAgc2ltcGxlQ29uZmlnOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGN1c3RvbSgpIHtcbiAgICAgIGlmICghdGhpcy52YWx1ZSAmJiB0aGlzLmZpZWxkKFwiYXNzaWdubWVudFwiKS52YWx1ZSA9PT0gXCJzaW1wbGVcIikge1xuICAgICAgICByZXR1cm4gXCJyZXF1aXJlZFwiO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJzaW1wbGVDb25maWcuY291bnRcIjoge1xuICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IG1heEdhbWVzQ291bnRcbiAgfSxcbiAgXCJzaW1wbGVDb25maWcudHJlYXRtZW50c1wiOiB7XG4gICAgdHlwZTogQXJyYXksXG4gICAgbWluQ291bnQ6IDEsXG4gICAgbWF4Q291bnQoKSB7XG4gICAgICByZXR1cm4gVHJlYXRtZW50cy5maW5kKCkuY291bnQoKTtcbiAgICB9XG4gIH0sXG4gIFwic2ltcGxlQ29uZmlnLnRyZWF0bWVudHMuJFwiOiB7XG4gICAgdHlwZTogT2JqZWN0XG4gIH0sXG4gIFwic2ltcGxlQ29uZmlnLnRyZWF0bWVudHMuJC5faWRcIjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gIH0sXG4gIFwic2ltcGxlQ29uZmlnLnRyZWF0bWVudHMuJC5sb2JieUNvbmZpZ0lkXCI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9LFxuXG4gIC8vIENvbXBsZXRlIGNvbmZpZ3VyYXRpb24gYXQgaW5pdFxuICBjb21wbGV0ZUNvbmZpZzoge1xuICAgIHR5cGU6IE9iamVjdCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBjdXN0b20oKSB7XG4gICAgICBpZiAoIXRoaXMudmFsdWUgJiYgdGhpcy5maWVsZChcImFzc2lnbm1lbnRcIikudmFsdWUgPT09IFwiY29tcGxldGVcIikge1xuICAgICAgICByZXR1cm4gXCJyZXF1aXJlZFwiO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJjb21wbGV0ZUNvbmZpZy50cmVhdG1lbnRzXCI6IHtcbiAgICB0eXBlOiBBcnJheSxcbiAgICBtaW5Db3VudDogMSxcbiAgICBtYXhDb3VudCgpIHtcbiAgICAgIHJldHVybiBUcmVhdG1lbnRzLmZpbmQoKS5jb3VudCgpO1xuICAgIH1cbiAgfSxcbiAgXCJjb21wbGV0ZUNvbmZpZy50cmVhdG1lbnRzLiRcIjoge1xuICAgIHR5cGU6IE9iamVjdFxuICB9LFxuICBcImNvbXBsZXRlQ29uZmlnLnRyZWF0bWVudHMuJC5faWRcIjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gIH0sXG4gIFwiY29tcGxldGVDb25maWcudHJlYXRtZW50cy4kLmNvdW50XCI6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBtaW5Db3VudDogMSxcbiAgICBtYXhDb3VudDogbWF4R2FtZXNDb3VudFxuICB9LFxuICBcImNvbXBsZXRlQ29uZmlnLnRyZWF0bWVudHMuJC5sb2JieUNvbmZpZ0lkXCI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc0RldmVsb3BtZW50IHx8IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuZGVidWdfZ2FtZURlYnVnTW9kZSkge1xuICBCYXRjaGVzLnNjaGVtYS5leHRlbmQoRGVidWdNb2RlU2NoZW1hKTtcbn1cblxuQmF0Y2hlcy5zY2hlbWEuZXh0ZW5kKHN0YXR1c1NjaGVtYSk7XG5CYXRjaGVzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcbkJhdGNoZXMuc2NoZW1hLmV4dGVuZChBcmNoaXZlZFNjaGVtYSk7XG5CYXRjaGVzLnNjaGVtYS5leHRlbmQoSGFzTWFueUJ5UmVmKFwiR2FtZXNcIikpO1xuQmF0Y2hlcy5zY2hlbWEuZXh0ZW5kKEhhc01hbnlCeVJlZihcIkdhbWVMb2JiaWVzXCIpKTtcbkJhdGNoZXMuYXR0YWNoU2NoZW1hKEJhdGNoZXMuc2NoZW1hKTtcbiIsImltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuLi8uLi9zZXJ2ZXJcIjtcbmltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uL2dhbWUtbG9iYmllcy9nYW1lLWxvYmJpZXNcIjtcbmltcG9ydCB7IHNlbmRQbGF5ZXJzVG9OZXh0QmF0Y2hlcyB9IGZyb20gXCIuLi9nYW1lcy9jcmVhdGVcIjtcbmltcG9ydCB7IEdhbWVzIH0gZnJvbSBcIi4uL2dhbWVzL2dhbWVzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uL3BsYXllcnMvcGxheWVycy5qc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuLi90cmVhdG1lbnRzL3RyZWF0bWVudHNcIjtcbmltcG9ydCB7IEJhdGNoZXMgfSBmcm9tIFwiLi9iYXRjaGVzXCI7XG5cbi8vIENyZWF0ZSBHYW1lTG9iYmllc1xuQmF0Y2hlcy5hZnRlci5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBiYXRjaCkge1xuICBsZXQgZ2FtZUxvYmJpZXMgPSBbXTtcbiAgc3dpdGNoIChiYXRjaC5hc3NpZ25tZW50KSB7XG4gICAgY2FzZSBcInNpbXBsZVwiOlxuICAgICAgXy50aW1lcyhiYXRjaC5zaW1wbGVDb25maWcuY291bnQsIGluZGV4ID0+IHtcbiAgICAgICAgY29uc3QgdHJlYXRtZW50ID0gUmFuZG9tLmNob2ljZShiYXRjaC5zaW1wbGVDb25maWcudHJlYXRtZW50cyk7XG4gICAgICAgIGNvbnN0IHsgX2lkOiB0cmVhdG1lbnRJZCwgbG9iYnlDb25maWdJZCB9ID0gdHJlYXRtZW50O1xuICAgICAgICBnYW1lTG9iYmllcy5wdXNoKHtcbiAgICAgICAgICB0cmVhdG1lbnRJZCxcbiAgICAgICAgICBsb2JieUNvbmZpZ0lkLFxuICAgICAgICAgIGluZGV4XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiY29tcGxldGVcIjpcbiAgICAgIGJhdGNoLmNvbXBsZXRlQ29uZmlnLnRyZWF0bWVudHMuZm9yRWFjaChcbiAgICAgICAgKHsgY291bnQsIF9pZCwgbG9iYnlDb25maWdJZCB9KSA9PiB7XG4gICAgICAgICAgXy50aW1lcyhjb3VudCwgKCkgPT4ge1xuICAgICAgICAgICAgZ2FtZUxvYmJpZXMucHVzaCh7IHRyZWF0bWVudElkOiBfaWQsIGxvYmJ5Q29uZmlnSWQgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGdhbWVMb2JiaWVzID0gXy5zaHVmZmxlKGdhbWVMb2JiaWVzKTtcbiAgICAgIGdhbWVMb2JiaWVzLmZvckVhY2goKGwsIGluZGV4KSA9PiB7XG4gICAgICAgIGwuaW5kZXggPSBpbmRleDtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJCYXRjaGVzLmFmdGVyOiB1bmtub3duIGFzc2lnbm1lbnQ6IFwiICsgYmF0Y2guYXNzaWdubWVudCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIGNvbnN0IGdhbWVMb2JieUlkcyA9IGdhbWVMb2JiaWVzLm1hcChsID0+IHtcbiAgICBsLl9pZCA9IFJhbmRvbS5pZCgpO1xuICAgIGwuc3RhdHVzID0gYmF0Y2guc3RhdHVzO1xuICAgIGwuYmF0Y2hJZCA9IGJhdGNoLl9pZDtcblxuICAgIC8vIFRoaXMgaXMgdHJ1bGx5IGhvcnJpZmljLiBTb3JyeS5cbiAgICAvLyBUaGUgZGVidWcgbW9kZSBpcyBhc3NpZ25lZCBhc3luY2hyb25vdXNseSBvbnRvIHRoZSBiYXRjaCwgd2hpY2ggbWlnaHQgaGFwcGVuXG4gICAgLy8ganVzdCBhcyB0aGlzIG9uIGluc2VydCBob29rIGlzIGNhbGxlZC4gU29ycnkuXG4gICAgY29uc3QgYmF0Y2hVcGRhdGVkID0gQmF0Y2hlcy5maW5kT25lKGJhdGNoLl9pZCk7XG4gICAgbC5kZWJ1Z01vZGUgPSBiYXRjaFVwZGF0ZWQuZGVidWdNb2RlO1xuXG4gICAgY29uc3QgdHJlYXRtZW50ID0gVHJlYXRtZW50cy5maW5kT25lKGwudHJlYXRtZW50SWQpO1xuICAgIGwuYXZhaWxhYmxlQ291bnQgPSB0cmVhdG1lbnQuZmFjdG9yKFwicGxheWVyQ291bnRcIikudmFsdWU7XG4gICAgY29uc3QgYm90c0NvdW50Q29uZCA9IHRyZWF0bWVudC5mYWN0b3IoXCJib3RzQ291bnRcIik7XG4gICAgaWYgKGJvdHNDb3VudENvbmQpIHtcbiAgICAgIGNvbnN0IGJvdHNDb3VudCA9IGJvdHNDb3VudENvbmQudmFsdWU7XG4gICAgICBpZiAoYm90c0NvdW50ID4gbC5hdmFpbGFibGVDb3VudCkge1xuICAgICAgICB0aHJvdyBcIlRyeWluZyB0byBjcmVhdGUgYSBnYW1lIHdpdGggbW9yZSBib3RzIHRoYW4gcGxheWVyc1wiO1xuICAgICAgfVxuICAgICAgaWYgKGJvdHNDb3VudCA9PT0gbC5hdmFpbGFibGVDb3VudCkge1xuICAgICAgICAvL3Rocm93IFwiQ3JlYXRpbmcgYSBnYW1lIHdpdGggb25seSBib3RzLi4uXCI7XG4gICAgICAgIC8vV291bGQgYmUgZ29vZCB0byBkaXNwbGF5IGEgbWVzc2FnZSBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBjcmVhdGUgYSBnYW1lIHdpdGggb25seSBib3RzP1wiXG4gICAgICAgIGNvbnNvbGUubG9nKFwiV2FybmluZzogQ3JlYXRpbmcgYSBnYW1lIHdpdGggb25seSBib3RzIVwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJvdE5hbWVzID0gY29uZmlnLmJvdHMgJiYgXy5rZXlzKGNvbmZpZy5ib3RzKTtcbiAgICAgIGlmICghY29uZmlnLmJvdHMgfHwgYm90TmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IFwiVHJ5aW5nIHRvIGNyZWF0ZSBhIGdhbWUgd2l0aCBib3RzLCBidXQgbm8gYm90cyBkZWZpbmVkXCI7XG4gICAgICB9XG5cbiAgICAgIGwucGxheWVySWRzID0gW107XG4gICAgICBfLnRpbWVzKGJvdHNDb3VudCwgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgaWQ6IFJhbmRvbS5pZCgpLFxuICAgICAgICAgIGdhbWVMb2JieUlkOiBsLl9pZCxcbiAgICAgICAgICByZWFkeUF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGJvdDogXy5zaHVmZmxlKGJvdE5hbWVzKVswXVxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmluZm8oXCJDcmVhdGluZyBib3Q6XCIsIHBhcmFtcyk7XG4gICAgICAgIGNvbnN0IHBsYXllcklkID0gUGxheWVycy5pbnNlcnQocGFyYW1zKTtcbiAgICAgICAgbC5wbGF5ZXJJZHMucHVzaChwbGF5ZXJJZCk7XG4gICAgICB9KTtcbiAgICAgIGwucXVldWVkUGxheWVySWRzID0gbC5wbGF5ZXJJZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIEdhbWVMb2JiaWVzLmluc2VydChsKTtcbiAgfSk7XG5cbiAgQmF0Y2hlcy51cGRhdGUoYmF0Y2guX2lkLCB7ICRzZXQ6IHsgZ2FtZUxvYmJ5SWRzIH0gfSk7XG59KTtcblxuLy8gVXBkYXRlIHN0YXR1cyBvbiBHYW1lcyBhbmQgR2FtZUxvYmJpZXNcbkJhdGNoZXMuYWZ0ZXIudXBkYXRlKFxuICBmdW5jdGlvbih1c2VySWQsIHsgX2lkOiBiYXRjaElkLCBzdGF0dXMgfSwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWZpZWxkTmFtZXMuaW5jbHVkZXMoXCJzdGF0dXNcIikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBbR2FtZXMsIEdhbWVMb2JiaWVzXS5mb3JFYWNoKGNvbGwgPT4ge1xuICAgICAgY29sbC51cGRhdGUoXG4gICAgICAgIHtcbiAgICAgICAgICBiYXRjaElkLFxuICAgICAgICAgIHN0YXR1czogeyAkbmluOiBbXCJmaW5pc2hlZFwiLCBcImNhbmNlbGxlZFwiLCBcImZhaWxlZFwiLCBcImN1c3RvbVwiXSB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgJHNldDogeyBzdGF0dXMgfSB9LFxuICAgICAgICB7IG11bHRpOiB0cnVlIH1cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpZiAoc3RhdHVzICE9PSBcImNhbmNlbGxlZFwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZ2FtZXMgPSBHYW1lcy5maW5kKHsgYmF0Y2hJZCB9KS5mZXRjaCgpO1xuICAgIGNvbnN0IGdwbGF5ZXJJZHMgPSBfLmZsYXR0ZW4oXy5wbHVjayhnYW1lcywgXCJwbGF5ZXJJZHNcIikpO1xuXG4gICAgUGxheWVycy51cGRhdGUoXG4gICAgICB7IF9pZDogeyAkaW46IGdwbGF5ZXJJZHMgfSwgZXhpdEF0OiB7ICRleGlzdHM6IGZhbHNlIH0gfSxcbiAgICAgIHsgJHNldDogeyBleGl0U3RhdHVzOiBcImdhbWVDYW5jZWxsZWRcIiwgZXhpdEF0OiBuZXcgRGF0ZSgpIH0gfSxcbiAgICAgIHsgbXVsdGk6IHRydWUgfVxuICAgICk7XG5cbiAgICBjb25zdCBnYW1lTG9iYmllcyA9IEdhbWVMb2JiaWVzLmZpbmQoe1xuICAgICAgYmF0Y2hJZCxcbiAgICAgIGdhbWVJZDogeyAkZXhpc3RzOiBmYWxzZSB9XG4gICAgfSkuZmV0Y2goKTtcblxuICAgIGlmIChnYW1lTG9iYmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBnbHBsYXllcklkcyA9IF8uZmxhdHRlbihfLnBsdWNrKGdhbWVMb2JiaWVzLCBcInF1ZXVlZFBsYXllcklkc1wiKSk7XG4gICAgY29uc3QgcGxheWVycyA9IFBsYXllcnMuZmluZCh7XG4gICAgICBfaWQ6IHsgJGluOiBnbHBsYXllcklkcyB9LFxuICAgICAgZXhpdEF0OiB7ICRleGlzdHM6IGZhbHNlIH1cbiAgICB9KS5mZXRjaCgpO1xuXG4gICAgY29uc3QgcGxheWVySWRzID0gXy5wbHVjayhwbGF5ZXJzLCBcIl9pZFwiKTtcblxuICAgIHNlbmRQbGF5ZXJzVG9OZXh0QmF0Y2hlcyhwbGF5ZXJJZHMsIGJhdGNoSWQsIGdhbWVMb2JiaWVzWzBdKTtcbiAgfSxcbiAgeyBmZXRjaFByZXZpb3VzOiBmYWxzZSB9XG4pO1xuIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tIFwic2ltcGwtc2NoZW1hXCI7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5cbmltcG9ydCB7IEJhdGNoZXMgfSBmcm9tIFwiLi9iYXRjaGVzXCI7XG5pbXBvcnQgeyBHYW1lTG9iYmllcyB9IGZyb20gXCIuLi9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzLmpzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi9nYW1lcy9nYW1lcy5qc1wiO1xuaW1wb3J0IHsgSWRTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVCYXRjaCA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIkJhdGNoZXMubWV0aG9kcy5jcmVhdGVcIixcblxuICB2YWxpZGF0ZTogQmF0Y2hlcy5zY2hlbWFcbiAgICAub21pdChcbiAgICAgIFwiZ2FtZUlkc1wiLFxuICAgICAgXCJnYW1lTG9iYnlJZHNcIixcbiAgICAgIFwic3RhdHVzXCIsXG4gICAgICBcImNyZWF0ZWRBdFwiLFxuICAgICAgXCJ1cGRhdGVkQXRcIixcbiAgICAgIFwiZGVidWdNb2RlXCIsXG4gICAgICBcImZ1bGxcIixcbiAgICAgIFwiaW5kZXhcIlxuICAgIClcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKGJhdGNoKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cblxuICAgIEJhdGNoZXMuaW5zZXJ0KGJhdGNoLCB7XG4gICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgdmFsaWRhdGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZHVwbGljYXRlQmF0Y2ggPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJCYXRjaGVzLm1ldGhvZHMuZHVwbGljYXRlXCIsXG5cbiAgdmFsaWRhdGU6IElkU2NoZW1hLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IF9pZCB9KSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGJhdGNoID0gQmF0Y2hlcy5maW5kT25lKF9pZCk7XG4gICAgYmF0Y2guZHVwbGljYXRlKCk7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlQmF0Y2ggPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJCYXRjaGVzLm1ldGhvZHMudXBkYXRlQmF0Y2hcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgYXJjaGl2ZWQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSlcbiAgICAuZXh0ZW5kKElkU2NoZW1hKVxuICAgIC52YWxpZGF0b3IoKSxcblxuICBydW4oeyBfaWQsIGFyY2hpdmVkIH0pIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmF1dGhvcml6ZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgYmF0Y2ggPSBCYXRjaGVzLmZpbmRPbmUoX2lkKTtcbiAgICBpZiAoIWJhdGNoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZm91bmRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgJHNldCA9IHt9LFxuICAgICAgJHVuc2V0ID0ge307XG5cbiAgICBpZiAoYXJjaGl2ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGFyY2hpdmVkKSB7XG4gICAgICAgIGlmIChiYXRjaC5hcmNoaXZlZEF0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNldC5hcmNoaXZlZEF0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgJHNldC5hcmNoaXZlZEJ5SWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgIH1cbiAgICAgIGlmICghYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKCFiYXRjaC5hcmNoaXZlZEF0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHVuc2V0LmFyY2hpdmVkQXQgPSB0cnVlO1xuICAgICAgICAkdW5zZXQuYXJjaGl2ZWRCeUlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtb2RpZmllciA9IHt9O1xuICAgIGlmIChPYmplY3Qua2V5cygkc2V0KS5sZW5ndGggPiAwKSB7XG4gICAgICBtb2RpZmllci4kc2V0ID0gJHNldDtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKCR1bnNldCkubGVuZ3RoID4gMCkge1xuICAgICAgbW9kaWZpZXIuJHVuc2V0ID0gJHVuc2V0O1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMobW9kaWZpZXIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEJhdGNoZXMudXBkYXRlKF9pZCwgbW9kaWZpZXIpO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUJhdGNoU3RhdHVzID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiQmF0Y2hlcy5tZXRob2RzLnVwZGF0ZVN0YXR1c1wiLFxuXG4gIHZhbGlkYXRlOiBCYXRjaGVzLnNjaGVtYVxuICAgIC5waWNrKFwic3RhdHVzXCIpXG4gICAgLmV4dGVuZChJZFNjaGVtYSlcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgX2lkLCBzdGF0dXMgfSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVuYXV0aG9yaXplZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBiYXRjaCA9IEJhdGNoZXMuZmluZE9uZShfaWQpO1xuICAgIGlmICghYmF0Y2gpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdHVzID09PSBcImluaXRcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCAkc2V0ID0geyBzdGF0dXMgfTtcblxuICAgIGlmIChzdGF0dXMgPT09IFwicnVubmluZ1wiKSB7XG4gICAgICAkc2V0LnJ1bm5pbmdBdCA9IG5ldyBEYXRlKCk7XG4gICAgICBHYW1lTG9iYmllcy51cGRhdGUoXG4gICAgICAgIHsgYmF0Y2hJZDogX2lkIH0sXG4gICAgICAgIHsgJHNldDogeyBzdGF0dXM6IFwicnVubmluZ1wiIH0gfSxcbiAgICAgICAgeyBtdWx0aTogdHJ1ZSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIEJhdGNoZXMudXBkYXRlKF9pZCwgeyAkc2V0IH0pO1xuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc0RldmVsb3BtZW50IHx8IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuZGVidWdfZ2FtZURlYnVnTW9kZSkge1xuICBleHBvcnQgY29uc3Qgc2V0QmF0Y2hJbkRlYnVnTW9kZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICAgIG5hbWU6IFwiQmF0Y2hlcy5tZXRob2RzLmRlYnVnTW9kZVwiLFxuXG4gICAgdmFsaWRhdGU6IElkU2NoZW1hLnZhbGlkYXRvcigpLFxuXG4gICAgcnVuKHsgX2lkIH0pIHtcbiAgICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBiYXRjaCA9IEJhdGNoZXMuZmluZE9uZShfaWQpO1xuICAgICAgaWYgKCFiYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZm91bmRcIik7XG4gICAgICB9XG5cbiAgICAgIEJhdGNoZXMudXBkYXRlKF9pZCwgeyAkc2V0OiB7IGRlYnVnTW9kZTogdHJ1ZSB9IH0pO1xuICAgICAgR2FtZUxvYmJpZXMudXBkYXRlKHsgYmF0Y2hJZDogX2lkIH0sIHsgJHNldDogeyBkZWJ1Z01vZGU6IHRydWUgfSB9KTtcbiAgICAgIEdhbWVzLnVwZGF0ZSh7IGJhdGNoSWQ6IF9pZCB9LCB7ICRzZXQ6IHsgZGVidWdNb2RlOiB0cnVlIH0gfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuXG5leHBvcnQgY29uc3Qgc3RhdHVzU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN0YXR1czoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBhbGxvd2VkVmFsdWVzOiBbXG4gICAgICBcImluaXRcIiwgLy8gQmF0Y2ggY3JlYXRlZCwgbm90IHJ1bm5pbmcgeWV0XG4gICAgICBcInJ1bm5pbmdcIiwgLy8gQmF0Y2ggaXMgcnVubmluZ1xuXG4gICAgICAvLyBOT1RFKG5wKTogcGF1c2VkOiBmb3Igbm93LCB3ZSBkb24ndCBzdXBwb3J0IHBhdXNlZCBiZWNhdXNlIHdlIG5lZWQgdG8gZG8gc29tZXRoaW5nIGFib3V0IHRpbWVyc1xuICAgICAgLy8gXCJwYXVzZWRcIiwgLy8gQmF0Y2ggaGFzIGJlZW4gcGF1c2UsIG9uZ29pbmcgZ2FtZXMga2VlcCBvbiBnb2luZyBidXQgbm8gbW9yZSBuZXcgcGxheWVycyBhcmUgYWNjZXB0ZWQuIENhbiBiZSByZXN0YXJ0ZWQuXG5cbiAgICAgIFwiZmluaXNoZWRcIiwgLy8gQmF0Y2ggaGFzIGZpbmlzaGVkIGFuZCBjYW5ub3QgYmUgcmVzdGFydGVkXG5cbiAgICAgIC8vIE5PVEUobnApOiBjYW5jZWxsZWQgbWlnaHQgYnJlYWsgYSBnYW1lIGlmIGl0J3MgcnVubmluZyBhdCB0aGUgbW9tZW50LCBnb3R0YSBiZSBjYXJlZnVsXG4gICAgICBcImNhbmNlbGxlZFwiLCAvLyBCYXRjaCB3YXMgY2FuY2VsbGVkIGFuZCBjYW5ub3QgYmUgcmVzdGFydGVkXG4gICAgICBcImZhaWxlZFwiLFxuICAgICAgXCJjdXN0b21cIiAvLyB1c2VkIGZvciBnYW1lLmVuZChcImN1c3RvbSByZWFzb25cIilcbiAgICBdLFxuICAgIGRlZmF1bHRWYWx1ZTogXCJpbml0XCIsXG4gICAgaW5kZXg6IDFcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBHYW1lTG9iYmllcyB9IGZyb20gXCIuLi8uLi9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi8uLi9nYW1lcy9nYW1lc1wiO1xuaW1wb3J0IHsgUm91bmRzIH0gZnJvbSBcIi4uLy4uL3JvdW5kcy9yb3VuZHNcIjtcbmltcG9ydCB7IFN0YWdlcyB9IGZyb20gXCIuLi8uLi9zdGFnZXMvc3RhZ2VzXCI7XG5pbXBvcnQgeyBCYXRjaGVzIH0gZnJvbSBcIi4uL2JhdGNoZXNcIjtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi1iYXRjaGVzXCIsIGZ1bmN0aW9uKHByb3BzKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghcHJvcHMgfHwgcHJvcHMuYXJjaGl2ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBCYXRjaGVzLmZpbmQoKTtcbiAgfVxuXG4gIHJldHVybiBCYXRjaGVzLmZpbmQoeyBhcmNoaXZlZEF0OiB7ICRleGlzdHM6IEJvb2xlYW4ocHJvcHMuYXJjaGl2ZWQpIH0gfSk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi1iYXRjaFwiLCBmdW5jdGlvbih7IGJhdGNoSWQgfSkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWJhdGNoSWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBbR2FtZUxvYmJpZXMuZmluZCh7IGJhdGNoSWQgfSksIEdhbWVzLmZpbmQoeyBiYXRjaElkIH0pXTtcbn0pO1xuXG5NZXRlb3IucHVibGlzaChcImFkbWluLWJhdGNoLWdhbWVcIiwgZnVuY3Rpb24oeyBnYW1lSWQgfSkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWdhbWVJZCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFtSb3VuZHMuZmluZCh7IGdhbWVJZCB9KSwgU3RhZ2VzLmZpbmQoeyBnYW1lSWQgfSldO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKFwicnVubmluZ0JhdGNoZXNcIiwgZnVuY3Rpb24oeyBwbGF5ZXJJZCB9KSB7XG4gIHJldHVybiBCYXRjaGVzLmZpbmQoXG4gICAgeyBzdGF0dXM6IFwicnVubmluZ1wiLCBmdWxsOiBmYWxzZSB9LFxuICAgIHsgZmllbGRzOiB7IF9pZDogMSwgZnVsbDogMSB9IH1cbiAgKTtcbn0pO1xuIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tIFwic2ltcGwtc2NoZW1hXCI7XG5pbXBvcnQgeyBBcmNoaXZlZFNjaGVtYSwgVGltZXN0YW1wU2NoZW1hIH0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hcy5qc1wiO1xuXG5leHBvcnQgY29uc3QgRmFjdG9yVHlwZXMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcImZhY3Rvcl90eXBlc1wiKTtcblxuRmFjdG9yVHlwZXMuaGVscGVycyh7fSk7XG5cbi8vIHJlcXVpcmVkRmFjdG9ycyBob2xkIGEgbGlzdCBvZiBmYWN0b3JzIGtleXMgdGhhdCBhcmUgcmVxdWlyZWQgYnlcbi8vIEVtcGlyaWNhIGNvcmUgdG8gYmUgYWJsZSB0byBydW4gYSBnYW1lLlxuLy8gUmVxdWlyZWQgZmFjdG9ycyBhcmU6XG4vLyAtYHBsYXllckNvdW50YCBkZXRlcm1pbmVzIGhvdyBtYW55IHBsYXllcnMgcGFydGljaXBhdGUgaW4gYSBnYW1lIGFuZCBpc1xuLy8gICB0aGVyZWZvcmUgY3JpdGljYWwgdG8gcnVuIGEgZ2FtZS5cbkZhY3RvclR5cGVzLnJlcXVpcmVkVHlwZXMgPSBbXCJwbGF5ZXJDb3VudFwiXTtcblxuRmFjdG9yVHlwZXMudHlwZXMgPSBbXCJTdHJpbmdcIiwgXCJJbnRlZ2VyXCIsIFwiTnVtYmVyXCIsIFwiQm9vbGVhblwiXTtcblxuRmFjdG9yVHlwZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlcXVpcmVkOiB7XG4gICAgdHlwZTogQm9vbGVhblxuICB9LFxuXG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgbWF4OiAyNTYsXG4gICAgcmVnRXg6IC9eW2Etel0rW2EtekEtWjAtOV0qJC8sXG4gICAgaW5kZXg6IHRydWUsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGN1c3RvbSgpIHtcbiAgICAgIGlmICh0aGlzLmlzU2V0ICYmIEZhY3RvclR5cGVzLmZpbmQoeyBuYW1lOiB0aGlzLnZhbHVlIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiBcIm5vdFVuaXF1ZVwiO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBkZXNjcmlwdGlvbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAyMDQ4XG4gIH0sXG5cbiAgdHlwZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBhbGxvd2VkVmFsdWVzOiBGYWN0b3JUeXBlcy50eXBlc1xuICB9LFxuXG4gIG1pbjoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuXG4gIG1heDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuRmFjdG9yVHlwZXMuc2NoZW1hLm1lc3NhZ2VCb3gubWVzc2FnZXMoe1xuICBlbjoge1xuICAgIG5vdFVuaXF1ZTogXCJ7e2xhYmVsfX0gYWxyZWFkeSBleGlzdHMuXCJcbiAgfVxufSk7XG5cbkZhY3RvclR5cGVzLnNjaGVtYS5leHRlbmQoQXJjaGl2ZWRTY2hlbWEpO1xuRmFjdG9yVHlwZXMuc2NoZW1hLmV4dGVuZChUaW1lc3RhbXBTY2hlbWEpO1xuRmFjdG9yVHlwZXMuYXR0YWNoU2NoZW1hKEZhY3RvclR5cGVzLnNjaGVtYSk7XG4iLCJpbXBvcnQgeyBGYWN0b3JUeXBlcyB9IGZyb20gXCIuL2ZhY3Rvci10eXBlcy5qc1wiO1xuaW1wb3J0IHsgRmFjdG9ycyB9IGZyb20gXCIuLi9mYWN0b3JzL2ZhY3RvcnMuanNcIjtcblxuRmFjdG9yVHlwZXMuYWZ0ZXIuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZmFjdG9yVHlwZSkge1xuICBjb25zdCB7IF9pZDogZmFjdG9yVHlwZUlkLCB0eXBlIH0gPSBmYWN0b3JUeXBlO1xuICBpZiAodHlwZSA9PT0gXCJCb29sZWFuXCIpIHtcbiAgICBbdHJ1ZSwgZmFsc2VdLmZvckVhY2godmFsdWUgPT4gRmFjdG9ycy5pbnNlcnQoeyBmYWN0b3JUeXBlSWQsIHZhbHVlIH0pKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcblxuaW1wb3J0IHsgRmFjdG9ycyB9IGZyb20gXCIuLi9mYWN0b3JzL2ZhY3RvcnMuanNcIjtcbmltcG9ydCB7IEZhY3RvclR5cGVzIH0gZnJvbSBcIi4vZmFjdG9yLXR5cGVzLmpzXCI7XG5pbXBvcnQgeyBJZFNjaGVtYSB9IGZyb20gXCIuLi9kZWZhdWx0LXNjaGVtYXMuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZhY3RvclR5cGUgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJGYWN0b3JUeXBlcy5tZXRob2RzLmNyZWF0ZVwiLFxuXG4gIHZhbGlkYXRlOiBGYWN0b3JUeXBlcy5zY2hlbWFcbiAgICAub21pdChcImNyZWF0ZWRBdFwiLCBcInVwZGF0ZWRBdFwiKVxuICAgIC5leHRlbmQoXG4gICAgICBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICAgICAgaW5pdGlhbFZhbHVlczoge1xuICAgICAgICAgIHR5cGU6IEFycmF5LFxuICAgICAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgXCJpbml0aWFsVmFsdWVzLiRcIjoge1xuICAgICAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5vbmVPZihcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgICBzY29wZWRVbmlxdWU6IFwidHlwZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgICAgICAgICAgc2NvcGVkVW5pcXVlOiBcInR5cGVcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgICBzY29wZWRVbmlxdWU6IFwidHlwZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgICAgICAgICBzY29wZWRVbmlxdWU6IFwidHlwZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKGZhY3RvclR5cGUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmF1dGhvcml6ZWRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgeyBpbml0aWFsVmFsdWVzIH0gPSBmYWN0b3JUeXBlO1xuICAgIGNvbnN0IGZhY3RvclR5cGVJZCA9IEZhY3RvclR5cGVzLmluc2VydChcbiAgICAgIF8ub21pdChmYWN0b3JUeXBlLCBcImluaXRpYWxWYWx1ZXNcIiksXG4gICAgICB7IGF1dG9Db252ZXJ0OiBmYWxzZSB9XG4gICAgKTtcblxuICAgIGluaXRpYWxWYWx1ZXMuZm9yRWFjaCh2YWx1ZSA9PiBGYWN0b3JzLmluc2VydCh7IGZhY3RvclR5cGVJZCwgdmFsdWUgfSkpO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUZhY3RvclR5cGUgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJGYWN0b3JUeXBlcy5tZXRob2RzLnVwZGF0ZVwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBhcmNoaXZlZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfVxuICB9KVxuICAgIC5leHRlbmQoSWRTY2hlbWEpXG4gICAgLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IF9pZCwgYXJjaGl2ZWQgfSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVuYXV0aG9yaXplZFwiKTtcbiAgICB9XG4gICAgY29uc3QgZmFjdG9yVHlwZSA9IEZhY3RvclR5cGVzLmZpbmRPbmUoX2lkKTtcbiAgICBpZiAoIWZhY3RvclR5cGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCAkc2V0ID0ge30sXG4gICAgICAkdW5zZXQgPSB7fTtcblxuICAgIGlmIChhcmNoaXZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKGZhY3RvclR5cGUuYXJjaGl2ZWRBdCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzZXQuYXJjaGl2ZWRBdCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICRzZXQuYXJjaGl2ZWRCeUlkID0gdGhpcy51c2VySWQ7XG4gICAgICB9XG4gICAgICBpZiAoIWFyY2hpdmVkKSB7XG4gICAgICAgIGlmICghZmFjdG9yVHlwZS5hcmNoaXZlZEF0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHVuc2V0LmFyY2hpdmVkQXQgPSB0cnVlO1xuICAgICAgICAkdW5zZXQuYXJjaGl2ZWRCeUlkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBtb2RpZmllciA9IHt9O1xuICAgIGlmIChPYmplY3Qua2V5cygkc2V0KS5sZW5ndGggPiAwKSB7XG4gICAgICBtb2RpZmllci4kc2V0ID0gJHNldDtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKCR1bnNldCkubGVuZ3RoID4gMCkge1xuICAgICAgbW9kaWZpZXIuJHVuc2V0ID0gJHVuc2V0O1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMobW9kaWZpZXIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEZhY3RvclR5cGVzLnVwZGF0ZShfaWQsIG1vZGlmaWVyKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBGYWN0b3JUeXBlcyB9IGZyb20gXCIuLi9mYWN0b3ItdHlwZXMuanNcIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4uLy4uLy4uL2xpYi9sb2cuanNcIjtcbmltcG9ydCB7IGJvb3RzdHJhcEZ1bmN0aW9ucyB9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9ib290c3RyYXAuanNcIjtcblxuY29uc3QgZGVmYXVsdFR5cGVzID0gW1xuICB7XG4gICAgbmFtZTogXCJwbGF5ZXJDb3VudFwiLFxuICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBOdW1iZXIgb2YgcGxheWVycyBwYXJ0aWNpcGF0aW5nIGluIHRoZSBnaXZlbiBnYW1lLlwiLFxuICAgIHR5cGU6IFwiSW50ZWdlclwiLFxuICAgIG1pbjogMSxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICB9XG5dO1xuXG5ib290c3RyYXBGdW5jdGlvbnMucHVzaCgoKSA9PiB7XG4gIGRlZmF1bHRUeXBlcy5mb3JFYWNoKHR5cGUgPT4ge1xuICAgIGNvbnN0IGV4aXN0cyA9IEZhY3RvclR5cGVzLmZpbmRPbmUoeyBuYW1lOiB0eXBlLm5hbWUgfSk7XG4gICAgaWYgKGV4aXN0cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2cuaW5mbyhgSW5zZXJ0aW5nIGRlZmF1bHQgRmFjdG9yIFR5cGU6ICR7dHlwZS5uYW1lfWApO1xuICAgIHRyeSB7XG4gICAgICBGYWN0b3JUeXBlcy5pbnNlcnQodHlwZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZy5lcnJvcihgRmFpbGVkIHRvIGluc2VydCAnJHt0eXBlLm5hbWV9JyBkZWZhdWx0IEZhY3RvciBUeXBlOiAke2Vycn1gKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBGYWN0b3JUeXBlcyB9IGZyb20gXCIuLi9mYWN0b3ItdHlwZXMuanNcIjtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi1mYWN0b3ItdHlwZXNcIiwgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBGYWN0b3JUeXBlcy5maW5kKCk7XG59KTtcbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuaW1wb3J0IHtcbiAgQXJjaGl2ZWRTY2hlbWEsXG4gIEJlbG9uZ3NUbyxcbiAgVGltZXN0YW1wU2NoZW1hXG59IGZyb20gXCIuLi9kZWZhdWx0LXNjaGVtYXMuanNcIjtcbmltcG9ydCB7IEZhY3RvclR5cGVzIH0gZnJvbSBcIi4uL2ZhY3Rvci10eXBlcy9mYWN0b3ItdHlwZXMuanNcIjtcblxuZXhwb3J0IGNvbnN0IEZhY3RvcnMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcImZhY3RvcnNcIik7XG5cbkZhY3RvcnMuaGVscGVycyh7XG4gIGxhYmVsKCkge1xuICAgIGxldCBsYWJlbCA9IHRoaXMubmFtZTtcbiAgICBjb25zdCB2YWx1ZSA9IFN0cmluZyh0aGlzLnZhbHVlKTtcbiAgICBpZiAobGFiZWwgIT09IHZhbHVlKSB7XG4gICAgICBsYWJlbCArPSBgICgke3ZhbHVlfSlgO1xuICAgIH1cbiAgICByZXR1cm4gbGFiZWw7XG4gIH0sXG5cbiAgZmFjdG9yVHlwZSgpIHtcbiAgICByZXR1cm4gRmFjdG9yVHlwZXMuZmluZE9uZSh0aGlzLmZhY3RvclR5cGVJZCk7XG4gIH0sXG5cbiAgZmFjdG9yVHlwZU5hbWUoKSB7XG4gICAgY29uc3QgdCA9IHRoaXMuZmFjdG9yVHlwZSgpO1xuICAgIHJldHVybiB0ICYmIHQubmFtZTtcbiAgfSxcblxuICBmdWxsTGFiZWwoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuZmFjdG9yVHlwZU5hbWUoKX06ICR7dGhpcy5sYWJlbCgpfWA7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgdHlwZUNvbnZlcnNpb24gPSB7XG4gIEludGVnZXI6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICBTdHJpbmc6IFN0cmluZyxcbiAgTnVtYmVyOiBOdW1iZXIsXG4gIEJvb2xlYW46IEJvb2xlYW5cbn07XG5cbkZhY3RvcnMudmFsdWVWYWxpZGF0aW9uID0gZnVuY3Rpb24oZmFjdG9yVHlwZSwgdmFsdWUsIHNpbXBsZVNjaG1lbWFUeXBlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlQ29udmVyc2lvbltmYWN0b3JUeXBlLnR5cGVdO1xuXG4gIGlmIChzaW1wbGVTY2htZW1hVHlwZSAmJiBzaW1wbGVTY2htZW1hVHlwZSAhPT0gdHlwZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGZpZWxkU2NoZW1hID0geyB0eXBlIH07XG4gIGlmIChmYWN0b3JUeXBlLm1pbikge1xuICAgIGZpZWxkU2NoZW1hLm1pbiA9IGZhY3RvclR5cGUubWluO1xuICB9XG4gIGlmIChmYWN0b3JUeXBlLm1heCkge1xuICAgIGZpZWxkU2NoZW1hLm1heCA9IGZhY3RvclR5cGUubWF4O1xuICB9XG4gIGNvbnN0IHNjaGVtYSA9IHsgdmFsdWU6IGZpZWxkU2NoZW1hIH07XG4gIGNvbnN0IHZhbCA9IG5ldyBTaW1wbGVTY2hlbWEoc2NoZW1hKS5uZXdDb250ZXh0KCk7XG5cbiAgdmFsLnZhbGlkYXRlKHsgdmFsdWUgfSk7XG5cbiAgaWYgKCF2YWwuaXNWYWxpZCgpKSB7XG4gICAgcmV0dXJuIHZhbC52YWxpZGF0aW9uRXJyb3JzKCk7XG4gIH1cblxuICBpZiAoRmFjdG9ycy5maW5kKHsgZmFjdG9yVHlwZUlkOiBmYWN0b3JUeXBlLl9pZCwgdmFsdWUgfSkuY291bnQoKSA+IDApIHtcbiAgICByZXR1cm4gW3sgbmFtZTogXCJ2YWx1ZVwiLCB0eXBlOiBcInNjb3BlZFVuaXF1ZVwiIH1dO1xuICB9XG59O1xuXG5jb25zdCB2YWx1ZVZhbGlkYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMua2V5ICE9PSBcInZhbHVlXCIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZmFjdG9yVHlwZUlkID0gdGhpcy5maWVsZChcImZhY3RvclR5cGVJZFwiKS52YWx1ZTtcbiAgY29uc3QgZmFjdG9yVHlwZSA9IEZhY3RvclR5cGVzLmZpbmRPbmUoZmFjdG9yVHlwZUlkKTtcbiAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlO1xuICBjb25zdCBlcnJvcnMgPSBGYWN0b3JzLnZhbHVlVmFsaWRhdGlvbihmYWN0b3JUeXBlLCB2YWx1ZSk7XG5cbiAgaWYgKGVycm9ycykge1xuICAgIHRoaXMuYWRkVmFsaWRhdGlvbkVycm9ycyhlcnJvcnMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuRmFjdG9ycy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBhdXRvVmFsdWUoKSB7XG4gICAgICBpZiAoIXRoaXMuaXNTZXQgJiYgKHRoaXMuaXNJbnNlcnQgfHwgTWV0ZW9yLmlzQ2xpZW50KSkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZmllbGQoXCJ2YWx1ZVwiKS52YWx1ZSkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbWF4OiAyNTYsXG4gICAgcmVnRXg6IC9eW2EtekEtWjAtOV9cXC5dKyQvXG4gIH0sXG5cbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEub25lT2YoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6IE51bWJlclxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdHlwZTogQm9vbGVhblxuICAgICAgfVxuICAgIClcbiAgfVxufSk7XG5cbkZhY3RvcnMuc2NoZW1hLmFkZFZhbGlkYXRvcih2YWx1ZVZhbGlkYXRpb24pO1xuRmFjdG9ycy5zY2hlbWEuZXh0ZW5kKEFyY2hpdmVkU2NoZW1hKTtcbkZhY3RvcnMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJGYWN0b3JUeXBlc1wiKSk7XG5GYWN0b3JzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcbkZhY3RvcnMuYXR0YWNoU2NoZW1hKEZhY3RvcnMuc2NoZW1hKTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuXG5pbXBvcnQgeyBGYWN0b3JzIH0gZnJvbSBcIi4vZmFjdG9ycy5qc1wiO1xuaW1wb3J0IHsgRmFjdG9yVHlwZXMgfSBmcm9tIFwiLi4vZmFjdG9yLXR5cGVzL2ZhY3Rvci10eXBlcy5qc1wiO1xuaW1wb3J0IHsgSWRTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzLmpzXCI7XG5pbXBvcnQgeyBoYW5kbGVGYWN0b3JWYWx1ZUVycm9yTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9saWIvdXRpbHMuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZhY3RvciA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIkZhY3RvcnMubWV0aG9kcy5jcmVhdGVcIixcblxuICB2YWxpZGF0ZTogRmFjdG9ycy5zY2hlbWEub21pdChcImNyZWF0ZWRBdFwiLCBcInVwZGF0ZWRBdFwiKS52YWxpZGF0b3IoKSxcblxuICBydW4oZmFjdG9yKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGZhY3RvclR5cGUgPSBGYWN0b3JUeXBlcy5maW5kT25lKGZhY3Rvci5mYWN0b3JUeXBlSWQpO1xuICAgIGlmICghZmFjdG9yVHlwZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGVycm9ycyA9IEZhY3RvcnMudmFsdWVWYWxpZGF0aW9uKGZhY3RvclR5cGUsIGZhY3Rvci52YWx1ZSk7XG4gICAgaWYgKGVycm9ycykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBlcnJvcnMubWFwKGUgPT4gaGFuZGxlRmFjdG9yVmFsdWVFcnJvck1lc3NhZ2UoZSkpLmpvaW4oXCJcXG5cIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgRmFjdG9ycy5pbnNlcnQoZmFjdG9yLCB7IGF1dG9Db252ZXJ0OiBmYWxzZSB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVGYWN0b3IgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJGYWN0b3JzLm1ldGhvZHMudXBkYXRlXCIsXG5cbiAgdmFsaWRhdGU6IEZhY3RvcnMuc2NoZW1hXG4gICAgLnBpY2soXCJuYW1lXCIpXG4gICAgLmV4dGVuZChJZFNjaGVtYSlcbiAgICAuZXh0ZW5kKFxuICAgICAgbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgICAgIGFyY2hpdmVkOiB7XG4gICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICBvcHRpb25hbDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIClcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgX2lkLCBuYW1lLCBhcmNoaXZlZCB9KSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGZhY3RvciA9IEZhY3RvcnMuZmluZE9uZShfaWQpO1xuICAgIGlmICghZmFjdG9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZm91bmRcIik7XG4gICAgfVxuXG4gICAgY29uc3QgJHNldCA9IHt9LFxuICAgICAgJHVuc2V0ID0ge307XG4gICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgJHNldC5uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBpZiAoYXJjaGl2ZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGFyY2hpdmVkKSB7XG4gICAgICAgIGlmIChmYWN0b3IuYXJjaGl2ZWRBdCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRzZXQuYXJjaGl2ZWRBdCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICRzZXQuYXJjaGl2ZWRCeUlkID0gdGhpcy51c2VySWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKCFmYWN0b3IuYXJjaGl2ZWRBdCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR1bnNldC5hcmNoaXZlZEF0ID0gdHJ1ZTtcbiAgICAgICAgJHVuc2V0LmFyY2hpdmVkQnlJZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbW9kaWZpZXIgPSB7fTtcbiAgICBpZiAoT2JqZWN0LmtleXMoJHNldCkubGVuZ3RoID4gMCkge1xuICAgICAgbW9kaWZpZXIuJHNldCA9ICRzZXQ7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cygkdW5zZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIG1vZGlmaWVyLiR1bnNldCA9ICR1bnNldDtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKG1vZGlmaWVyKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBGYWN0b3JzLnVwZGF0ZShfaWQsIG1vZGlmaWVyKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBGYWN0b3JzIH0gZnJvbSBcIi4uL2ZhY3RvcnMuanNcIjtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi1mYWN0b3JzXCIsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gW0ZhY3RvcnMuZmluZCgpXTtcbn0pO1xuIiwiLy8gZ2FtZS1sb2JiaWVzLmpzXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgc3RhdHVzU2NoZW1hIH0gZnJvbSBcIi4uL2JhdGNoZXMvc3RhdHVzLXNjaGVtYVwiO1xuaW1wb3J0IHsgQmF0Y2hlcyB9IGZyb20gXCIuLi9iYXRjaGVzL2JhdGNoZXNcIjtcbmltcG9ydCB7IEJlbG9uZ3NUbywgSGFzTWFueUJ5UmVmLCBUaW1lc3RhbXBTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5pbXBvcnQgeyBEZWJ1Z01vZGVTY2hlbWEsIFVzZXJEYXRhU2NoZW1hIH0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hcy5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnNcIjtcbmltcG9ydCB7IFRyZWF0bWVudHMgfSBmcm9tIFwiLi4vdHJlYXRtZW50cy90cmVhdG1lbnRzXCI7XG5cbmV4cG9ydCBjb25zdCBHYW1lTG9iYmllcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwiZ2FtZV9sb2JiaWVzXCIpO1xuXG5HYW1lTG9iYmllcy5oZWxwZXJzKHtcbiAgcGxheWVycygpIHtcbiAgICByZXR1cm4gUGxheWVycy5maW5kKHsgX2lkOiB7ICRpbjogdGhpcy5wbGF5ZXJJZHMgfSB9KS5mZXRjaCgpO1xuICB9LFxuICBiYXRjaCgpIHtcbiAgICByZXR1cm4gQmF0Y2hlcy5maW5kT25lKHsgX2lkOiB0aGlzLmJhdGNoSWQgfSk7XG4gIH0sXG4gIHRyZWF0bWVudCgpIHtcbiAgICByZXR1cm4gVHJlYXRtZW50cy5maW5kT25lKHsgX2lkOiB0aGlzLnRyZWF0bWVudElkIH0pO1xuICB9XG59KTtcblxuR2FtZUxvYmJpZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8vIGluZGV4IGFsbG93cyBmb3IgYW4gb3JkZXJpbmcgb2YgbG9iYmllcyBzbyB3ZSBrbm93IHdoaWNoIG9uZVxuICAvLyB0byBjaG9vc2UgZnJvbSBuZXh0XG4gIGluZGV4OiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgbWluOiAwLFxuICAgIGxhYmVsOiBcIlBvc2l0aW9uXCJcbiAgfSxcblxuICAvLyBhdmFpbGFibGVDb3VudCB0ZWxscyB1cyBob3cgbWFueSBzbG90cyBhcmUgYXZhaWxhYmxlIGluIHRoaXMgbG9iYnlcbiAgLy8gKD09IHRyZWF0bWVudC5wbGF5ZXJDb3VudClcbiAgYXZhaWxhYmxlQ291bnQ6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBtaW46IDAsXG4gICAgbGFiZWw6IFwiQXZhaWxhYmxlIFNsb3RzIENvdW50XCJcbiAgfSxcblxuICB0aW1lb3V0U3RhcnRlZEF0OiB7XG4gICAgbGFiZWw6IFwiVGltZSB0aGUgZmlyc3QgcGxheWVyIGFycml2ZWQgaW4gdGhlIGxvYmJ5XCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuXG4gIHRpbWVkT3V0QXQ6IHtcbiAgICBsYWJlbDogXCJUaW1lIHdoZW4gdGhlIGxvYmJ5IHRpbWVkIG91dCBhbmQgd2FzIGNhbmNlbGxlZFwiLFxuICAgIHR5cGU6IERhdGUsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgaW5kZXg6IDFcbiAgfSxcblxuICBlbmRSZWFzb246IHtcbiAgICBsYWJlbDogXCJFbmRlZCBSZWFzb25cIixcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IC9bYS16QS1aMC05X10rL1xuICB9LFxuXG4gIC8vIFF1ZXVlZCBwbGF5ZXJzIGFyZSBwbGF5ZXJzIHRoYXQgaGF2ZSBiZWVuIGFzc29jaWF0ZWQgd2l0aCB0aGUgbG9iYnlcbiAgLy8gYnV0IGFyZSBub3QgY29uZmlybWVkIGZvciB0aGUgZ2FtZSB5ZXQuIHBsYXllcklkcyBpcyB1c2VkIGZvciBjb25maXJtZWRcbiAgLy8gcGxheWVyc1xuICAvLyBUaGVyZSBtaWdodCBiZSBtb3JlIHF1ZXVlZCBwbGF5ZXIgdGhhbiBhdmFpbGFibGVDb3VudCBhcyB3ZVxuICAvLyBhbGxvdyBvdmVyYm9va2luZyB0byBtYWtlIGdhbWVzIHN0YXJ0IGZhc3Rlci5cbiAgcXVldWVkUGxheWVySWRzOiB7XG4gICAgdHlwZTogQXJyYXksXG4gICAgZGVmYXVsdFZhbHVlOiBbXSxcbiAgICBsYWJlbDogYFF1ZXVlZCBQbGF5ZXJzYCxcbiAgICBpbmRleDogdHJ1ZVxuICB9LFxuICBcInF1ZXVlZFBsYXllcklkcy4kXCI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICBsYWJlbDogYFF1ZXVlZCBQbGF5ZXJgXG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQgfHwgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5kZWJ1Z19nYW1lRGVidWdNb2RlKSB7XG4gIEdhbWVMb2JiaWVzLnNjaGVtYS5leHRlbmQoRGVidWdNb2RlU2NoZW1hKTtcbn1cblxuR2FtZUxvYmJpZXMuc2NoZW1hLmV4dGVuZChVc2VyRGF0YVNjaGVtYSk7XG5HYW1lTG9iYmllcy5zY2hlbWEuZXh0ZW5kKFRpbWVzdGFtcFNjaGVtYSk7XG4vLyBwbGF5ZXJJZHMgdGVsbHMgdXMgaG93IG1hbnkgcGxheWVycyBhcmUgcmVhZHkgdG8gc3RhcnQgKGZpbmlzaGVkIGludHJvKVxuLy8gT25jZSBwbGF5ZXJJZHMubGVuZ3RoID09IGF2YWlsYWJsZUNvdW50LCB0aGUgZ2FtZSBzdGFydHMuIFBsYXllciB0aGF0IGFyZVxuLy8gcXVldWVkIGJ1dCBoYXZlbid0IG1hZGUgaXQgcGFzdCB0aGUgaW50cm8gaW4gdGltZSB3aWxsIGJlIGxlZCB0byB0aGUgb3V0cm9cbi8vIGRpcmVjdGx5LlxuR2FtZUxvYmJpZXMuc2NoZW1hLmV4dGVuZChIYXNNYW55QnlSZWYoXCJQbGF5ZXJzXCIpKTtcbkdhbWVMb2JiaWVzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiR2FtZXNcIiwgZmFsc2UpKTtcbkdhbWVMb2JiaWVzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiVHJlYXRtZW50c1wiKSk7XG5HYW1lTG9iYmllcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkJhdGNoZXNcIikpO1xuR2FtZUxvYmJpZXMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJMb2JieUNvbmZpZ3NcIikpO1xuLy8gV2UgYXJlIGRlbm9ybWFsaXppbmcgdGhlIHBhcmVudCBiYXRjaCBzdGF0dXMgaW4gb3JkZXIgdG8gbWFrZSBjbGVhbiBxdWVyaWVzXG5HYW1lTG9iYmllcy5zY2hlbWEuZXh0ZW5kKHN0YXR1c1NjaGVtYSk7XG5HYW1lTG9iYmllcy5hdHRhY2hTY2hlbWEoR2FtZUxvYmJpZXMuc2NoZW1hKTtcbiIsImltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uL2dhbWUtbG9iYmllcy9nYW1lLWxvYmJpZXNcIjtcbmltcG9ydCB7IEdhbWVzIH0gZnJvbSBcIi4uL2dhbWVzL2dhbWVzXCI7XG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi4vbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uL3BsYXllcnMvcGxheWVycy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2FtZUZyb21Mb2JieSB9IGZyb20gXCIuLi9nYW1lcy9jcmVhdGVcIjtcblxuaW1wb3J0IHsgY2hlY2tCYXRjaEZ1bGwsIGNoZWNrRm9yQmF0Y2hGaW5pc2hlZCB9IGZyb20gXCIuLi9nYW1lcy9ob29rcy5qc1wiO1xuXG4vLyBDaGVjayBpZiBiYXRjaCBpcyBmdWxsIG9yIHRoZSBnYW1lIGZpbmlzaGVkIGlmIHRoaXMgbG9iYnkgdGltZWQgb3V0XG5HYW1lTG9iYmllcy5hZnRlci51cGRhdGUoZnVuY3Rpb24oXG4gIHVzZXJJZCxcbiAgeyBiYXRjaElkIH0sXG4gIGZpZWxkTmFtZXMsXG4gIG1vZGlmaWVyLFxuICBvcHRpb25zXG4pIHtcbiAgaWYgKCFmaWVsZE5hbWVzLmluY2x1ZGVzKFwidGltZWRPdXRBdFwiKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNoZWNrQmF0Y2hGdWxsKGJhdGNoSWQpO1xuICBjaGVja0ZvckJhdGNoRmluaXNoZWQoYmF0Y2hJZCk7XG59KTtcblxuLy8gU3RhcnQgdGhlIGdhbWUgaWYgbG9iYnkgZnVsbFxuR2FtZUxvYmJpZXMuYWZ0ZXIudXBkYXRlKFxuICBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAoXG4gICAgICAhKFxuICAgICAgICBmaWVsZE5hbWVzLmluY2x1ZGVzKFwicGxheWVySWRzXCIpIHx8XG4gICAgICAgIChmaWVsZE5hbWVzLmluY2x1ZGVzKFwic3RhdHVzXCIpICYmIGRvYy5zdGF0dXMgPT0gXCJydW5uaW5nXCIpXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZ2FtZUxvYmJ5ID0gdGhpcy50cmFuc2Zvcm0oKTtcbiAgICBjb25zdCBodW1hblBsYXllcnMgPSBbXTtcblxuICAgIGlmIChnYW1lTG9iYnkucGxheWVySWRzICYmIGdhbWVMb2JieS5wbGF5ZXJJZHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcGxheWVycyA9IFBsYXllcnMuZmluZCh7XG4gICAgICAgIF9pZDogeyAkaW46IGdhbWVMb2JieS5wbGF5ZXJJZHMgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGh1bWFuUGxheWVycy5wdXNoKC4uLnBsYXllcnMuZmlsdGVyKHAgPT4gIXAuYm90KSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVhZHlQbGF5ZXJzQ291bnQgPSBnYW1lTG9iYnkucGxheWVySWRzLmxlbmd0aDtcblxuICAgIC8vIElmIHRoZSBsb2JieSB0aW1lb3V0IGl0IGhhc24ndCBzdGFydGVkIHlldCBhbmQgdGhlIGxvYmJ5IGlzbid0IGZ1bGwgeWV0XG4gICAgLy8gKHNpbmdsZSBwbGF5ZXIpLCB0cnkgdG8gc3RhcnQgdGhlIHRpbWVvdXQgdGltZXIuXG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXJzLmxlbmd0aCA+IDAgJiZcbiAgICAgIGdhbWVMb2JieS5hdmFpbGFibGVDb3VudCAhPSAxICYmXG4gICAgICAhZ2FtZUxvYmJ5LnRpbWVvdXRTdGFydGVkQXRcbiAgICApIHtcbiAgICAgIGNvbnN0IGxvYmJ5Q29uZmlnID0gTG9iYnlDb25maWdzLmZpbmRPbmUoZ2FtZUxvYmJ5LmxvYmJ5Q29uZmlnSWQpO1xuICAgICAgaWYgKGxvYmJ5Q29uZmlnLnRpbWVvdXRUeXBlID09PSBcImxvYmJ5XCIpIHtcbiAgICAgICAgR2FtZUxvYmJpZXMudXBkYXRlKGdhbWVMb2JieS5faWQsIHtcbiAgICAgICAgICAkc2V0OiB7IHRpbWVvdXRTdGFydGVkQXQ6IG5ldyBEYXRlKCkgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgcmVhZHlQbGF5ZXJzQ291bnQgd2VudCB0byAwIChkaXNjb25uZWN0aW9ucyBmb3IgZXhhbXBsZSksIHJlc2V0IHRoZVxuICAgIC8vIGxvYmJ5IHRpbWVvdXQuXG4gICAgaWYgKGh1bWFuUGxheWVycy5sZW5ndGggPT09IDAgJiYgZ2FtZUxvYmJ5LnRpbWVvdXRTdGFydGVkQXQpIHtcbiAgICAgIGNvbnN0IGxvYmJ5Q29uZmlnID0gTG9iYnlDb25maWdzLmZpbmRPbmUoZ2FtZUxvYmJ5LmxvYmJ5Q29uZmlnSWQpO1xuICAgICAgaWYgKGxvYmJ5Q29uZmlnLnRpbWVvdXRUeXBlID09PSBcImxvYmJ5XCIpIHtcbiAgICAgICAgR2FtZUxvYmJpZXMudXBkYXRlKGdhbWVMb2JieS5faWQsIHtcbiAgICAgICAgICAkdW5zZXQ6IHsgdGltZW91dFN0YXJ0ZWRBdDogXCJcIiB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBub3QgZW5vdWdoIHBsYXllcnMgcmVhZHksIHdhaXRcbiAgICBpZiAocmVhZHlQbGF5ZXJzQ291bnQgPCBnYW1lTG9iYnkuYXZhaWxhYmxlQ291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHYW1lIGFscmVhZHkgY3JlYXRlZCAoPyEpXG4gICAgaWYgKEdhbWVzLmZpbmQoeyBnYW1lTG9iYnlJZDogZ2FtZUxvYmJ5Ll9pZCB9KS5jb3VudCgpID4gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBHYW1lXG4gICAgY3JlYXRlR2FtZUZyb21Mb2JieShnYW1lTG9iYnkpO1xuICB9LFxuICB7IGZldGNoUHJldmlvdXM6IGZhbHNlIH1cbik7XG4iLCJpbXBvcnQgc2hhcmVkIGZyb20gXCIuLi8uLi9zaGFyZWQuanNcIjtcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuXG5pbXBvcnQgeyBHYW1lTG9iYmllcyB9IGZyb20gXCIuL2dhbWUtbG9iYmllc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnNcIjtcbmltcG9ydCB7IEJhdGNoZXMgfSBmcm9tIFwiLi4vYmF0Y2hlcy9iYXRjaGVzLmpzXCI7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVHYW1lTG9iYnlEYXRhID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiR2FtZUxvYmJpZXMubWV0aG9kcy51cGRhdGVEYXRhXCIsXG5cbiAgdmFsaWRhdGU6IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIGdhbWVMb2JieUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBrZXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgYXBwZW5kOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIG5vQ2FsbGJhY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSkudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgZ2FtZUxvYmJ5SWQsIGtleSwgdmFsdWUsIGFwcGVuZCwgbm9DYWxsYmFjayB9KSB7XG4gICAgY29uc3QgZ2FtZUxvYmJ5ID0gR2FtZUxvYmJpZXMuZmluZE9uZShnYW1lTG9iYnlJZCk7XG4gICAgaWYgKCFnYW1lTG9iYnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImdhbWUgbG9iYmllcyBub3QgZm91bmRcIik7XG4gICAgfVxuICAgIC8vIFRPRE8gY2hlY2sgY2FuIHVwZGF0ZSB0aGlzIHJlY29yZCBnYW1lXG5cbiAgICBjb25zdCB2YWwgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICBsZXQgdXBkYXRlID0geyBbYGRhdGEuJHtrZXl9YF06IHZhbCB9O1xuICAgIGNvbnN0IG1vZGlmaWVyID0gYXBwZW5kID8geyAkcHVzaDogdXBkYXRlIH0gOiB7ICRzZXQ6IHVwZGF0ZSB9O1xuXG4gICAgR2FtZUxvYmJpZXMudXBkYXRlKGdhbWVMb2JieUlkLCBtb2RpZmllciwge1xuICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRlOiBmYWxzZSxcbiAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2VcbiAgICB9KTtcblxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgIW5vQ2FsbGJhY2spIHtcbiAgICAgIHNoYXJlZC5jYWxsT25DaGFuZ2Uoe1xuICAgICAgICBjb25uOiB0aGlzLmNvbm5lY3Rpb24sXG4gICAgICAgIGdhbWVMb2JieUlkLFxuICAgICAgICBnYW1lTG9iYnksXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IHZhbCxcbiAgICAgICAgcHJldlZhbHVlOiBnYW1lTG9iYnkuZGF0YSAmJiBnYW1lTG9iYnkuZGF0YVtrZXldLFxuICAgICAgICBhcHBlbmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBlYXJseUV4aXRHYW1lTG9iYnkgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJHYW1lTG9iYmllcy5tZXRob2RzLmVhcmx5RXhpdFwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBleGl0UmVhc29uOiB7XG4gICAgICBsYWJlbDogXCJSZWFzb24gZm9yIEV4aXRcIixcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiAvW2EtekEtWjAtOV9dKy9cbiAgICB9LFxuICAgIGdhbWVMb2JieUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBzdGF0dXM6IHtcbiAgICAgIGxhYmVsOiBcIlN0YXR1cyBmb3IgbG9iYnkgYWZ0ZXIgZXhpdFwiLFxuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IC9bYS16QS1aMC05X10rLyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBleGl0UmVhc29uLCBnYW1lTG9iYnlJZCwgc3RhdHVzIH0pIHtcbiAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdhbWVMb2JieSA9IEdhbWVMb2JiaWVzLmZpbmRPbmUoZ2FtZUxvYmJ5SWQpO1xuICAgIGNvbnN0IGV4aXRTdGF0dXMgPSBzdGF0dXMgfHwgXCJmYWlsZWRcIjtcbiAgICBpZiAoIWdhbWVMb2JieSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2FtZUxvYmJ5IG5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBQbGF5ZXJzLnVwZGF0ZShcbiAgICAgIHsgZ2FtZUxvYmJ5SWQgfSxcbiAgICAgIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGV4aXRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICBleGl0U3RhdHVzOiBleGl0U3RhdHVzLFxuICAgICAgICAgIGV4aXRSZWFzb25cbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgICBHYW1lTG9iYmllcy51cGRhdGUoZ2FtZUxvYmJ5SWQsIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgc3RhdHVzOiBleGl0U3RhdHVzLFxuICAgICAgICBlbmRSZWFzb246IGV4aXRSZWFzb25cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGJhdGNoID0gQmF0Y2hlcy5maW5kT25lKGdhbWVMb2JieS5iYXRjaElkKTtcbiAgICBjb25zdCBhdmFpbGFibGVMb2JieSA9IEdhbWVMb2JiaWVzLmZpbmRPbmUoe1xuICAgICAgJGFuZDogW1xuICAgICAgICB7XG4gICAgICAgICAgX2lkOiB7ICRpbjogYmF0Y2guZ2FtZUxvYmJ5SWRzIH1cbiAgICAgICAgfSxcbiAgICAgICAgeyBzdGF0dXM6IHsgJGluOiBbXCJpbml0XCIsIFwicnVubmluZ1wiXSB9IH1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIC8vIEVuZCBiYXRjaCBpZiB0aGVyZSBpcyBubyBhdmFpbGFibGUgbG9iYnlcbiAgICBpZiAoIWF2YWlsYWJsZUxvYmJ5KSB7XG4gICAgICBCYXRjaGVzLnVwZGF0ZShcbiAgICAgICAgeyBnYW1lTG9iYnlJZHM6IGdhbWVMb2JieUlkIH0sXG4gICAgICAgIHsgJHNldDogeyBzdGF0dXM6IGV4aXRTdGF0dXMsIGZpbmlzaGVkQXQ6IG5ldyBEYXRlKCkgfSB9XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcblxuaW1wb3J0IHsgR2FtZUxvYmJpZXMgfSBmcm9tIFwiLi4vZ2FtZS1sb2JiaWVzLmpzXCI7XG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi4vLi4vbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uLy4uL3BsYXllcnMvcGxheWVycy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2FtZUZyb21Mb2JieSB9IGZyb20gXCIuLi8uLi9nYW1lcy9jcmVhdGUuanNcIjtcbmltcG9ydCBDcm9uIGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9jcm9uLmpzXCI7XG5cbmNvbnN0IGNoZWNrTG9iYnlUaW1lb3V0ID0gKGxvZywgbG9iYnksIGxvYmJ5Q29uZmlnKSA9PiB7XG4gIC8vIFRpbWVvdXQgaGFzbid0IHN0YXJ0ZWQgeWV0XG4gIGlmICghbG9iYnkudGltZW91dFN0YXJ0ZWRBdCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICBjb25zdCBzdGFydFRpbWVBdCA9IG1vbWVudChsb2JieS50aW1lb3V0U3RhcnRlZEF0KTtcbiAgY29uc3QgZW5kVGltZUF0ID0gc3RhcnRUaW1lQXQuYWRkKGxvYmJ5Q29uZmlnLnRpbWVvdXRJblNlY29uZHMsIFwic2Vjb25kc1wiKTtcbiAgY29uc3QgZW5kZWQgPSBub3cuaXNTYW1lT3JBZnRlcihlbmRUaW1lQXQpO1xuXG4gIGlmICghZW5kZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzd2l0Y2ggKGxvYmJ5Q29uZmlnLnRpbWVvdXRTdHJhdGVneSkge1xuICAgIGNhc2UgXCJmYWlsXCI6XG4gICAgICBHYW1lTG9iYmllcy51cGRhdGUobG9iYnkuX2lkLCB7XG4gICAgICAgICRzZXQ6IHsgdGltZWRPdXRBdDogbmV3IERhdGUoKSwgc3RhdHVzOiBcImZhaWxlZFwiIH1cbiAgICAgIH0pO1xuICAgICAgUGxheWVycy51cGRhdGUoXG4gICAgICAgIHsgX2lkOiB7ICRpbjogbG9iYnkucXVldWVkUGxheWVySWRzIH0gfSxcbiAgICAgICAge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIGV4aXRTdGF0dXM6IFwiZ2FtZUxvYmJ5VGltZWRPdXRcIixcbiAgICAgICAgICAgIGV4aXRBdDogbmV3IERhdGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgeyBtdWx0aTogdHJ1ZSB9XG4gICAgICApO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImlnbm9yZVwiOlxuICAgICAgY3JlYXRlR2FtZUZyb21Mb2JieShsb2JieSk7XG4gICAgICBicmVhaztcblxuICAgIC8vIGNhc2UgXCJib3RzXCI6IHtcblxuICAgIC8vICAgYnJlYWs7XG4gICAgLy8gfVxuXG4gICAgZGVmYXVsdDpcbiAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgYHVua25vd24gTG9iYnlDb25maWcudGltZW91dFN0cmF0ZWd5OiAke2xvYmJ5Q29uZmlnLnRpbWVvdXRTdHJhdGVneX1gXG4gICAgICApO1xuICB9XG59O1xuXG5jb25zdCBjaGVja0luZGl2aWR1YWxUaW1lb3V0ID0gKGxvZywgbG9iYnksIGxvYmJ5Q29uZmlnKSA9PiB7XG4gIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICBQbGF5ZXJzLmZpbmQoeyBfaWQ6IHsgJGluOiBsb2JieS5wbGF5ZXJJZHMgfSB9KS5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgY29uc3Qgc3RhcnRUaW1lQXQgPSBtb21lbnQocGxheWVyLnRpbWVvdXRTdGFydGVkQXQpO1xuICAgIGNvbnN0IGVuZFRpbWVBdCA9IHN0YXJ0VGltZUF0LmFkZChsb2JieUNvbmZpZy50aW1lb3V0SW5TZWNvbmRzLCBcInNlY29uZHNcIik7XG4gICAgY29uc3QgZW5kZWQgPSBub3cuaXNTYW1lT3JBZnRlcihlbmRUaW1lQXQpO1xuICAgIGlmICghZW5kZWQgfHwgcGxheWVyLnRpbWVvdXRXYWl0Q291bnQgPD0gbG9iYnlDb25maWcuZXh0ZW5kQ291bnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgUGxheWVycy51cGRhdGUocGxheWVyLl9pZCwge1xuICAgICAgJHNldDoge1xuICAgICAgICBleGl0U3RhdHVzOiBcInBsYXllckxvYmJ5VGltZWRPdXRcIixcbiAgICAgICAgZXhpdEF0OiBuZXcgRGF0ZSgpXG4gICAgICB9XG4gICAgfSk7XG4gICAgR2FtZUxvYmJpZXMudXBkYXRlKGxvYmJ5Ll9pZCwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgcGxheWVySWRzOiBwbGF5ZXIuX2lkXG4gICAgICAgIC8vIFdlIGtlZXAgdGhlIHBsYXllciBpbiBxdWV1ZWRQbGF5ZXJJZHMgc28gdGhleSB3aWxsIHN0aWxsIGhhdmUgdGhlXG4gICAgICAgIC8vIGZhY3QgdGhleSB3ZXJlIGluIGEgbG9iYnkgYXZhaWxhYmxlIGluIHRoZSBVSSwgYW5kIHNvIHdlIGNhbiBzaG93XG4gICAgICAgIC8vIHRoZW0gdGhlIGV4aXQgc3RlcHMuXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuQ3Jvbi5hZGQoe1xuICBuYW1lOiBcIkNoZWNrIGxvYmJ5IHRpbWVvdXRzXCIsXG4gIGludGVydmFsOiAxMDAwLFxuICB0YXNrOiBmdW5jdGlvbihsb2cpIHtcbiAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgIHN0YXR1czogXCJydW5uaW5nXCIsXG4gICAgICBnYW1lSWQ6IHsgJGV4aXN0czogZmFsc2UgfSxcbiAgICAgIHRpbWVkT3V0QXQ6IHsgJGV4aXN0czogZmFsc2UgfVxuICAgIH07XG5cbiAgICBHYW1lTG9iYmllcy5maW5kKHF1ZXJ5KS5mb3JFYWNoKGxvYmJ5ID0+IHtcbiAgICAgIGNvbnN0IGxvYmJ5Q29uZmlnID0gTG9iYnlDb25maWdzLmZpbmRPbmUobG9iYnkubG9iYnlDb25maWdJZCk7XG5cbiAgICAgIHN3aXRjaCAobG9iYnlDb25maWcudGltZW91dFR5cGUpIHtcbiAgICAgICAgY2FzZSBcImxvYmJ5XCI6XG4gICAgICAgICAgY2hlY2tMb2JieVRpbWVvdXQobG9nLCBsb2JieSwgbG9iYnlDb25maWcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaW5kaXZpZHVhbFwiOlxuICAgICAgICAgIGNoZWNrSW5kaXZpZHVhbFRpbWVvdXQobG9nLCBsb2JieSwgbG9iYnlDb25maWcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGxvZy5lcnJvcihcbiAgICAgICAgICAgIGB1bmtub3duIExvYmJ5Q29uZmlnLnRpbWVvdXRUeXBlOiAke2xvYmJ5Q29uZmlnLnRpbWVvdXRUeXBlfWBcbiAgICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IHB1Ymxpc2hDb21wb3NpdGUgfSBmcm9tIFwibWV0ZW9yL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGVcIjtcbmltcG9ydCB7IEZhY3RvcnMgfSBmcm9tIFwiLi4vLi4vZmFjdG9ycy9mYWN0b3JzLmpzXCI7XG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi4vLi4vbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uLy4uL3BsYXllcnMvcGxheWVyc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuLi8uLi90cmVhdG1lbnRzL3RyZWF0bWVudHNcIjtcbmltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uL2dhbWUtbG9iYmllc1wiO1xuXG5wdWJsaXNoQ29tcG9zaXRlKFwiZ2FtZUxvYmJ5XCIsIGZ1bmN0aW9uKHsgcGxheWVySWQgfSkge1xuICByZXR1cm4ge1xuICAgIGZpbmQoKSB7XG4gICAgICByZXR1cm4gUGxheWVycy5maW5kKHBsYXllcklkKTtcbiAgICB9LFxuXG4gICAgY2hpbGRyZW46IFtcbiAgICAgIHtcbiAgICAgICAgZmluZCh7IGdhbWVMb2JieUlkIH0pIHtcbiAgICAgICAgICByZXR1cm4gR2FtZUxvYmJpZXMuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IGdhbWVMb2JieUlkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmluZCh7IHRyZWF0bWVudElkIH0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRyZWF0bWVudHMuZmluZCh0cmVhdG1lbnRJZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGZpbmQoeyBmYWN0b3JJZHMgfSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIEZhY3RvcnMuZmluZCh7IF9pZDogeyAkaW46IGZhY3RvcklkcyB9IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZmluZCh7IGxvYmJ5Q29uZmlnSWQgfSkge1xuICAgICAgICAgICAgICByZXR1cm4gTG9iYnlDb25maWdzLmZpbmQobG9iYnlDb25maWdJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufSk7XG4iLCJpbXBvcnQgeyBTdGFnZXMgfSBmcm9tIFwiLi4vc3RhZ2VzL3N0YWdlc1wiO1xuaW1wb3J0IHsgYXVnbWVudFBsYXllclN0YWdlUm91bmQgfSBmcm9tIFwiLi4vcGxheWVyLXN0YWdlcy9hdWdtZW50XCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vcm91bmRzL3JvdW5kc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnNcIjtcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnRHYW1lT2JqZWN0ID0gKHtcbiAgZ2FtZSxcbiAgdHJlYXRtZW50LFxuICByb3VuZCA9IHVuZGVmaW5lZCxcbiAgc3RhZ2UgPSB1bmRlZmluZWQsXG4gIGZpcnN0Um91bmRJZCA9IHVuZGVmaW5lZCxcbiAgY3VycmVudFN0YWdlSWQgPSB1bmRlZmluZWRcbn0pID0+IHtcbiAgbGV0IGdhbWVUcmVhdG1lbnQgPSBudWxsLFxuICAgIGdhbWVQbGF5ZXJzID0gbnVsbCxcbiAgICBnYW1lUm91bmRzID0gbnVsbCxcbiAgICBnYW1lU3RhZ2VzID0gbnVsbDtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhnYW1lLCB7XG4gICAgdHJlYXRtZW50OiB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghZ2FtZVRyZWF0bWVudCkge1xuICAgICAgICAgIGdhbWVUcmVhdG1lbnQgPSB0cmVhdG1lbnQuZmFjdG9yc09iamVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdhbWVUcmVhdG1lbnQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBwbGF5ZXJzOiB7XG4gICAgICBnZXQoKSB7XG4gICAgICAgIGlmICghZ2FtZVBsYXllcnMpIHtcbiAgICAgICAgICBnYW1lUGxheWVycyA9IFBsYXllcnMuZmluZCh7IF9pZDogeyAkaW46IGdhbWUucGxheWVySWRzIH0gfSkuZmV0Y2goKTtcblxuICAgICAgICAgIGlmIChmaXJzdFJvdW5kSWQpIHtcbiAgICAgICAgICAgIHJvdW5kID0gUm91bmRzLmZpbmRPbmUoZmlyc3RSb3VuZElkKTtcbiAgICAgICAgICAgIHN0YWdlID0gcm91bmQuc3RhZ2VzLmZpbmQocyA9PiBzLl9pZCA9PT0gY3VycmVudFN0YWdlSWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGdhbWVQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgICAgIHBsYXllci5yb3VuZCA9IF8uZXh0ZW5kKHt9LCByb3VuZCk7XG4gICAgICAgICAgICBwbGF5ZXIuc3RhZ2UgPSBfLmV4dGVuZCh7fSwgc3RhZ2UpO1xuICAgICAgICAgICAgYXVnbWVudFBsYXllclN0YWdlUm91bmQocGxheWVyLCBwbGF5ZXIuc3RhZ2UsIHBsYXllci5yb3VuZCwgZ2FtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2FtZVBsYXllcnM7XG4gICAgICB9XG4gICAgfSxcbiAgICByb3VuZHM6IHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgaWYgKCFnYW1lUm91bmRzKSB7XG4gICAgICAgICAgZ2FtZVJvdW5kcyA9IFJvdW5kcy5maW5kKHsgZ2FtZUlkOiBnYW1lLl9pZCB9KS5mZXRjaCgpO1xuICAgICAgICAgIGdhbWVSb3VuZHMuZm9yRWFjaChyb3VuZCA9PiB7XG4gICAgICAgICAgICBsZXQgc3RhZ2VzID0gbnVsbDtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyb3VuZCwgXCJzdGFnZXNcIiwge1xuICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdGFnZXMpIHtcbiAgICAgICAgICAgICAgICAgIHN0YWdlcyA9IFN0YWdlcy5maW5kKHsgcm91bmRJZDogcm91bmQuX2lkIH0pLmZldGNoKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YWdlcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2FtZVJvdW5kcztcbiAgICAgIH1cbiAgICB9LFxuICAgIHN0YWdlczoge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBpZiAoIWdhbWVTdGFnZXMpIHtcbiAgICAgICAgICBnYW1lU3RhZ2VzID0gU3RhZ2VzLmZpbmQoeyBnYW1lSWQ6IGdhbWUuX2lkIH0pLmZldGNoKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2FtZVN0YWdlcztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcbiIsIi8vIGNyZWF0ZS5qc1xuXG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcblxuaW1wb3J0IHsgQmF0Y2hlcyB9IGZyb20gXCIuLi9iYXRjaGVzL2JhdGNoZXMuanNcIjtcbmltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uL2dhbWUtbG9iYmllcy9nYW1lLWxvYmJpZXMuanNcIjtcbmltcG9ydCB7IEdhbWVzIH0gZnJvbSBcIi4vZ2FtZXNcIjtcbmltcG9ydCB7IFBsYXllclJvdW5kcyB9IGZyb20gXCIuLi9wbGF5ZXItcm91bmRzL3BsYXllci1yb3VuZHNcIjtcbmltcG9ydCB7IFBsYXllclN0YWdlcyB9IGZyb20gXCIuLi9wbGF5ZXItc3RhZ2VzL3BsYXllci1zdGFnZXNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi4vcGxheWVycy9wbGF5ZXJzXCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vcm91bmRzL3JvdW5kc1wiO1xuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4uL3N0YWdlcy9zdGFnZXNcIjtcbmltcG9ydCB7IGVhcmx5RXhpdEdhbWVMb2JieSB9IGZyb20gXCIuLi9nYW1lLWxvYmJpZXMvbWV0aG9kc1wiO1xuaW1wb3J0IHtcbiAgYXVnbWVudFBsYXllclN0YWdlUm91bmQsXG4gIGF1Z21lbnRHYW1lU3RhZ2VSb3VuZFxufSBmcm9tIFwiLi4vcGxheWVyLXN0YWdlcy9hdWdtZW50LmpzXCI7XG5pbXBvcnQgeyBhdWdtZW50R2FtZU9iamVjdCB9IGZyb20gXCIuLi9nYW1lcy9hdWdtZW50LmpzXCI7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiLi4vLi4vc2VydmVyXCI7XG5pbXBvcnQgeyB3ZWlnaHRlZFJhbmRvbSB9IGZyb20gXCIuLi8uLi9saWIvdXRpbHMuanNcIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4uLy4uL2xpYi9sb2cuanNcIjtcbmltcG9ydCBnYW1lTG9iYnlMb2NrIGZyb20gXCIuLi8uLi9nYW1lTG9iYnktbG9jay5qc1wiO1xuXG5jb25zdCBhZGRTdGFnZUVyck1zZyA9IGBcInJvdW5kLmFkZFN0YWdlKClcIiByZXF1aXJlcyBhbiBhcmd1bWVudCBvYmplY3Qgd2l0aCAzIHByb3BlcnRpZXM6XG4tIG5hbWU6IGludGVybmFsIG5hbWUgeW91J2xsIHVzZSB0byB3cml0ZSBjb25kaXRpb25hbCBsb2dpYyBpbiB5b3VyIGV4cGVyaW1lbnQuXG4tIGRpc3BsYXlOYW1lOiB0aGUgbmFtZSBvZiB0aGUgU3RhZ2UgdGhlIHBsYXllciB3aWxsIHNlZSBpbiB0aGUgVUkuXG4tIGR1cmF0aW9uSW5TZWNvbmRzOiB0aGUgZHVyYXRpb24gaW4gc2Vjb25kcyBvZiB0aGUgc3RhZ2VcblxuZS5nLjogcm91bmQuYWRkU3RhZ2Uoe1xuICBuYW1lOiBcInJlc3BvbnNlXCIsXG4gIGRpc3BsYXlOYW1lOiBcIlJlc3BvbnNlXCIsXG4gIGR1cmF0aW9uSW5TZWNvbmRzOiAxMjBcbn0pO1xuXG5gO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlR2FtZUZyb21Mb2JieSA9IGdhbWVMb2JieSA9PiB7XG4gIGlmIChHYW1lcy5maW5kKHsgZ2FtZUxvYmJ5SWQ6IGdhbWVMb2JieS5faWQgfSkuY291bnQoKSA+IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwbGF5ZXJzID0gZ2FtZUxvYmJ5LnBsYXllcnMoKTtcblxuICBjb25zdCBiYXRjaCA9IGdhbWVMb2JieS5iYXRjaCgpO1xuICBjb25zdCB0cmVhdG1lbnQgPSBnYW1lTG9iYnkudHJlYXRtZW50KCk7XG4gIGNvbnN0IGZhY3RvcnMgPSB0cmVhdG1lbnQuZmFjdG9yc09iamVjdCgpO1xuICBjb25zdCB7IGJhdGNoSWQsIHRyZWF0bWVudElkLCBzdGF0dXMsIGRlYnVnTW9kZSB9ID0gZ2FtZUxvYmJ5O1xuXG4gIHBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgIHBsYXllci5kYXRhID0gcGxheWVyLmRhdGEgfHwge307XG4gICAgcGxheWVyLnNldCA9IChrZXksIHZhbHVlKSA9PiB7XG4gICAgICBwbGF5ZXIuZGF0YVtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgICBwbGF5ZXIuZ2V0ID0ga2V5ID0+IHtcbiAgICAgIHJldHVybiBwbGF5ZXIuZGF0YVtrZXldO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFzayAoZXhwZXJpbWVudGVyIGRlc2lnbmVyKSBpbml0IGZ1bmN0aW9uIHRvIGNvbmZpZ3VyZSB0aGlzIGdhbWVcbiAgLy8gZ2l2ZW4gdGhlIGZhY3RvcnMgYW5kIHBsYXllcnMgZ2l2ZW4uXG4gIGNvbnN0IHBhcmFtcyA9IHsgZGF0YTogeyAuLi5nYW1lTG9iYnkuZGF0YSB9LCByb3VuZHM6IFtdLCBwbGF5ZXJzIH07XG4gIHZhciBnYW1lQ29sbGVjdG9yID0ge1xuICAgIHBsYXllcnMsXG4gICAgdHJlYXRtZW50OiBmYWN0b3JzLFxuXG4gICAgZ2V0KGspIHtcbiAgICAgIHJldHVybiBwYXJhbXMuZGF0YVtrXTtcbiAgICB9LFxuXG4gICAgc2V0KGssIHYpIHtcbiAgICAgIHBhcmFtcy5kYXRhW2tdID0gdjtcbiAgICB9LFxuXG4gICAgYWRkUm91bmQocHJvcHMpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSBwcm9wcyA/IHByb3BzLmRhdGEgOiB7fSB8fCB7fTtcbiAgICAgIGNvbnN0IHJvdW5kID0geyBkYXRhLCBzdGFnZXM6IFtdIH07XG4gICAgICBwYXJhbXMucm91bmRzLnB1c2gocm91bmQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0KGspIHtcbiAgICAgICAgICByZXR1cm4gcm91bmQuZGF0YVtrXTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXQoaywgdikge1xuICAgICAgICAgIHJvdW5kLmRhdGFba10gPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZFN0YWdlKHsgbmFtZSwgZGlzcGxheU5hbWUsIGR1cmF0aW9uSW5TZWNvbmRzLCBkYXRhID0ge30gfSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIW5hbWUgfHwgIWRpc3BsYXlOYW1lIHx8ICFkdXJhdGlvbkluU2Vjb25kcykge1xuICAgICAgICAgICAgICBsb2cuZXJyb3IoYWRkU3RhZ2VFcnJNc2cpO1xuICAgICAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAgICAgYEdvdDogJHtKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICAgIHsgbmFtZSwgZGlzcGxheU5hbWUsIGR1cmF0aW9uSW5TZWNvbmRzIH0sXG4gICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgXCIgIFwiXG4gICAgICAgICAgICAgICAgKX1gXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIHRocm93IFwiZ2FtZUluaXQgZXJyb3JcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZHVyYXRpb25JblNlY29uZHNBc0ludCA9IHBhcnNlSW50KGR1cmF0aW9uSW5TZWNvbmRzKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgTnVtYmVyLmlzTmFOKGR1cmF0aW9uSW5TZWNvbmRzQXNJbnQpIHx8XG4gICAgICAgICAgICAgIGR1cmF0aW9uSW5TZWNvbmRzQXNJbnQgPCAxXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICBgRXJyb3IgaW4gYWRkU3RhZ2UgY2FsbDogZHVyYXRpb25JblNlY29uZHMgbXVzdCBiZSBhbiBudW1iZXIgPiAwIChuYW1lOiAke25hbWV9KWBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3RhZ2UgPSB7XG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICBkdXJhdGlvbkluU2Vjb25kczogZHVyYXRpb25JblNlY29uZHNBc0ludFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJvdW5kLnN0YWdlcy5wdXNoKHsgLi4uc3RhZ2UsIGRhdGEgfSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5zdGFnZSxcbiAgICAgICAgICAgICAgZ2V0KGspIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YVtrXTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgc2V0KGssIHYpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2tdID0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZWFybHlFeGl0R2FtZUxvYmJ5LmNhbGwoe1xuICAgICAgICAgICAgICBleGl0UmVhc29uOiBcImluaXRFcnJvclwiLFxuICAgICAgICAgICAgICBnYW1lTG9iYnlJZDogZ2FtZUxvYmJ5Ll9pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICB0cnkge1xuICAgIGdhbWVMb2JieUxvY2tbZ2FtZUxvYmJ5Ll9pZF0gPSB0cnVlO1xuICAgIGNvbmZpZy5nYW1lSW5pdChnYW1lQ29sbGVjdG9yLCBmYWN0b3JzKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihgZmF0YWwgZXJyb3IgZW5jb3VudGVyIGNhbGxpbmcgRW1waXJpY2EuZ2FtZUluaXQ6YCk7XG4gICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIGVhcmx5RXhpdEdhbWVMb2JieS5jYWxsKHtcbiAgICAgIGV4aXRSZWFzb246IFwiZ2FtZUVycm9yXCIsXG4gICAgICBnYW1lTG9iYnlJZDogZ2FtZUxvYmJ5Ll9pZFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghcGFyYW1zLnJvdW5kcyB8fCBwYXJhbXMucm91bmRzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IFwiYXQgbGVhc3Qgb25lIHJvdW5kIG11c3QgYmUgYWRkZWQgcGVyIGdhbWVcIjtcbiAgfVxuXG4gIHBhcmFtcy5yb3VuZHMuZm9yRWFjaChyb3VuZCA9PiB7XG4gICAgaWYgKCFyb3VuZC5zdGFnZXMgfHwgcm91bmQuc3RhZ2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgXCJhdCBsZWFzdCBvbmUgc3RhZ2UgbXVzdCBiZSBhZGRlZCBwZXIgcm91bmRcIjtcbiAgICB9XG5cbiAgICByb3VuZC5zdGFnZXMuZm9yRWFjaCgoeyBuYW1lLCBkaXNwbGF5TmFtZSwgZHVyYXRpb25JblNlY29uZHMgfSkgPT4ge1xuICAgICAgLy8gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuIGFzIHdlIGFscmVhZHkgdmVyaWZpZWQgaXQgYWJvdmUuXG4gICAgICBpZiAoIW5hbWUgfHwgIWRpc3BsYXlOYW1lIHx8ICFkdXJhdGlvbkluU2Vjb25kcykge1xuICAgICAgICBsb2cuZXJyb3IoYWRkU3RhZ2VFcnJNc2cpO1xuICAgICAgICB0aHJvdyBcImludmFsaWQgc3RhZ2VcIjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gS2VlcCBkZWJ1ZyBtb2RlIGZyb20gbG9iYnlcbiAgcGFyYW1zLmRlYnVnTW9kZSA9IGRlYnVnTW9kZTtcblxuICAvLyBXZSBuZWVkIHRvIGNyZWF0ZS9jb25maWd1cmUgc3R1ZmYgYXNzb2NpYXRlZCB3aXRoIHRoZSBnYW1lIGJlZm9yZSB3ZVxuICAvLyBjcmVhdGUgaXQgc28gd2UgZ2VuZXJhdGUgdGhlIGlkIGVhcmx5XG4gIGNvbnN0IGdhbWVJZCA9IGdhbWVMb2JieS5faWQ7XG4gIHBhcmFtcy5faWQgPSBnYW1lSWQ7XG4gIHBhcmFtcy5nYW1lTG9iYnlJZCA9IGdhbWVMb2JieS5faWQ7XG4gIC8vIFdlIGFsc28gYWRkIGEgZmV3IHJlbGF0ZWQgb2JqZWN0c1xuICBwYXJhbXMudHJlYXRtZW50SWQgPSB0cmVhdG1lbnRJZDtcbiAgcGFyYW1zLmJhdGNoSWQgPSBiYXRjaElkO1xuICBwYXJhbXMuc3RhdHVzID0gc3RhdHVzO1xuXG4gIC8vIHBsYXllcklkcyBpcyB0aGUgcmVmZXJlbmNlIHRvIHBsYXllcnMgc3RvcmVkIGluIHRoZSBnYW1lIG9iamVjdFxuICBwYXJhbXMucGxheWVySWRzID0gXy5wbHVjayhwYXJhbXMucGxheWVycywgXCJfaWRcIik7XG4gIC8vIFdlIHRoZW4gbmVlZCB0byB2ZXJpZnkgYWxsIHRoZXNlIGlkcyBleGlzdCBhbmQgYXJlIHVuaXF1ZSwgdGhlXG4gIC8vIGluaXQgZnVuY3Rpb24gbWlnaHQgbm90IGhhdmUgcmV0dXJuZWQgdGhlbSBjb3JyZWN0bHlcbiAgY29uc3QgbGVuID0gXy51bmlxKF8uY29tcGFjdChwYXJhbXMucGxheWVySWRzKSkubGVuZ3RoO1xuICBpZiAobGVuICE9PSBwYXJhbXMucGxheWVycy5sZW5ndGggfHwgbGVuICE9PSBwbGF5ZXJzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgcGxheWVyIGNvdW50XCIpO1xuICB9XG5cbiAgLy8gV2Ugd2FudCB0byBjb3B5IG92ZXIgdGhlIGNoYW5nZXMgbWFkZSBieSB0aGUgaW5pdCBmdW5jdGlvbiBhbmQgc2F2ZSB0aGVcbiAgLy8gZ2FtZUlkIGluIHRoZSBwbGF5ZXIgb2JqZWN0cyBhbHJlYWR5IGluIHRoZSBEQlxuICBwYXJhbXMucGxheWVycy5mb3JFYWNoKCh7IF9pZCwgZGF0YSB9KSA9PiB7XG4gICAgUGxheWVycy51cGRhdGUoXG4gICAgICBfaWQsXG4gICAgICB7ICRzZXQ6IHsgZ2FtZUlkLCBkYXRhIH0gfSxcbiAgICAgIHtcbiAgICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZVxuICAgICAgfVxuICAgICk7XG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgcm91bmQgb2JqZWN0c1xuICBsZXQgc3RhZ2VJbmRleCA9IDA7XG4gIGxldCB0b3RhbER1cmF0aW9uID0gMDtcbiAgbGV0IGZpcnN0Um91bmRJZDtcblxuICBjb25zdCBpbnNlcnRPcHRpb24gPSB7XG4gICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgIGZpbHRlcjogZmFsc2UsXG4gICAgdmFsaWRhdGU6IGZhbHNlLFxuICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlXG4gIH07XG5cbiAgbGV0IFN0YWdlc1VwZGF0ZU9wID0gU3RhZ2VzLnJhd0NvbGxlY3Rpb24oKS5pbml0aWFsaXplVW5vcmRlcmVkQnVsa09wKCk7XG4gIGxldCBSb3VuZHNPcCA9IFJvdW5kcy5yYXdDb2xsZWN0aW9uKCkuaW5pdGlhbGl6ZVVub3JkZXJlZEJ1bGtPcCgpO1xuICBsZXQgU3RhZ2VzT3AgPSBTdGFnZXMucmF3Q29sbGVjdGlvbigpLmluaXRpYWxpemVVbm9yZGVyZWRCdWxrT3AoKTtcbiAgbGV0IHJvdW5kc09wUmVzdWx0O1xuICBsZXQgc3RhZ2VzT3BSZXN1bHQ7XG5cbiAgcGFyYW1zLnJvdW5kcy5mb3JFYWNoKChyb3VuZCwgaW5kZXgpID0+XG4gICAgUm91bmRzT3AuaW5zZXJ0KFxuICAgICAgXy5leHRlbmQoXG4gICAgICAgIHtcbiAgICAgICAgICBnYW1lSWQsXG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgX2lkOiBSYW5kb20uaWQoKSxcbiAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgZGF0YToge31cbiAgICAgICAgfSxcbiAgICAgICAgcm91bmRcbiAgICAgICksXG4gICAgICBpbnNlcnRPcHRpb25cbiAgICApXG4gICk7XG5cbiAgcm91bmRzT3BSZXN1bHQgPSBNZXRlb3Iud3JhcEFzeW5jKFJvdW5kc09wLmV4ZWN1dGUsIFJvdW5kc09wKSgpO1xuXG4gIGNvbnN0IHJvdW5kSWRzID0gcm91bmRzT3BSZXN1bHQuZ2V0SW5zZXJ0ZWRJZHMoKS5tYXAoaWRzID0+IGlkcy5faWQpO1xuICBwYXJhbXMucm91bmRJZHMgPSByb3VuZElkcztcbiAgUm91bmRzT3AgPSBSb3VuZHMucmF3Q29sbGVjdGlvbigpLmluaXRpYWxpemVVbm9yZGVyZWRCdWxrT3AoKTtcblxuICBwYXJhbXMucm91bmRzLmZvckVhY2goKHJvdW5kLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHJvdW5kSWQgPSByb3VuZElkc1tpbmRleF07XG4gICAgY29uc3QgeyBwbGF5ZXJzIH0gPSBwYXJhbXM7XG5cbiAgICBTdGFnZXNPcCA9IFN0YWdlcy5yYXdDb2xsZWN0aW9uKCkuaW5pdGlhbGl6ZVVub3JkZXJlZEJ1bGtPcCgpO1xuICAgIGxldCBQbGF5ZXJTdGFnZXNPcCA9IFBsYXllclN0YWdlcy5yYXdDb2xsZWN0aW9uKCkuaW5pdGlhbGl6ZVVub3JkZXJlZEJ1bGtPcCgpO1xuICAgIGxldCBQbGF5ZXJSb3VuZHNPcCA9IFBsYXllclJvdW5kcy5yYXdDb2xsZWN0aW9uKCkuaW5pdGlhbGl6ZVVub3JkZXJlZEJ1bGtPcCgpO1xuXG4gICAgcm91bmQuc3RhZ2VzLmZvckVhY2goc3RhZ2UgPT4ge1xuICAgICAgaWYgKGJhdGNoLmRlYnVnTW9kZSkge1xuICAgICAgICBzdGFnZS5kdXJhdGlvbkluU2Vjb25kcyA9IDYwICogNjA7IC8vIFN0YWdlIHRpbWUgaW4gZGVidWdNb2RlIGlzIDFoXG4gICAgICB9XG5cbiAgICAgIHRvdGFsRHVyYXRpb24gKz0gc3RhZ2UuZHVyYXRpb25JblNlY29uZHM7XG5cbiAgICAgIGNvbnN0IHNQYXJhbXMgPSBfLmV4dGVuZChcbiAgICAgICAge1xuICAgICAgICAgIGdhbWVJZCxcbiAgICAgICAgICByb3VuZElkLFxuICAgICAgICAgIGluZGV4OiBzdGFnZUluZGV4LFxuICAgICAgICAgIF9pZDogUmFuZG9tLmlkKCksXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgIH0sXG4gICAgICAgIHN0YWdlXG4gICAgICApO1xuXG4gICAgICBTdGFnZXNPcC5pbnNlcnQoc1BhcmFtcywgaW5zZXJ0T3B0aW9uKTtcblxuICAgICAgc3RhZ2VJbmRleCsrO1xuICAgIH0pO1xuXG4gICAgc3RhZ2VzT3BSZXN1bHQgPSBNZXRlb3Iud3JhcEFzeW5jKFN0YWdlc09wLmV4ZWN1dGUsIFN0YWdlc09wKSgpO1xuICAgIGNvbnN0IHN0YWdlSWRzID0gc3RhZ2VzT3BSZXN1bHQuZ2V0SW5zZXJ0ZWRJZHMoKS5tYXAoaWRzID0+IGlkcy5faWQpO1xuXG4gICAgc3RhZ2VJZHMuZm9yRWFjaChzdGFnZUlkID0+IHtcbiAgICAgIGlmICghcGFyYW1zLmN1cnJlbnRTdGFnZUlkKSB7XG4gICAgICAgIGZpcnN0Um91bmRJZCA9IHJvdW5kSWQ7XG4gICAgICAgIHBhcmFtcy5jdXJyZW50U3RhZ2VJZCA9IHN0YWdlSWQ7XG4gICAgICB9XG5cbiAgICAgIHBsYXllcnMuZm9yRWFjaCgoeyBfaWQ6IHBsYXllcklkIH0pID0+XG4gICAgICAgIFBsYXllclN0YWdlc09wLmluc2VydCh7XG4gICAgICAgICAgcGxheWVySWQsXG4gICAgICAgICAgc3RhZ2VJZCxcbiAgICAgICAgICByb3VuZElkLFxuICAgICAgICAgIGdhbWVJZCxcbiAgICAgICAgICBiYXRjaElkLFxuICAgICAgICAgIF9pZDogUmFuZG9tLmlkKCksXG4gICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGRhdGE6IHt9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgY29uc3QgcGxheWVyU3RhZ2VzUmVzdWx0ID0gTWV0ZW9yLndyYXBBc3luYyhcbiAgICAgIFBsYXllclN0YWdlc09wLmV4ZWN1dGUsXG4gICAgICBQbGF5ZXJTdGFnZXNPcFxuICAgICkoKTtcbiAgICBjb25zdCBwbGF5ZXJTdGFnZUlkcyA9IHBsYXllclN0YWdlc1Jlc3VsdFxuICAgICAgLmdldEluc2VydGVkSWRzKClcbiAgICAgIC5tYXAoaWRzID0+IGlkcy5faWQpO1xuXG4gICAgc3RhZ2VJZHMuZm9yRWFjaChzdGFnZUlkID0+XG4gICAgICBTdGFnZXNVcGRhdGVPcC5maW5kKHsgX2lkOiBzdGFnZUlkIH0pXG4gICAgICAgIC51cHNlcnQoKVxuICAgICAgICAudXBkYXRlT25lKHsgJHNldDogeyBwbGF5ZXJTdGFnZUlkcywgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpIH0gfSlcbiAgICApO1xuXG4gICAgcGxheWVycy5mb3JFYWNoKCh7IF9pZDogcGxheWVySWQgfSkgPT5cbiAgICAgIFBsYXllclJvdW5kc09wLmluc2VydCh7XG4gICAgICAgIHBsYXllcklkLFxuICAgICAgICByb3VuZElkLFxuICAgICAgICBnYW1lSWQsXG4gICAgICAgIGJhdGNoSWQsXG4gICAgICAgIF9pZDogUmFuZG9tLmlkKCksXG4gICAgICAgIGRhdGE6IHt9LFxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKClcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IHBsYXllclJvdW5kSWRzUmVzdWx0ID0gTWV0ZW9yLndyYXBBc3luYyhcbiAgICAgIFBsYXllclJvdW5kc09wLmV4ZWN1dGUsXG4gICAgICBQbGF5ZXJSb3VuZHNPcFxuICAgICkoKTtcbiAgICBjb25zdCBwbGF5ZXJSb3VuZElkcyA9IHBsYXllclJvdW5kSWRzUmVzdWx0XG4gICAgICAuZ2V0SW5zZXJ0ZWRJZHMoKVxuICAgICAgLm1hcChpZHMgPT4gaWRzLl9pZCk7XG5cbiAgICBSb3VuZHNPcC5maW5kKHsgX2lkOiByb3VuZElkIH0pXG4gICAgICAudXBzZXJ0KClcbiAgICAgIC51cGRhdGVPbmUoeyAkc2V0OiB7IHN0YWdlSWRzLCBwbGF5ZXJSb3VuZElkcywgdXBkYXRlZEF0OiBuZXcgRGF0ZSgpIH0gfSk7XG4gIH0pO1xuXG4gIE1ldGVvci53cmFwQXN5bmMoU3RhZ2VzVXBkYXRlT3AuZXhlY3V0ZSwgU3RhZ2VzVXBkYXRlT3ApKCk7XG4gIE1ldGVvci53cmFwQXN5bmMoUm91bmRzT3AuZXhlY3V0ZSwgUm91bmRzT3ApKCk7XG5cbiAgLy8gQW4gZXN0aW1hdGlvbiBvZiB0aGUgZmluaXNoIHRpbWUgdG8gaGVscCBxdWVyeWluZy5cbiAgLy8gQXQgdGhlIG1vbWVudCwgdGhpcyB3aWxsIDEwMCUgYnJlYWsgd2l0aCBwYXVzaW5nIHRoZSBnYW1lL2JhdGNoLlxuICBwYXJhbXMuZXN0RmluaXNoZWRUaW1lID0gbW9tZW50KClcbiAgICAvLyBHaXZlIGl0IGFuIGV4dHJhIDI0aCAoODY0MDBzKSB3aW5kb3cgZm9yIHRoZSBpbnRlci1zdGFnZSBzeW5jIGJ1ZmZlci5cbiAgICAvLyBJdCB3YXMgNSBtaW4gYW5kIHRoYXQgZmFpbGVkIG9uIGFuIGV4cGVyaW1lbnQgd2l0aCBtYW55IHJvdW5kcy5cbiAgICAvLyBUaGlzIHZhbHVlIGlzIG5vdCBleHRyZW1lbHkgdXNlZnVsLCBpdCdzIG1haW4gcHVycG9zZSBpcyBjdXJyZW50bHlcbiAgICAvLyB0byBzdG9wIHF1ZXJ5aW5nIGdhbWVzIGluZGVmaW5pdGVseSBpbiB0aGUgdXBkYXRlIGdhbWUgYmFja2dyb3VuZCBqb2IuXG4gICAgLy8gSXQgd2FzIGFsc28gbWVhbnQgdG8gYmUgYW4gYXBwcm94aW1hdGUgZXN0aW1hdGUgZm9yIHdoZW4gdGhlIGdhbWUgY291bGRcbiAgICAvLyBlbmQgYXQgdGhlIG1heGltdW0sIHRoYXQgd2UgY291bGQgc2hvdyBpbiB0aGUgYWRtaW4sIGJ1dCBpdCBjYW4gbm8gbG9uZ2VyXG4gICAgLy8gd29yaywgYW5kIGl0IGlzIHF1ZXN0aW9uYWJsZSBpZiB0aGUgXCJzdG9wIHF1ZXJ5aW5nXCIgXCJmZWF0dXJlXCIgaXMgc3RpbGxcbiAgICAvLyBhZGVxdWF0ZS5cbiAgICAuYWRkKHRvdGFsRHVyYXRpb24gKyA4NjQwMCwgXCJzZWNvbmRzXCIpXG4gICAgLnRvRGF0ZSgpO1xuXG4gIC8vIFdlJ3JlIG5vIGxvbmdlciBmaWx0ZXJpbmcgb3V0IHVuc3BlY2lmaWVkIGZpZWxkcyBvbiBpbnNlcnQgYmVjYXVzZSBvZiBhXG4gIC8vIHNpbXBsZXNjaGVtYSBidWcsIHNvIHdlIG5lZWQgdG8gcmVtb3ZlIGludmFsaWQgcGFyYW1zIG5vdy5cbiAgZGVsZXRlIHBhcmFtcy5wbGF5ZXJzO1xuICBkZWxldGUgcGFyYW1zLnJvdW5kcztcblxuICAvLyBJbnNlcnQgZ2FtZS4gQXMgc29vbiBhcyBpdCBjb21lcyBvbmxpbmUsIHRoZSBnYW1lIHdpbGwgc3RhcnQgZm9yIHRoZVxuICAvLyBwbGF5ZXJzIHNvIGFsbCByZWxhdGVkIG9iamVjdCAocm91bmRzLCBzdGFnZXMsIHBsYXllcnMpIG11c3QgYmUgY3JlYXRlZFxuICAvLyBhbmQgcmVhZHlcbiAgR2FtZXMuaW5zZXJ0KHBhcmFtcywge1xuICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICBmaWx0ZXI6IGZhbHNlLFxuICAgIHZhbGlkYXRlOiBmYWxzZSxcbiAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZVxuICB9KTtcblxuICAvLyBMZXQgR2FtZSBMb2JieSBrbm93IEdhbWUgSURcbiAgR2FtZUxvYmJpZXMudXBkYXRlKGdhbWVMb2JieS5faWQsIHsgJHNldDogeyBnYW1lSWQgfSB9KTtcblxuICAvL1xuICAvLyBPdmVyYm9va2luZ1xuICAvL1xuXG4gIC8vIE92ZXJib29rZWQgcGxheWVycyB0aGF0IGRpZCBub3QgZmluaXNoIHRoZSBpbnRybyBhbmQgd29uJ3QgYmUgaW4gdGhpcyBnYW1lXG4gIGNvbnN0IGZhaWxlZFBsYXllcklkcyA9IF8uZGlmZmVyZW5jZShcbiAgICBnYW1lTG9iYnkucXVldWVkUGxheWVySWRzLFxuICAgIGdhbWVMb2JieS5wbGF5ZXJJZHNcbiAgKTtcblxuICBzZW5kUGxheWVyc1RvTmV4dEJhdGNoZXMoZmFpbGVkUGxheWVySWRzLCBiYXRjaElkLCBnYW1lTG9iYnkpO1xuXG4gIC8vXG4gIC8vIENhbGwgdGhlIGNhbGxiYWNrc1xuICAvL1xuXG4gIGNvbnN0IHsgb25Sb3VuZFN0YXJ0LCBvbkdhbWVTdGFydCwgb25TdGFnZVN0YXJ0IH0gPSBjb25maWc7XG4gIGlmICgob25HYW1lU3RhcnQgfHwgb25Sb3VuZFN0YXJ0IHx8IG9uU3RhZ2VTdGFydCkgJiYgZmlyc3RSb3VuZElkKSB7XG4gICAgY29uc3QgZ2FtZSA9IEdhbWVzLmZpbmRPbmUoZ2FtZUlkKTtcblxuICAgIGF1Z21lbnRHYW1lT2JqZWN0KHtcbiAgICAgIGdhbWUsXG4gICAgICB0cmVhdG1lbnQsXG4gICAgICBmaXJzdFJvdW5kSWQsXG4gICAgICBjdXJyZW50U3RhZ2VJZDogcGFyYW1zLmN1cnJlbnRTdGFnZUlkXG4gICAgfSk7XG5cbiAgICBjb25zdCBuZXh0Um91bmQgPSBnYW1lLnJvdW5kcy5maW5kKHIgPT4gci5faWQgPT09IGZpcnN0Um91bmRJZCk7XG4gICAgY29uc3QgbmV4dFN0YWdlID0gbmV4dFJvdW5kLnN0YWdlcy5maW5kKFxuICAgICAgcyA9PiBzLl9pZCA9PT0gcGFyYW1zLmN1cnJlbnRTdGFnZUlkXG4gICAgKTtcblxuICAgIGF1Z21lbnRHYW1lU3RhZ2VSb3VuZChnYW1lLCBuZXh0U3RhZ2UsIG5leHRSb3VuZCk7XG5cbiAgICBpZiAob25HYW1lU3RhcnQpIHtcbiAgICAgIG9uR2FtZVN0YXJ0KGdhbWUpO1xuICAgIH1cbiAgICBpZiAob25Sb3VuZFN0YXJ0KSB7XG4gICAgICBvblJvdW5kU3RhcnQoZ2FtZSwgbmV4dFJvdW5kKTtcbiAgICB9XG4gICAgaWYgKG9uU3RhZ2VTdGFydCkge1xuICAgICAgb25TdGFnZVN0YXJ0KGdhbWUsIG5leHRSb3VuZCwgbmV4dFN0YWdlKTtcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBTdGFydCB0aGUgZ2FtZVxuICAvL1xuXG4gIGNvbnN0IHN0YXJ0VGltZUF0ID0gbW9tZW50KClcbiAgICAuYWRkKFN0YWdlcy5zdGFnZVBhZGRpbmdEdXJhdGlvbilcbiAgICAudG9EYXRlKCk7XG5cbiAgU3RhZ2VzLnVwZGF0ZShwYXJhbXMuY3VycmVudFN0YWdlSWQsIHtcbiAgICAkc2V0OiB7XG4gICAgICBzdGFydFRpbWVBdFxuICAgIH1cbiAgfSk7XG5cbiAgZGVsZXRlIGdhbWVMb2JieUxvY2tbZ2FtZUxvYmJ5Ll9pZF07XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gc2VuZFBsYXllcnNUb05leHRCYXRjaGVzKHBsYXllcklkcywgYmF0Y2hJZCwgZ2FtZUxvYmJ5KSB7XG4gIC8vIEZpbmQgb3RoZXIgbG9iYmllcyB0aGF0IGFyZSBub3QgZnVsbCB5ZXQgd2l0aCB0aGUgc2FtZSB0cmVhdG1lbnRcbiAgY29uc3QgcnVubmluZ0JhdGNoZXMgPSBCYXRjaGVzLmZpbmQoXG4gICAgeyBfaWQ6IHsgJG5lOiBiYXRjaElkIH0sIHN0YXR1czogXCJydW5uaW5nXCIgfSxcbiAgICB7IHNvcnQ6IHsgcnVubmluZ0F0OiAxIH0gfVxuICApO1xuICBjb25zdCB7IHRyZWF0bWVudElkIH0gPSBnYW1lTG9iYnk7XG4gIGNvbnN0IGxvYmJpZXNHcm91cHMgPSBydW5uaW5nQmF0Y2hlcy5tYXAoKCkgPT4gW10pO1xuICBjb25zdCBydW5uaW5nQmF0Y2hlSWRzID0gcnVubmluZ0JhdGNoZXMubWFwKGIgPT4gYi5faWQpO1xuICBsb2JiaWVzR3JvdXBzLnB1c2goW10pO1xuICBjb25zdCBwb3NzaWJsZUxvYmJpZXMgPSBHYW1lTG9iYmllcy5maW5kKHtcbiAgICBfaWQ6IHsgJG5lOiBnYW1lTG9iYnkuX2lkIH0sXG4gICAgc3RhdHVzOiBcInJ1bm5pbmdcIixcbiAgICB0aW1lZE91dEF0OiB7XG4gICAgICAkZXhpc3RzOiBmYWxzZVxuICAgIH0sXG4gICAgZ2FtZUlkOiB7ICRleGlzdHM6IGZhbHNlIH0sXG4gICAgdHJlYXRtZW50SWRcbiAgfSkuZmV0Y2goKTtcbiAgcG9zc2libGVMb2JiaWVzLmZvckVhY2gobG9iYnkgPT4ge1xuICAgIGlmIChsb2JieS5iYXRjaElkID09PSBiYXRjaElkKSB7XG4gICAgICBsb2JiaWVzR3JvdXBzWzBdLnB1c2gobG9iYnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2JiaWVzR3JvdXBzW3J1bm5pbmdCYXRjaGVJZHMuaW5kZXhPZihsb2JieS5iYXRjaElkKSArIDFdLnB1c2gobG9iYnkpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gSWYgbm8gbG9iYmllcyBsZWZ0LCBsZWFkIHBsYXllcnMgdG8gZXhpdFxuICBpZiAocG9zc2libGVMb2JiaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChwbGF5ZXJJZHMubGVuZ3RoID4gMCkge1xuICAgICAgUGxheWVycy51cGRhdGUoXG4gICAgICAgIHsgX2lkOiB7ICRpbjogcGxheWVySWRzIH0gfSxcbiAgICAgICAgeyAkc2V0OiB7IGV4aXRBdDogbmV3IERhdGUoKSwgZXhpdFN0YXR1czogXCJnYW1lRnVsbFwiIH0gfSxcbiAgICAgICAgeyBtdWx0aTogdHJ1ZSB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbG9iYmllc0dyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGxvYmJpZXMgPSBsb2JiaWVzR3JvdXBzW2ldO1xuXG4gICAgaWYgKGxvYmJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgbG9iYmllcyByZW1haW5pbmcsIGRpc3RyaWJ1dGUgdGhlbSBhY3Jvc3MgdGhlIGxvYmJpZXNcbiAgICAvLyBwcm9wb3J0aW5hbGx5IHRvIHRoZSBpbml0aWFsIHBsYXllckNvdW50XG4gICAgY29uc3Qgd2VpZ3RoZWRMb2JieVBvb2wgPSB3ZWlnaHRlZFJhbmRvbShcbiAgICAgIGxvYmJpZXMubWFwKGxvYmJ5ID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB2YWx1ZTogbG9iYnksXG4gICAgICAgICAgd2VpZ2h0OiBsb2JieS5hdmFpbGFibGVDb3VudFxuICAgICAgICB9O1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJJZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsYXllcklkID0gcGxheWVySWRzW2ldO1xuICAgICAgY29uc3QgbG9iYnkgPSB3ZWlndGhlZExvYmJ5UG9vbCgpO1xuXG4gICAgICAvLyBBZGRpbmcgdGhlIHBsYXllciB0byBzcGVjaWZpZWQgbG9iYnkgcXVldWVcbiAgICAgIGNvbnN0ICRhZGRUb1NldCA9IHsgcXVldWVkUGxheWVySWRzOiBwbGF5ZXJJZCB9O1xuICAgICAgaWYgKGdhbWVMb2JieS5wbGF5ZXJJZHMuaW5jbHVkZXMocGxheWVySWQpKSB7XG4gICAgICAgICRhZGRUb1NldC5wbGF5ZXJJZHMgPSBwbGF5ZXJJZDtcbiAgICAgIH1cbiAgICAgIEdhbWVMb2JiaWVzLnVwZGF0ZShsb2JieS5faWQsIHsgJGFkZFRvU2V0IH0pO1xuXG4gICAgICBQbGF5ZXJzLnVwZGF0ZShwbGF5ZXJJZCwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZ2FtZUxvYmJ5SWQ6IGxvYmJ5Ll9pZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBicmVhaztcbiAgfVxufVxuIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tIFwic2ltcGwtc2NoZW1hXCI7XG5pbXBvcnQgeyBDb3VudGVyIH0gZnJvbSBcIi4uLy4uL2xpYi9jb3VudGVyc1wiO1xuaW1wb3J0IHsgc3RhdHVzU2NoZW1hIH0gZnJvbSBcIi4uL2JhdGNoZXMvc3RhdHVzLXNjaGVtYVwiO1xuaW1wb3J0IHsgQmVsb25nc1RvLCBIYXNNYW55QnlSZWYsIFRpbWVzdGFtcFNjaGVtYSB9IGZyb20gXCIuLi9kZWZhdWx0LXNjaGVtYXNcIjtcbmltcG9ydCB7IERlYnVnTW9kZVNjaGVtYSwgVXNlckRhdGFTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzLmpzXCI7XG5pbXBvcnQgeyBHYW1lTG9iYmllcyB9IGZyb20gXCIuLi9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzXCI7XG5pbXBvcnQgeyBUcmVhdG1lbnRzIH0gZnJvbSBcIi4uL3RyZWF0bWVudHMvdHJlYXRtZW50c1wiO1xuaW1wb3J0IHsgQmF0Y2hlcyB9IGZyb20gXCIuLi9iYXRjaGVzL2JhdGNoZXNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi4vcGxheWVycy9wbGF5ZXJzXCI7XG5pbXBvcnQgeyBTdGFnZXMgfSBmcm9tIFwiLi4vc3RhZ2VzL3N0YWdlc1wiO1xuaW1wb3J0IHsgUm91bmRzIH0gZnJvbSBcIi4uL3JvdW5kcy9yb3VuZHNcIjtcblxuY2xhc3MgR2FtZXNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgZG9jLmluZGV4ID0gQ291bnRlci5pbmMoXCJnYW1lc1wiKTtcbiAgICByZXR1cm4gc3VwZXIuaW5zZXJ0KGRvYywgY2FsbGJhY2spO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBHYW1lcyA9IG5ldyBHYW1lc0NvbGxlY3Rpb24oXCJnYW1lc1wiKTtcblxuR2FtZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8vIEF1dG8taW5jcmVtZW50ZWQgbnVtYmVyIGFzc2lnbmVkIHRvIGdhbWVzIGFzIHRoZXkgYXJlIGNyZWF0ZWRcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlclxuICB9LFxuXG4gIC8vIGVzdEZpbmlzaGVkVGltZSBpcyBhZGRpbmcgdXAgYWxsIHN0YWdlcyB0aW1pbmdzIHdoZW4gdGhlIGdhbWUgaXNcbiAgLy8gY3JlYXRlZC9zdGFydGVkIHRvIGVzdGltYXRlIHdoZW4gdGhlIGdhbWUgc2hvdWxkIGJlIGRvbmUgYXQgdGhlIGxhdGVzdHMuXG4gIGVzdEZpbmlzaGVkVGltZToge1xuICAgIHR5cGU6IERhdGUsXG4gICAgaW5kZXg6IDFcbiAgfSxcblxuICAvLyBUaW1lIHRoZSBnYW1lIGFjdHVhbGx5IGZpbmlzaGVkXG4gIGZpbmlzaGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGluZGV4OiAxXG4gIH0sXG5cbiAgLy8gSW5kaWNhdGVzIHdoaWNoIHN0YWdlIGlzIG9uZ29pbmdcbiAgY3VycmVudFN0YWdlSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICBpbmRleDogMVxuICB9LFxuXG4gIGVuZFJlYXNvbjoge1xuICAgIGxhYmVsOiBcIkVuZGVkIFJlYXNvblwiLFxuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogL1thLXpBLVowLTlfXSsvXG4gIH1cbn0pO1xuXG5pZiAoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQgfHwgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5kZWJ1Z19nYW1lRGVidWdNb2RlKSB7XG4gIEdhbWVzLnNjaGVtYS5leHRlbmQoRGVidWdNb2RlU2NoZW1hKTtcbn1cblxuR2FtZXMuc2NoZW1hLmV4dGVuZChUaW1lc3RhbXBTY2hlbWEpO1xuR2FtZXMuc2NoZW1hLmV4dGVuZChVc2VyRGF0YVNjaGVtYSk7XG5HYW1lcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkdhbWVMb2JiaWVzXCIsIGZhbHNlKSk7XG5HYW1lcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIlRyZWF0bWVudHNcIikpO1xuR2FtZXMuc2NoZW1hLmV4dGVuZChIYXNNYW55QnlSZWYoXCJSb3VuZHNcIikpO1xuR2FtZXMuc2NoZW1hLmV4dGVuZChIYXNNYW55QnlSZWYoXCJQbGF5ZXJzXCIpKTtcbkdhbWVzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiQmF0Y2hlc1wiKSk7XG4vLyBXZSBhcmUgZGVub3JtYWxpemluZyB0aGUgcGFyZW50IGJhdGNoIHN0YXR1cyBpbiBvcmRlciB0byBtYWtlIGNsZWFuIHF1ZXJpZXNcbkdhbWVzLnNjaGVtYS5leHRlbmQoc3RhdHVzU2NoZW1hKTtcbkdhbWVzLmF0dGFjaFNjaGVtYShHYW1lcy5zY2hlbWEpO1xuIiwiLy8gU2VlIGlmIGV2ZXJ5b25lIGlzIGRvbmUgd2l0aCB0aGlzIHN0YWdlXG5pbXBvcnQgeyBCYXRjaGVzIH0gZnJvbSBcIi4uL2JhdGNoZXMvYmF0Y2hlc1wiO1xuaW1wb3J0IHsgR2FtZUxvYmJpZXMgfSBmcm9tIFwiLi4vZ2FtZS1sb2JiaWVzL2dhbWUtbG9iYmllc1wiO1xuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi4vZ2FtZXMvZ2FtZXNcIjtcblxuZXhwb3J0IGNvbnN0IGNoZWNrQmF0Y2hGdWxsID0gYmF0Y2hJZCA9PiB7XG4gIGNvbnN0IGJhdGNoID0gQmF0Y2hlcy5maW5kT25lKGJhdGNoSWQpO1xuICBpZiAoIWJhdGNoKSB7XG4gICAgdGhyb3cgYGJhdGNoIGZvciBnYW1lIG1pc3NpbmcuIGJhdGNoSWQ6ICR7YmF0Y2hJZH1gO1xuICB9XG5cbiAgY29uc3QgZXhwZWN0ZWRHYW1lc0NvdW50ID0gYmF0Y2guZ2FtZUNvdW50KCk7XG4gIGNvbnN0IGdhbWVzQ291bnQgPSBHYW1lcy5maW5kKHsgYmF0Y2hJZCB9KS5jb3VudCgpO1xuICBjb25zdCB0aW1lT3V0R2FtZUxvYmJpZXNDb3VudCA9IEdhbWVMb2JiaWVzLmZpbmQoe1xuICAgIGJhdGNoSWQsXG4gICAgdGltZWRPdXRBdDogeyAkZXhpc3RzOiB0cnVlIH1cbiAgfSkuY291bnQoKTtcblxuICBpZiAoZXhwZWN0ZWRHYW1lc0NvdW50ID09PSBnYW1lc0NvdW50ICsgdGltZU91dEdhbWVMb2JiaWVzQ291bnQpIHtcbiAgICBCYXRjaGVzLnVwZGF0ZShiYXRjaElkLCB7ICRzZXQ6IHsgZnVsbDogdHJ1ZSB9IH0pO1xuICB9XG59O1xuXG4vLyBJZiBhbGwgZ2FtZXMgZm9yIGJhdGNoIGFyZSBmaWxsZWQsIGNoYW5nZSBiYXRjaCBzdGF0dXNcbkdhbWVzLmFmdGVyLmluc2VydChmdW5jdGlvbih1c2VySWQsIHsgYmF0Y2hJZCB9KSB7XG4gIGNoZWNrQmF0Y2hGdWxsKGJhdGNoSWQpO1xufSk7XG5cbmV4cG9ydCBjb25zdCBjaGVja0ZvckJhdGNoRmluaXNoZWQgPSBiYXRjaElkID0+IHtcbiAgLy8gRmluZCBnYW1lcyB0aGF0IGFyZSBub3QgZmluaXNoZWRcbiAgY29uc3QgZ2FtZVF1ZXJ5ID0geyBiYXRjaElkLCBmaW5pc2hlZEF0OiB7ICRleGlzdHM6IGZhbHNlIH0gfTtcbiAgY29uc3QgZ2FtZXNDb3VudCA9IEdhbWVzLmZpbmQoZ2FtZVF1ZXJ5KS5jb3VudCgpO1xuICBjb25zdCBub0dhbWVzTGVmdCA9IGdhbWVzQ291bnQgPT09IDA7XG5cbiAgLy8gRmluZCBnYW1lIGxvYmJpZXMgdGhhdCBoYXZlbid0IGJlZW4gdHJhbnNmb3JtZWQgaW50byBnYW1lcyBhbmQgdGhhdCBoYXZlbid0IHRpbWVkb3V0XG4gIGNvbnN0IGdhbWVMb2JiaWVzUXVlcnkgPSB7XG4gICAgYmF0Y2hJZCxcbiAgICBnYW1lSWQ6IHsgJGV4aXN0czogZmFsc2UgfSxcbiAgICB0aW1lZE91dEF0OiB7ICRleGlzdHM6IGZhbHNlIH1cbiAgfTtcbiAgY29uc3QgbG9iYmllc0NvdW50ID0gR2FtZUxvYmJpZXMuZmluZChnYW1lTG9iYmllc1F1ZXJ5KS5jb3VudCgpO1xuICBjb25zdCBub0dhbWVMb2JiaWVzTGVmdCA9IGxvYmJpZXNDb3VudCA9PT0gMDtcblxuICBpZiAobm9HYW1lc0xlZnQgJiYgbm9HYW1lTG9iYmllc0xlZnQpIHtcbiAgICBCYXRjaGVzLnVwZGF0ZShiYXRjaElkLCB7XG4gICAgICAkc2V0OiB7IHN0YXR1czogXCJmaW5pc2hlZFwiLCBmaW5pc2hlZEF0OiBuZXcgRGF0ZSgpIH1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gQ2hlY2sgaWYgYWxsIGdhbWVzIGZpbmlzaGVkLCBtYXJrIGJhdGNoIGFzIGZpbmlzaGVkXG5HYW1lcy5hZnRlci51cGRhdGUoXG4gIGZ1bmN0aW9uKHVzZXJJZCwgeyBiYXRjaElkIH0sIGZpZWxkTmFtZXMsIG1vZGlmaWVyLCBvcHRpb25zKSB7XG4gICAgaWYgKCFmaWVsZE5hbWVzLmluY2x1ZGVzKFwiZmluaXNoZWRBdFwiKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNoZWNrRm9yQmF0Y2hGaW5pc2hlZChiYXRjaElkKTtcbiAgfSxcbiAgeyBmZXRjaFByZXZpb3VzOiBmYWxzZSB9XG4pO1xuIiwiaW1wb3J0IHNoYXJlZCBmcm9tIFwiLi4vLi4vc2hhcmVkLmpzXCI7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi9nYW1lcy5qc1wiO1xuaW1wb3J0IHsgR2FtZUxvYmJpZXMgfSBmcm9tIFwiLi4vZ2FtZS1sb2JiaWVzL2dhbWUtbG9iYmllcy5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IFN0YWdlcyB9IGZyb20gXCIuLi9zdGFnZXMvc3RhZ2VzLmpzXCI7XG5pbXBvcnQgeyBCYXRjaGVzIH0gZnJvbSBcIi4uL2JhdGNoZXMvYmF0Y2hlcy5qc1wiO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlR2FtZURhdGEgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJHYW1lcy5tZXRob2RzLnVwZGF0ZURhdGFcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgZ2FtZUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBrZXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgYXBwZW5kOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIG5vQ2FsbGJhY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSkudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgZ2FtZUlkLCBrZXksIHZhbHVlLCBhcHBlbmQsIG5vQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IGdhbWUgPSBHYW1lcy5maW5kT25lKGdhbWVJZCk7XG4gICAgaWYgKCFnYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnYW1lIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgLy8gVE9ETyBjaGVjayBjYW4gdXBkYXRlIHRoaXMgcmVjb3JkIGdhbWVcblxuICAgIGNvbnN0IHZhbCA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgIGxldCB1cGRhdGUgPSB7IFtgZGF0YS4ke2tleX1gXTogdmFsIH07XG4gICAgY29uc3QgbW9kaWZpZXIgPSBhcHBlbmQgPyB7ICRwdXNoOiB1cGRhdGUgfSA6IHsgJHNldDogdXBkYXRlIH07XG5cbiAgICBHYW1lcy51cGRhdGUoZ2FtZUlkLCBtb2RpZmllciwge1xuICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRlOiBmYWxzZSxcbiAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2VcbiAgICB9KTtcblxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgIW5vQ2FsbGJhY2spIHtcbiAgICAgIHNoYXJlZC5jYWxsT25DaGFuZ2Uoe1xuICAgICAgICBjb25uOiB0aGlzLmNvbm5lY3Rpb24sXG4gICAgICAgIGdhbWVJZCxcbiAgICAgICAgZ2FtZSxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdmFsLFxuICAgICAgICBwcmV2VmFsdWU6IGdhbWUuZGF0YSAmJiBnYW1lLmRhdGFba2V5XSxcbiAgICAgICAgYXBwZW5kXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZWFybHlFeGl0R2FtZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIkdhbWVzLm1ldGhvZHMuZWFybHlFeGl0R2FtZVwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBnYW1lSWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuICAgIGVuZFJlYXNvbjoge1xuICAgICAgbGFiZWw6IFwiUmVhc29uIGZvciBFbmRcIixcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiAvW2EtekEtWjAtOV9dKy9cbiAgICB9LFxuICAgIHN0YXR1czoge1xuICAgICAgbGFiZWw6IFwic3RhdHVzIGZvciBnYW1lcyBhbmQgcGxheWVycyBhZnRlciBleGl0XCIsXG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogL1thLXpBLVowLTlfXSsvXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBnYW1lSWQsIGVuZFJlYXNvbiwgc3RhdHVzIH0pIHtcbiAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdhbWUgPSBHYW1lcy5maW5kT25lKGdhbWVJZCk7XG5cbiAgICBpZiAoIWdhbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImdhbWUgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGlmIChnYW1lICYmIGdhbWUuZmluaXNoZWRBdCkge1xuICAgICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuZ2FtZSBhbHJlYWR5IGVuZGVkIVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIEdhbWVzLnVwZGF0ZShnYW1lSWQsIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgZmluaXNoZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBlbmRSZWFzb25cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIEdhbWVMb2JiaWVzLnVwZGF0ZShcbiAgICAgIHsgZ2FtZUlkIH0sXG4gICAgICB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBzdGF0dXMsXG4gICAgICAgICAgZW5kUmVhc29uXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApO1xuXG4gICAgZ2FtZS5wbGF5ZXJJZHMuZm9yRWFjaChwbGF5ZXJJZCA9PlxuICAgICAgUGxheWVycy51cGRhdGUocGxheWVySWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGV4aXRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgICBleGl0U3RhdHVzOiBzdGF0dXMsXG4gICAgICAgICAgZXhpdFJlYXNvbjogZW5kUmVhc29uXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGJhdGNoID0gQmF0Y2hlcy5maW5kT25lKGdhbWUuYmF0Y2hJZCk7XG4gICAgY29uc3QgYXZhaWxhYmxlTG9iYnkgPSBHYW1lTG9iYmllcy5maW5kT25lKHtcbiAgICAgICRhbmQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIF9pZDogeyAkaW46IGJhdGNoLmdhbWVMb2JieUlkcyB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgc3RhdHVzOiB7ICRpbjogW1wiaW5pdFwiLCBcInJ1bm5pbmdcIl0gfSB9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICAvLyBFbmQgYmF0Y2ggaWYgdGhlcmUgaXMgbm8gYXZhaWxhYmxlIGdhbWVcbiAgICBpZiAoIWF2YWlsYWJsZUxvYmJ5KSB7XG4gICAgICBCYXRjaGVzLnVwZGF0ZShcbiAgICAgICAgeyBnYW1lTG9iYnlJZHM6IGdhbWVJZCB9LFxuICAgICAgICB7ICRzZXQ6IHsgc3RhdHVzOiBzdGF0dXMsIGZpbmlzaGVkQXQ6IG5ldyBEYXRlKCkgfSB9XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcblxuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi4vZ2FtZXMuanNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi4vLi4vcGxheWVycy9wbGF5ZXJzLmpzXCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vLi4vcm91bmRzL3JvdW5kcy5qc1wiO1xuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4uLy4uL3N0YWdlcy9zdGFnZXMuanNcIjtcbmltcG9ydCB7IFRyZWF0bWVudHMgfSBmcm9tIFwiLi4vLi4vdHJlYXRtZW50cy90cmVhdG1lbnRzLmpzXCI7XG5pbXBvcnQge1xuICBhdWdtZW50UGxheWVyU3RhZ2VSb3VuZCxcbiAgYXVnbWVudEdhbWVTdGFnZVJvdW5kXG59IGZyb20gXCIuLi8uLi9wbGF5ZXItc3RhZ2VzL2F1Z21lbnQuanNcIjtcbmltcG9ydCB7IGF1Z21lbnRHYW1lT2JqZWN0IH0gZnJvbSBcIi4uLy4uL2dhbWVzL2F1Z21lbnQuanNcIjtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuLi8uLi8uLi9zZXJ2ZXJcIjtcbmltcG9ydCB7IGVuZE9mU3RhZ2UgfSBmcm9tIFwiLi4vLi4vc3RhZ2VzL2ZpbmlzaC5qc1wiO1xuaW1wb3J0IENyb24gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Nyb24uanNcIjtcblxuQ3Jvbi5hZGQoe1xuICBuYW1lOiBcIlRyaWdnZXIgc3RhZ2UgdGltZW91dCBvciBSdW4gYm90c1wiLFxuICBpbnRlcnZhbDogMTAwMCxcbiAgdGFzazogZnVuY3Rpb24obG9nKSB7XG4gICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICBzdGF0dXM6IFwicnVubmluZ1wiLFxuICAgICAgZXN0RmluaXNoZWRUaW1lOiB7ICRndGU6IG5ldyBEYXRlKCkgfSxcbiAgICAgIGZpbmlzaGVkQXQ6IHsgJGV4aXN0czogZmFsc2UgfVxuICAgIH07XG4gICAgR2FtZXMuZmluZChxdWVyeSkuZm9yRWFjaChnYW1lID0+IHtcbiAgICAgIGNvbnN0IHN0YWdlID0gU3RhZ2VzLmZpbmRPbmUoZ2FtZS5jdXJyZW50U3RhZ2VJZCk7XG5cbiAgICAgIGNvbnN0IG5vdyA9IG1vbWVudCgpO1xuICAgICAgY29uc3Qgc3RhcnRUaW1lQXQgPSBtb21lbnQoc3RhZ2Uuc3RhcnRUaW1lQXQpO1xuICAgICAgY29uc3QgZW5kVGltZUF0ID0gc3RhcnRUaW1lQXQuYWRkKHN0YWdlLmR1cmF0aW9uSW5TZWNvbmRzLCBcInNlY29uZHNcIik7XG4gICAgICBjb25zdCBlbmRlZCA9IG5vdy5pc1NhbWVPckFmdGVyKGVuZFRpbWVBdCk7XG4gICAgICBpZiAoZW5kZWQpIHtcbiAgICAgICAgZW5kT2ZTdGFnZShzdGFnZS5faWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBnYW1lSWQgfSA9IHN0YWdlO1xuICAgICAgICAvLyBtYWtlIGJvdHMgcGxheVxuICAgICAgICBjb25zdCBxdWVyeSA9IHsgZ2FtZUlkLCBib3Q6IHsgJGV4aXN0czogdHJ1ZSB9IH07XG4gICAgICAgIGlmIChQbGF5ZXJzLmZpbmQocXVlcnkpLmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYm90UGxheWVycyA9IFBsYXllcnMuZmluZChxdWVyeSk7XG4gICAgICAgIGNvbnN0IHRyZWF0bWVudCA9IFRyZWF0bWVudHMuZmluZE9uZShnYW1lLnRyZWF0bWVudElkKTtcbiAgICAgICAgY29uc3Qgcm91bmQgPSBSb3VuZHMuZmluZE9uZShzdGFnZS5yb3VuZElkKTtcblxuICAgICAgICBhdWdtZW50R2FtZU9iamVjdCh7IGdhbWUsIHRyZWF0bWVudCwgcm91bmQsIHN0YWdlIH0pO1xuXG4gICAgICAgIGJvdFBsYXllcnMuZm9yRWFjaChib3RQbGF5ZXIgPT4ge1xuICAgICAgICAgIGNvbnN0IGJvdCA9IGNvbmZpZy5ib3RzW2JvdFBsYXllci5ib3RdO1xuICAgICAgICAgIGlmICghYm90KSB7XG4gICAgICAgICAgICBsb2cuZXJyb3IoXG4gICAgICAgICAgICAgIGBEZWZpbml0aW9uIGZvciBib3QgXCIke1xuICAgICAgICAgICAgICAgIGJvdFBsYXllci5ib3RcbiAgICAgICAgICAgICAgfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIHNlcnZlciBjb25maWchYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWJvdC5vblN0YWdlVGljaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF1Z21lbnRHYW1lU3RhZ2VSb3VuZChnYW1lLCBzdGFnZSwgcm91bmQpO1xuXG4gICAgICAgICAgYm90UGxheWVyLnN0YWdlID0gXy5leHRlbmQoe30sIHN0YWdlKTtcbiAgICAgICAgICBib3RQbGF5ZXIucm91bmQgPSBfLmV4dGVuZCh7fSwgcm91bmQpO1xuICAgICAgICAgIGF1Z21lbnRQbGF5ZXJTdGFnZVJvdW5kKFxuICAgICAgICAgICAgYm90UGxheWVyLFxuICAgICAgICAgICAgYm90UGxheWVyLnN0YWdlLFxuICAgICAgICAgICAgYm90UGxheWVyLnJvdW5kLFxuICAgICAgICAgICAgZ2FtZVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBjb25zdCB0aWNrID0gZW5kVGltZUF0LmRpZmYobm93LCBcInNlY29uZHNcIik7XG5cbiAgICAgICAgICBnYW1lLnJvdW5kcy5mb3JFYWNoKHJvdW5kID0+IHtcbiAgICAgICAgICAgIHJvdW5kLnN0YWdlcyA9IGdhbWUuc3RhZ2VzLmZpbHRlcihzID0+IHMucm91bmRJZCA9PT0gcm91bmQuX2lkKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGJvdC5vblN0YWdlVGljayhib3RQbGF5ZXIsIGdhbWUsIHJvdW5kLCBzdGFnZSwgdGljayk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsImltcG9ydCB7IFBsYXllclJvdW5kcyB9IGZyb20gXCIuLi8uLi9wbGF5ZXItcm91bmRzL3BsYXllci1yb3VuZHNcIjtcbmltcG9ydCB7IFBsYXllclN0YWdlcyB9IGZyb20gXCIuLi8uLi9wbGF5ZXItc3RhZ2VzL3BsYXllci1zdGFnZXNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi4vLi4vcGxheWVycy9wbGF5ZXJzXCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vLi4vcm91bmRzL3JvdW5kc1wiO1xuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4uLy4uL3N0YWdlcy9zdGFnZXNcIjtcbmltcG9ydCB7IEdhbWVzIH0gZnJvbSBcIi4uL2dhbWVzXCI7XG5cbk1ldGVvci5wdWJsaXNoKFwiZ2FtZVwiLCBmdW5jdGlvbih7IHBsYXllcklkIH0pIHtcbiAgcmV0dXJuIEdhbWVzLmZpbmQoeyBwbGF5ZXJJZHM6IHBsYXllcklkIH0pO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKFwiZ2FtZURlcGVuZGVuY2llc1wiLCBmdW5jdGlvbih7IGdhbWVJZCB9KSB7XG4gIGlmICghZ2FtZUlkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIFtQbGF5ZXJzLmZpbmQoeyBnYW1lSWQgfSldO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKFwiZ2FtZUxvYmJ5RGVwZW5kZW5jaWVzXCIsIGZ1bmN0aW9uKHsgZ2FtZUxvYmJ5SWQgfSkge1xuICBpZiAoIWdhbWVMb2JieUlkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIFtQbGF5ZXJzLmZpbmQoeyBnYW1lTG9iYnlJZCB9KV07XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJnYW1lQ3VycmVudFJvdW5kU3RhZ2VcIiwgZnVuY3Rpb24oeyBnYW1lSWQsIHN0YWdlSWQgfSkge1xuICBpZiAoIWdhbWVJZCB8fCAhc3RhZ2VJZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHN0YWdlID0gU3RhZ2VzLmZpbmRPbmUoc3RhZ2VJZCk7XG4gIGNvbnN0IHJvdW5kSWQgPSBzdGFnZS5yb3VuZElkO1xuXG4gIHJldHVybiBbXG4gICAgU3RhZ2VzLmZpbmQoeyBnYW1lSWQsIHJvdW5kSWQgfSksXG4gICAgUm91bmRzLmZpbmQoeyBnYW1lSWQsIF9pZDogcm91bmRJZCB9KSxcbiAgICBQbGF5ZXJSb3VuZHMuZmluZCh7IGdhbWVJZCwgcm91bmRJZCB9KSxcbiAgICBQbGF5ZXJTdGFnZXMuZmluZCh7IGdhbWVJZCwgc3RhZ2VJZCB9KVxuICBdO1xufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCBpbmZsZWN0aW9uIGZyb20gXCJpbmZsZWN0aW9uXCI7XG5cbmltcG9ydCB7XG4gIEhhc01hbnlCeVJlZixcbiAgVGltZXN0YW1wU2NoZW1hLFxuICBBcmNoaXZlZFNjaGVtYVxufSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5cbmV4cG9ydCBjb25zdCBMb2JieUNvbmZpZ3MgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcImxvYmJ5X2NvbmZpZ3NcIik7XG5cbkxvYmJ5Q29uZmlncy5oZWxwZXJzKHtcbiAgZGlzcGxheU5hbWUoKSB7XG4gICAgaWYgKHRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCB0eXBlID0gaW5mbGVjdGlvbi50aXRsZWl6ZSh0aGlzLnRpbWVvdXRUeXBlKTtcbiAgICBjb25zdCBiYXNlID0gYCR7dHlwZX06ICR7dGhpcy50aW1lb3V0SW5TZWNvbmRzfXNgO1xuICAgIGxldCBkZXRhaWxzO1xuICAgIHN3aXRjaCAodGhpcy50aW1lb3V0VHlwZSkge1xuICAgICAgY2FzZSBcImxvYmJ5XCI6XG4gICAgICAgIGRldGFpbHMgPSBg4oaSICR7aW5mbGVjdGlvbi50aXRsZWl6ZSh0aGlzLnRpbWVvdXRTdHJhdGVneSl9YDtcbiAgICAgICAgaWYgKHRoaXMudGltZW91dFN0cmF0ZWd5ID09PSBcImJvdHNcIikge1xuICAgICAgICAgIGRldGFpbHMgKz0gYCgke3RoaXMudGltZW91dEJvdHMuam9pbihcIixcIil9KWA7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaW5kaXZpZHVhbFwiOlxuICAgICAgICBkZXRhaWxzID0gYOKoiSAke3RoaXMuZXh0ZW5kQ291bnQgKyAxfWA7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcihgdW5rbm93biB0aW1lb3V0VHlwZTogJHt0aGlzLnRpbWVvdXRUeXBlfWApO1xuICAgICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7YmFzZX0gJHtkZXRhaWxzfWA7XG4gIH1cbn0pO1xuXG4vLyBUaGVyZSBhcmUgMiBleGNsdXNpdmUgdGltZW91dCB0eXBlczpcbi8vIC0gbG9iYnk6IHRoZSB0aW1lb3V0IHN0YXJ0IHdoZW4gdGhlIGZpcnN0IHBsYXllciByZWFjaGVzIHRoZSBsb2JieSBhbmQgcnVuc1xuLy8gICBvdXQgZm9yIGFsbCB0aGUgcGxheWVycyB3aGV0aGVyIHRoZXkgaGF2ZSBldmVuIHJlYWNoZWQgdGhlIGxvYmJ5IG9yIG5vdC5cbi8vIC0gaW5kaXZpZHVhbDogdGhlIHRpbWVvdXQgaXMgc3RhcnRlZCBmb3IgZWFjaCBwbGF5ZXIgYXMgdGhleSByZWFjaCB0aGUgcm9vbS5cbi8vICAgU29tZSBwbGF5ZXJzIG1pZ2h0IHRpbWUgb3V0IGJlZm9yZSBhbGwgcGxheWVycyBhcmUgaW4gdGhlIGxvYmJ5LCB0aGV5IG1pZ2h0XG4vLyAgIGNvbnRpbnVlIHdhaXRpbmcgZm9yIGFub3RoZXIgdGltZW91dCBwZXJpb2QuIFRoZXkgbWlnaHQgYWxzbyBsZWF2ZSB0aGUgZ2FtZVxuLy8gICBhbmQgYSBuZXcgcGxheWVyIGNhbiByZXBsYWNlIHRoZW0uIFRoZSBsb2JieSBpdHNlbGYgbmV2ZXIgdGltZXMgb3V0LlxuTG9iYnlDb25maWdzLnRpbWVvdXRUeXBlcyA9IFtcImxvYmJ5XCIsIFwiaW5kaXZpZHVhbFwiXTtcblxuLy8gVGhlIHRpbWVvdXRTdHJhdGVneSBkZXRlcm1pbmVzIHdoYXQgdG8gZG8gaW4gY2FzZSBwZW9wbGUgYXJlIHdhaXRpbmdcbi8vIGluIHRoZSBsb2JieSBmb3IgbG9uZ2VyIHRoYW4gdGhlIHRpbWVvdXRJblNlY29uZHMgZHVyYXRpb24uXG4vLyBPbmx5IGZvciBcImxvYmJ5XCIgdGltZW91dFR5cGUuXG4vLyBBdmFpbGFibGUgc3RyYXRlZ2llczpcbi8vIC0gaWdub3JlOiBzdGFydCB0aGUgZ2FtZSBhbnl3YXlcbi8vIC0gZmFpbDogdGFrZSB0aGUgcGxheWVyIHRvIHRoZSBleGl0IHN1cnZleVxuLy8gLSBib3RzOiBmaWxsIHRoZSBtaXNzaW5nIHBsYXllcnMgc2xvdHMgd2l0aCBib3RzIGZyb20gdGltZW91dEJvdHNcbkxvYmJ5Q29uZmlncy50aW1lb3V0U3RyYXRlZ2llcyA9IFtcImZhaWxcIiwgXCJpZ25vcmVcIl07XG4vLyBERUFDVElWQVRJTkcgYm90cyB1bnRpbCBib3RzIGltcGxlbWVudGVkLlxuLy8gTG9iYnlDb25maWdzLnRpbWVvdXRTdHJhdGVnaWVzID0gW1wiZmFpbFwiLCBcImlnbm9yZVwiLCBcImJvdHNcIl07XG5cbi8vIE9uZSB5ZWFyLCB0aGF0J3MgYSBsb3QsIGp1c3QgbmVlZCB0byBibG9jayBmcm9tIHNvbWV0aGluZyB0b28gd2lsZCBsaWtlIDEwTVxuLy8geWVhcnMuIFdlIGRvbid0IGFjdHVhbGx5IGNhcmUsIEluZiB3b3VsZCBiZSBmaW5lLi4uXG5Mb2JieUNvbmZpZ3MubWF4VGltZW91dEluU2Vjb25kcyA9IDM2NSAqIDI0ICogNjAgKiA2MDtcblxuLy8gZGVmYXVsdFRpbWVvdXRJblNlY29uZHMgaXMgc2ltcGx5IHVzZWQgYXMgdGhlIGRlZmF1bHQgdmFsdWUgaW4gdGhlIExvYmJ5XG4vLyBDb25maWd1cmF0aW9uIGNyZWF0aW9uIGZvcm0uXG5Mb2JieUNvbmZpZ3MuZGVmYXVsdFRpbWVvdXRJblNlY29uZHMgPSA1ICogNjA7XG5cbkxvYmJ5Q29uZmlncy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgLy8gT3B0aW9uYWwgZXhwZXJpbWVudGVyIGdpdmVuIG5hbWUgZm9yIHRoZSB0cmVhdG1lbnRcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBtYXg6IDI1NixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBjdXN0b20oKSB7XG4gICAgICBpZiAodGhpcy5pc1NldCAmJiBMb2JieUNvbmZpZ3MuZmluZCh7IG5hbWU6IHRoaXMudmFsdWUgfSkuY291bnQoKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIFwibm90VW5pcXVlXCI7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHJlZ0V4OiAvXlthLXpBLVowLTlfXSskL1xuICB9LFxuXG4gIC8vIFRoZSB0aW1lb3V0VHlwZSBmdW5kYW1lbnRhbGx5IGNoYW5nZXMgdGhlIGJlaGF2aW9yIG9mIHRoZSBsb2JieS4gU2VlXG4gIC8vIExvYmJ5Q29uZmlncy50aW1lb3V0VHlwZXMgYWJvdmUgZm9yIGRldGFpbHMuXG4gIHRpbWVvdXRUeXBlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGFsbG93ZWRWYWx1ZXM6IExvYmJ5Q29uZmlncy50aW1lb3V0VHlwZXNcbiAgfSxcblxuICAvLyBOdW1iZXIgb2Ygc2Vjb25kcyBmb3Igb25lIHBsYXllciB0byB3YWl0IGluIGxvYmJ5IGJlZm9yZSB0aW1lb3V0U3RyYXRlZ3lcbiAgLy8gaXMgYXBwbGllZC4gVGhpcyB0aW1lb3V0IGFwcGxpZXMgb25seSB0byB0aGUgd2FpdGluZyBmb3IgdGhlIGdhbWUgdG8gc3RhcnQuXG4gIC8vIEl0IGlzIGVpdGhlciBhIFwiTG9iYnkgVGltZW91dFwiLCBvciBhbiBcIkluZGl2aWR1YWwgVGltZW91dFwiLCBkZXBlbmRpbmcgb25cbiAgLy8gdGhlIHRpbWVvdXRUeXBlIHZhbHVlLlxuICB0aW1lb3V0SW5TZWNvbmRzOiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgbWF4OiBMb2JieUNvbmZpZ3MubWF4VGltZW91dEluU2Vjb25kcyxcbiAgICAvLyBJdCB3b3VsZCBiZSBkaWZmaWN1bHQgdG8gbWFuYWdlIGEgdGltZXIgdGhhdCBpcyBsZXNzIHRoYW4gNXMsIGFuZCBpdFxuICAgIC8vIHdvdWxkIGJlICB3ZWlyZC4gNXMgaXMgYWxyZWFkeSB3ZWlyZC4uLlxuICAgIG1pbjogNVxuICB9LFxuXG4gIC8vIFRoZSB0aW1lb3V0U3RyYXRlZ3kgZGV0ZXJtaW5lcyB3aGF0IHRvIGRvIGluIGNhc2UgcGVvcGxlIGFyZSB3YWl0aW5nXG4gIC8vIGluIHRoZSBsb2JieSBmb3IgbG9uZ2VyIHRoYW4gdGhlIHRpbWVvdXRJblNlY29uZHMgZHVyYXRpb24uXG4gIC8vIE9ubHkgZm9yIFwibG9iYnlcIiB0aW1lb3V0VHlwZS5cbiAgLy8gU2VlIExvYmJ5Q29uZmlncy50aW1lb3V0U3RyYXRlZ2llcyBmb3IgZGV0YWlscy5cbiAgdGltZW91dFN0cmF0ZWd5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGFsbG93ZWRWYWx1ZXM6IExvYmJ5Q29uZmlncy50aW1lb3V0U3RyYXRlZ2llcyxcbiAgICBkZWZhdWx0VmFsdWU6IFwiZmFpbFwiLFxuICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG5cbiAgLy8gTmFtZXMgb2YgYm90IHRvIHVzZSBpZiB0aW1lZCBvdXQgYW5kIHN0aWxsIG5vdCBlbm91Z2ggcGxheWVyLlxuICAvLyBPbmx5IGZvciBcImxvYmJ5XCIgdGltZW91dFR5cGUgYW5kIHRpbWVvdXRTdHJhdGVneSBpcyBcImJvdHNcIi5cbiAgdGltZW91dEJvdHM6IHtcbiAgICB0eXBlOiBBcnJheSxcbiAgICAvLyBTaG91bGQgYWRkIGN1c3RvbSB2YWxpZGF0aW9uIHRvIHZlcmlmeSB0aGUgdGltZW91dFN0cmF0ZWd5IGFuZCBtYWtlXG4gICAgLy8gcmVxdWlyZWQgaWYgXCJib3RzXCIgYW5kIHNob3VsZCB2ZXJpZnkgYm90IHdpdGggbmFtZSBleGlzdHMuXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgXCJ0aW1lb3V0Qm90cy4kXCI6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcblxuICAvLyBOdW1iZXIgb2YgdGltZXMgdG8gYWxsb3cgdGhlIHVzZXIgdG8gZXh0ZW5kIHRoZWlyIHdhaXQgdGltZSBieVxuICAvLyB0aW1lb3V0SW5TZWNvbmRzLlxuICAvLyBJZiBzZXQgdG8gMCwgdGhleSBhcmUgbmV2ZXIgYXNrZWQgdG8gcmV0cnkuXG4gIC8vIE9ubHkgZm9yIFwiaW5kaXZpZHVhbFwiIHRpbWVvdXRUeXBlLlxuICBleHRlbmRDb3VudDoge1xuICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgIC8vIDEgbWlsbGFyZCB0aW1lcywgdGhhdCBzaG91bGQgYmUgYSBzdWZmaWNpZW50IHVwcGVyIGJvdW5kXG4gICAgbWF4OiAxMDAwMDAwMDAwLFxuICAgIG1pbjogMCxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuTG9iYnlDb25maWdzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcbkxvYmJ5Q29uZmlncy5zY2hlbWEuZXh0ZW5kKEFyY2hpdmVkU2NoZW1hKTtcbkxvYmJ5Q29uZmlncy5zY2hlbWEuZXh0ZW5kKEhhc01hbnlCeVJlZihcIkJhdGNoZXNcIikpO1xuTG9iYnlDb25maWdzLnNjaGVtYS5leHRlbmQoSGFzTWFueUJ5UmVmKFwiR2FtZUxvYmJpZXNcIikpO1xuTG9iYnlDb25maWdzLmF0dGFjaFNjaGVtYShMb2JieUNvbmZpZ3Muc2NoZW1hKTtcbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSBcIm1ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZFwiO1xuXG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBJZFNjaGVtYSB9IGZyb20gXCIuLi9kZWZhdWx0LXNjaGVtYXMuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvYmJ5Q29uZmlnID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiTG9iYnlDb25maWdzLm1ldGhvZHMuY3JlYXRlXCIsXG5cbiAgdmFsaWRhdGU6IExvYmJ5Q29uZmlncy5zY2hlbWFcbiAgICAucGljayhcbiAgICAgIFwibmFtZVwiLFxuICAgICAgXCJ0aW1lb3V0VHlwZVwiLFxuICAgICAgXCJ0aW1lb3V0SW5TZWNvbmRzXCIsXG4gICAgICBcInRpbWVvdXRTdHJhdGVneVwiLFxuICAgICAgXCJ0aW1lb3V0Qm90c1wiLFxuICAgICAgXCJ0aW1lb3V0Qm90cy4kXCIsXG4gICAgICBcImV4dGVuZENvdW50XCJcbiAgICApXG4gICAgLnZhbGlkYXRvcigpLFxuXG4gIHJ1bihsb2JieUNvbmZpZykge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVuYXV0aG9yaXplZFwiKTtcbiAgICB9XG5cbiAgICBMb2JieUNvbmZpZ3MuaW5zZXJ0KGxvYmJ5Q29uZmlnKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVMb2JieUNvbmZpZyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIkxvYmJ5Q29uZmlncy5tZXRob2RzLnVwZGF0ZVwiLFxuXG4gIHZhbGlkYXRlOiBMb2JieUNvbmZpZ3Muc2NoZW1hXG4gICAgLnBpY2soXCJuYW1lXCIpXG4gICAgLmV4dGVuZChcbiAgICAgIG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgICAgICBhcmNoaXZlZDoge1xuICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gICAgLmV4dGVuZChJZFNjaGVtYSlcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgX2lkLCBuYW1lLCBhcmNoaXZlZCB9KSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cbiAgICBjb25zdCBsb2JieUNvbmZpZyA9IExvYmJ5Q29uZmlncy5maW5kT25lKF9pZCk7XG4gICAgaWYgKCFsb2JieUNvbmZpZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0ICRzZXQgPSB7fSxcbiAgICAgICR1bnNldCA9IHt9O1xuICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICRzZXQubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIGlmIChhcmNoaXZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKGxvYmJ5Q29uZmlnLmFyY2hpdmVkQXQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZm91bmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICAkc2V0LmFyY2hpdmVkQXQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAkc2V0LmFyY2hpdmVkQnlJZCA9IHRoaXMudXNlcklkO1xuICAgICAgfVxuICAgICAgaWYgKCFhcmNoaXZlZCkge1xuICAgICAgICBpZiAoIWxvYmJ5Q29uZmlnLmFyY2hpdmVkQXQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJub3QgZm91bmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICAkdW5zZXQuYXJjaGl2ZWRBdCA9IHRydWU7XG4gICAgICAgICR1bnNldC5hcmNoaXZlZEJ5SWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyID0ge307XG4gICAgaWYgKE9iamVjdC5rZXlzKCRzZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIG1vZGlmaWVyLiRzZXQgPSAkc2V0O1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXMoJHVuc2V0KS5sZW5ndGggPiAwKSB7XG4gICAgICBtb2RpZmllci4kdW5zZXQgPSAkdW5zZXQ7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyhtb2RpZmllcikubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgTG9iYnlDb25maWdzLnVwZGF0ZShfaWQsIG1vZGlmaWVyKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi4vbG9iYnktY29uZmlncy5qc1wiO1xuXG5NZXRlb3IucHVibGlzaChcImFkbWluLWxvYmJ5LWNvbmZpZ3NcIiwgZnVuY3Rpb24oeyBhcmNoaXZlZCB9KSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChhcmNoaXZlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIExvYmJ5Q29uZmlncy5maW5kKCk7XG4gIH1cblxuICByZXR1cm4gTG9iYnlDb25maWdzLmZpbmQoeyBhcmNoaXZlZEF0OiB7ICRleGlzdHM6IEJvb2xlYW4oYXJjaGl2ZWQpIH0gfSk7XG59KTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IFBsYXllcklucHV0cyB9IGZyb20gXCIuL3BsYXllci1pbnB1dHMuanNcIjtcblxuLy8gYWRkUGxheWVySW5wdXQgaXMgbm9uLWRlc3RydWN0aXZlLCBpdCBqdXN0IGtlZXBzIGFkZGluZyBvbnRvIGEgcGxheWVyJ3Ncbi8vIGlucHV0IGRhdGEuXG5leHBvcnQgY29uc3QgYWRkUGxheWVySW5wdXQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJJbnB1dHMubWV0aG9kcy5hZGRcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuICAgIGdhbWVJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICBnYW1lTG9iYnlJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICBkYXRhOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHBsYXllcklkLCBnYW1lSWQsIGdhbWVMb2JieUlkLCBkYXRhOiByYXdEYXRhIH0pIHtcbiAgICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF5ZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cbiAgICBpZiAoIWdhbWVJZCAmJiAhZ2FtZUxvYmJ5SWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImdhbWVJZCBvciBnYW1lTG9iYnlJZCByZXF1aXJlZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyYXdEYXRhKTtcbiAgICBQbGF5ZXJJbnB1dHMuaW5zZXJ0KFxuICAgICAgeyBwbGF5ZXJJZCwgZ2FtZUlkLCBnYW1lTG9iYnlJZCwgZGF0YSB9LFxuICAgICAge1xuICAgICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgIHZhbGlkYXRlOiBmYWxzZSxcbiAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlXG4gICAgICB9XG4gICAgKTtcbiAgfVxufSk7XG4iLCIvLyBQbGF5ZXJJbnB1dHMgY29udGFpbnMgc21hbGwgcGllY2VzIG9mIGluZm9ybWF0aW9uIGFzc29jaWF0ZWQgd2l0aCBhIHBsYXllclxuLy8gVGhpcyBjYW4gYmUgaW5wdXQgZm9ybXMgZnJvbSBpbnRyby9vdXRybyBvciBpbnRlcm1lZGlhdGUgaW5wdXQgdmFsdWVzIHdoaWxlXG4vLyBwbGF5aW5nIHRoZSBnYW1lIChlLmcuIGFsbCB2YWx1ZXMgd2hpbGUgbW92aW5nIGEgcmFuZ2UgaW5wdXQsIG1vdXNlLFxuLy8gbW92ZW1lbnRzLi4uKVxuXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCB7IEJlbG9uZ3NUbywgVGltZXN0YW1wU2NoZW1hLCBVc2VyRGF0YVNjaGVtYSB9IGZyb20gXCIuLi9kZWZhdWx0LXNjaGVtYXNcIjtcblxuZXhwb3J0IGNvbnN0IFBsYXllcklucHV0cyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwicGxheWVyX2lucHV0c1wiKTtcblxuUGxheWVySW5wdXRzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe30pO1xuXG5QbGF5ZXJJbnB1dHMuc2NoZW1hLmV4dGVuZChUaW1lc3RhbXBTY2hlbWEpO1xuUGxheWVySW5wdXRzLnNjaGVtYS5leHRlbmQoVXNlckRhdGFTY2hlbWEpO1xuUGxheWVySW5wdXRzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiR2FtZXNcIiwgZmFsc2UpKTtcblBsYXllcklucHV0cy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkdhbWVMb2JiaWVzXCIsIGZhbHNlKSk7XG5QbGF5ZXJJbnB1dHMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJQbGF5ZXJzXCIpKTtcblBsYXllcklucHV0cy5hdHRhY2hTY2hlbWEoUGxheWVySW5wdXRzLnNjaGVtYSk7XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgUGxheWVyTG9ncyB9IGZyb20gXCIuL3BsYXllci1sb2dzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uL3BsYXllcnMvcGxheWVycy5qc1wiO1xuXG4vLyBwbGF5ZXJMb2cgaXMgbm9uLWRlc3RydWN0aXZlLCBpdCBqdXN0IGtlZXBzIGFkZGluZyBvbnRvIGEgcGxheWVyJ3MgbG9ncy5cbmV4cG9ydCBjb25zdCBwbGF5ZXJMb2cgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJMb2dzLm1ldGhvZHMuYWRkXCIsXG5cbiAgdmFsaWRhdGU6IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHBsYXllcklkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBzdGFnZUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIHJvdW5kSWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgZ2FtZUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG1heDogMjU1XG4gICAgfSxcbiAgICBqc29uRGF0YToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBwbGF5ZXJJZCwgZ2FtZUlkLCByb3VuZElkLCBzdGFnZUlkLCBuYW1lLCBqc29uRGF0YSB9KSB7XG4gICAgY29uc3QgcGxheWVyID0gUGxheWVycy5maW5kT25lKHBsYXllcklkKTtcbiAgICBpZiAoIXBsYXllcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGxheWVyIG5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBQbGF5ZXJMb2dzLmluc2VydChcbiAgICAgIHsgcGxheWVySWQsIGdhbWVJZCwgcm91bmRJZCwgc3RhZ2VJZCwgbmFtZSwganNvbkRhdGEgfSxcbiAgICAgIHtcbiAgICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZVxuICAgICAgfVxuICAgICk7XG4gIH1cbn0pO1xuIiwiLy8gUGxheWVySW5wdXRzIGNvbnRhaW5zIHNtYWxsIHBpZWNlcyBvZiBpbmZvcm1hdGlvbiBhc3NvY2lhdGVkIHdpdGggYSBwbGF5ZXJcbi8vIFRoaXMgY2FuIGJlIGlucHV0IGZvcm1zIGZyb20gaW50cm8vb3V0cm8gb3IgaW50ZXJtZWRpYXRlIGlucHV0IHZhbHVlcyB3aGlsZVxuLy8gcGxheWluZyB0aGUgZ2FtZSAoZS5nLiBhbGwgdmFsdWVzIHdoaWxlIG1vdmluZyBhIHJhbmdlIGlucHV0LCBtb3VzZSxcbi8vIG1vdmVtZW50cy4uLilcblxuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tIFwic2ltcGwtc2NoZW1hXCI7XG5cbmltcG9ydCB7IFRpbWVzdGFtcFNjaGVtYSwgQmVsb25nc1RvIH0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hc1wiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyTG9ncyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwicGxheWVyX2xvZ3NcIik7XG5cblBsYXllckxvZ3Muc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN0YWdlSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICByb3VuZElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgZ2FtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBtYXg6IDI1NVxuICB9LFxuICBqc29uRGF0YToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuUGxheWVyTG9ncy5zY2hlbWEuZXh0ZW5kKFRpbWVzdGFtcFNjaGVtYSk7XG5QbGF5ZXJMb2dzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiUGxheWVyc1wiKSk7XG5QbGF5ZXJMb2dzLmF0dGFjaFNjaGVtYShQbGF5ZXJMb2dzLnNjaGVtYSk7XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCB7IFBsYXllclJvdW5kcyB9IGZyb20gXCIuL3BsYXllci1yb3VuZHNcIjtcbmltcG9ydCBzaGFyZWQgZnJvbSBcIi4uLy4uL3NoYXJlZC5qc1wiO1xuXG5leHBvcnQgY29uc3QgdXBkYXRlUGxheWVyUm91bmREYXRhID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiUGxheWVyUm91bmRzLm1ldGhvZHMudXBkYXRlRGF0YVwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBwbGF5ZXJSb3VuZElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBrZXk6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH0sXG4gICAgYXBwZW5kOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIG5vQ2FsbGJhY2s6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSkudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgcGxheWVyUm91bmRJZCwga2V5LCB2YWx1ZSwgYXBwZW5kLCBub0NhbGxiYWNrIH0pIHtcbiAgICBjb25zdCBwbGF5ZXJSb3VuZCA9IFBsYXllclJvdW5kcy5maW5kT25lKHBsYXllclJvdW5kSWQpO1xuICAgIGlmICghcGxheWVyUm91bmQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBsYXllclJvdW5kIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgLy8gVE9ETyBjaGVjayBjYW4gdXBkYXRlIHRoaXMgcmVjb3JkIHBsYXllclJvdW5kXG5cbiAgICBjb25zdCB2YWwgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICBsZXQgdXBkYXRlID0geyBbYGRhdGEuJHtrZXl9YF06IHZhbCB9O1xuICAgIGNvbnN0IG1vZGlmaWVyID0gYXBwZW5kID8geyAkcHVzaDogdXBkYXRlIH0gOiB7ICRzZXQ6IHVwZGF0ZSB9O1xuXG4gICAgUGxheWVyUm91bmRzLnVwZGF0ZShwbGF5ZXJSb3VuZElkLCBtb2RpZmllciwge1xuICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRlOiBmYWxzZSxcbiAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2VcbiAgICB9KTtcblxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgIW5vQ2FsbGJhY2spIHtcbiAgICAgIHNoYXJlZC5jYWxsT25DaGFuZ2Uoe1xuICAgICAgICBwbGF5ZXJJZDogcGxheWVyUm91bmQucGxheWVySWQsXG4gICAgICAgIHBsYXllclJvdW5kSWQsXG4gICAgICAgIHBsYXllclJvdW5kLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB2YWwsXG4gICAgICAgIHByZXZWYWx1ZTogcGxheWVyUm91bmQuZGF0YSAmJiBwbGF5ZXJSb3VuZC5kYXRhW2tleV0sXG4gICAgICAgIGFwcGVuZFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuXG5pbXBvcnQgeyBUaW1lc3RhbXBTY2hlbWEsIFVzZXJEYXRhU2NoZW1hLCBCZWxvbmdzVG8gfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5cbmV4cG9ydCBjb25zdCBQbGF5ZXJSb3VuZHMgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihcInBsYXllcl9yb3VuZHNcIik7XG5cblBsYXllclJvdW5kcy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHt9KTtcblxuUGxheWVyUm91bmRzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcblBsYXllclJvdW5kcy5zY2hlbWEuZXh0ZW5kKFVzZXJEYXRhU2NoZW1hKTtcblBsYXllclJvdW5kcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIlBsYXllcnNcIikpO1xuUGxheWVyUm91bmRzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiUm91bmRzXCIpKTtcblBsYXllclJvdW5kcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkdhbWVzXCIpKTtcblBsYXllclJvdW5kcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkJhdGNoZXNcIikpO1xuUGxheWVyUm91bmRzLmF0dGFjaFNjaGVtYShQbGF5ZXJSb3VuZHMuc2NoZW1hKTtcbiIsIi8vIGF1Z21lbnQuanNcbmltcG9ydCB7IHVwZGF0ZUdhbWVEYXRhLCBlYXJseUV4aXRHYW1lIH0gZnJvbSBcIi4uL2dhbWVzL21ldGhvZHMuanNcIjtcbmltcG9ydCB7IHVwZGF0ZUdhbWVMb2JieURhdGEgfSBmcm9tIFwiLi4vZ2FtZS1sb2JiaWVzL21ldGhvZHNcIjtcbmltcG9ydCB7IHVwZGF0ZVBsYXllclJvdW5kRGF0YSB9IGZyb20gXCIuLi9wbGF5ZXItcm91bmRzL21ldGhvZHNcIjtcbmltcG9ydCB7IFBsYXllclJvdW5kcyB9IGZyb20gXCIuLi9wbGF5ZXItcm91bmRzL3BsYXllci1yb3VuZHNcIjtcbmltcG9ydCB7XG4gIHVwZGF0ZVBsYXllckRhdGEsXG4gIGVhcmx5RXhpdFBsYXllcixcbiAgZWFybHlFeGl0UGxheWVyTG9iYnlcbn0gZnJvbSBcIi4uL3BsYXllcnMvbWV0aG9kcy5qc1wiO1xuaW1wb3J0IHsgcGxheWVyTG9nIH0gZnJvbSBcIi4uL3BsYXllci1sb2dzL21ldGhvZHMuanNcIjtcbmltcG9ydCB7IHVwZGF0ZVJvdW5kRGF0YSB9IGZyb20gXCIuLi9yb3VuZHMvbWV0aG9kcy5qc1wiO1xuaW1wb3J0IHsgdXBkYXRlU3RhZ2VEYXRhIH0gZnJvbSBcIi4uL3N0YWdlcy9tZXRob2RzLmpzXCI7XG5pbXBvcnQgeyBzdWJtaXRQbGF5ZXJTdGFnZSwgdXBkYXRlUGxheWVyU3RhZ2VEYXRhIH0gZnJvbSBcIi4vbWV0aG9kc1wiO1xuaW1wb3J0IHsgUGxheWVyU3RhZ2VzIH0gZnJvbSBcIi4vcGxheWVyLXN0YWdlc1wiO1xuXG5jb25zdCBnYW1lU2V0ID0gKGdhbWVJZCwgYXBwZW5kID0gZmFsc2UpID0+IChrZXksIHZhbHVlKSA9PiB7XG4gIHVwZGF0ZUdhbWVEYXRhLmNhbGwoe1xuICAgIGdhbWVJZCxcbiAgICBrZXksXG4gICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICBhcHBlbmQsXG4gICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gIH0pO1xufTtcblxuY29uc3QgZ2FtZUxvYmJ5U2V0ID0gKGdhbWVMb2JieUlkLCBhcHBlbmQgPSBmYWxzZSkgPT4gKGtleSwgdmFsdWUpID0+IHtcbiAgdXBkYXRlR2FtZUxvYmJ5RGF0YS5jYWxsKHtcbiAgICBnYW1lTG9iYnlJZCxcbiAgICBrZXksXG4gICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICBhcHBlbmQsXG4gICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gIH0pO1xufTtcblxuY29uc3QgcGxheWVyU2V0ID0gKHBsYXllcklkLCBhcHBlbmQgPSBmYWxzZSkgPT4gKGtleSwgdmFsdWUpID0+IHtcbiAgdXBkYXRlUGxheWVyRGF0YS5jYWxsKHtcbiAgICBwbGF5ZXJJZCxcbiAgICBrZXksXG4gICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICBhcHBlbmQsXG4gICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gIH0pO1xufTtcbmNvbnN0IHN0YWdlU2V0ID0gKHBsYXllclN0YWdlSWQsIGFwcGVuZCA9IGZhbHNlKSA9PiAoa2V5LCB2YWx1ZSkgPT4ge1xuICB1cGRhdGVQbGF5ZXJTdGFnZURhdGEuY2FsbCh7XG4gICAgcGxheWVyU3RhZ2VJZCxcbiAgICBrZXksXG4gICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICBhcHBlbmQsXG4gICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gIH0pO1xufTtcbmNvbnN0IHN0YWdlU3VibWl0ID0gcGxheWVyU3RhZ2VJZCA9PiBjYiA9PiB7XG4gIHN1Ym1pdFBsYXllclN0YWdlLmNhbGwoXG4gICAge1xuICAgICAgcGxheWVyU3RhZ2VJZCxcbiAgICAgIG5vQ2FsbGJhY2s6IE1ldGVvci5pc1NlcnZlclxuICAgIH0sXG4gICAgY2JcbiAgKTtcbn07XG5jb25zdCByb3VuZFNldCA9IChwbGF5ZXJSb3VuZElkLCBhcHBlbmQgPSBmYWxzZSkgPT4gKGtleSwgdmFsdWUpID0+IHtcbiAgdXBkYXRlUGxheWVyUm91bmREYXRhLmNhbGwoe1xuICAgIHBsYXllclJvdW5kSWQsXG4gICAga2V5LFxuICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSksXG4gICAgYXBwZW5kLFxuICAgIG5vQ2FsbGJhY2s6IE1ldGVvci5pc1NlcnZlclxuICB9KTtcbn07XG5cbi8vIE9uY2UgdGhlIG9wZXJhdGlvbiBoYXMgc3VjY2VlZGVkIChubyB0aHJvdyksIHNldCB0aGUgdmFsdWVcbi8vIHVuZGVmaW5lZCBpcyBub3Qgc3VwcG9ydGVkLCBudWxsIGlzLCByZXBsYWNlIHVuZGVmaW5lZHMgYnkgbnVsbHMuXG5jb25zdCBzZXQgPSAob2JqLCBmdW5jKSA9PiAoaywgdikgPT4ge1xuICBjb25zdCB2YWwgPSB2ID09PSB1bmRlZmluZWQgPyBudWxsIDogdjtcbiAgZnVuYyhrLCB2YWwpO1xuICBvYmpba10gPSB2YWw7XG59O1xuXG5jb25zdCBhcHBlbmQgPSAob2JqLCBmdW5jKSA9PiAoaywgdikgPT4ge1xuICBjb25zdCB2YWwgPSB2ID09PSB1bmRlZmluZWQgPyBudWxsIDogdjtcbiAgZnVuYyhrLCB2YWwpO1xuICBpZiAoIW9ialtrXSkge1xuICAgIG9ialtrXSA9IFtdO1xuICB9XG4gIG9ialtrXS5wdXNoKHZhbCk7XG59O1xuXG5jb25zdCBudWxsRnVuYyA9ICgpID0+IHtcbiAgdGhyb3cgXCJZb3UgY2FsbGVkIC5nZXQoLi4uKSBvciAuc2V0KC4uLikgYnV0IHRoZXJlIGlzIG5vIGRhdGEgZm9yIHRoZSBwbGF5ZXIgeWV0LiBEaWQgdGhlIGdhbWUgcnVuIGZvciB0aGlzIHBsYXllcj9cIjtcbn07XG5cbmV4cG9ydCBjb25zdCBhdWdtZW50R2FtZUxvYmJ5ID0gZ2FtZUxvYmJ5ID0+IHtcbiAgZ2FtZUxvYmJ5LmdldCA9IGtleSA9PiBnYW1lTG9iYnkuZGF0YVtrZXldO1xuICBnYW1lTG9iYnkuc2V0ID0gc2V0KGdhbWVMb2JieS5kYXRhLCBnYW1lTG9iYnlTZXQoZ2FtZUxvYmJ5Ll9pZCkpO1xuICBnYW1lTG9iYnkuYXBwZW5kID0gYXBwZW5kKGdhbWVMb2JieS5kYXRhLCBnYW1lTG9iYnlTZXQoZ2FtZUxvYmJ5Ll9pZCwgdHJ1ZSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnRQbGF5ZXJMb2JieSA9IChcbiAgcGxheWVyLFxuICByb3VuZCA9IHt9LFxuICBzdGFnZSA9IHt9LFxuICBnYW1lTG9iYnkgPSB7fVxuKSA9PiB7XG4gIGNvbnN0IHsgX2lkOiBwbGF5ZXJJZCB9ID0gcGxheWVyO1xuXG4gIHBsYXllci5leGl0ID0gcmVhc29uID0+XG4gICAgZWFybHlFeGl0UGxheWVyTG9iYnkuY2FsbCh7XG4gICAgICBwbGF5ZXJJZCxcbiAgICAgIGV4aXRSZWFzb246IHJlYXNvbixcbiAgICAgIGdhbWVMb2JieUlkOiBnYW1lTG9iYnkuX2lkXG4gICAgfSk7XG4gIHBsYXllci5nZXQgPSBrZXkgPT4gcGxheWVyLmRhdGFba2V5XTtcbiAgcGxheWVyLnNldCA9IHNldChwbGF5ZXIuZGF0YSwgcGxheWVyU2V0KHBsYXllcklkKSk7XG4gIHBsYXllci5hcHBlbmQgPSBhcHBlbmQocGxheWVyLmRhdGEsIHBsYXllclNldChwbGF5ZXJJZCwgdHJ1ZSkpO1xuICBwbGF5ZXIubG9nID0gKG5hbWUsIGRhdGEpID0+IHtcbiAgICBwbGF5ZXJMb2cuY2FsbCh7XG4gICAgICBwbGF5ZXJJZCxcbiAgICAgIG5hbWUsXG4gICAgICBqc29uRGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICBzdGFnZUlkOiBzdGFnZS5faWQsXG4gICAgICByb3VuZElkOiByb3VuZC5faWQsXG4gICAgICBnYW1lTG9iYnlJZDogZ2FtZUxvYmJ5Ll9pZFxuICAgIH0pO1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGF1Z21lbnRQbGF5ZXIgPSAocGxheWVyLCBzdGFnZSA9IHt9LCByb3VuZCA9IHt9LCBnYW1lID0ge30pID0+IHtcbiAgY29uc3QgeyBfaWQ6IHBsYXllcklkIH0gPSBwbGF5ZXI7XG5cbiAgcGxheWVyLmV4aXQgPSByZWFzb24gPT5cbiAgICBlYXJseUV4aXRQbGF5ZXIuY2FsbCh7XG4gICAgICBwbGF5ZXJJZCxcbiAgICAgIGV4aXRSZWFzb246IHJlYXNvbixcbiAgICAgIGdhbWVJZDogZ2FtZS5faWRcbiAgICB9KTtcbiAgcGxheWVyLmdldCA9IGtleSA9PiBwbGF5ZXIuZGF0YVtrZXldO1xuICBwbGF5ZXIuc2V0ID0gc2V0KHBsYXllci5kYXRhLCBwbGF5ZXJTZXQocGxheWVySWQpKTtcbiAgcGxheWVyLmFwcGVuZCA9IGFwcGVuZChwbGF5ZXIuZGF0YSwgcGxheWVyU2V0KHBsYXllcklkLCB0cnVlKSk7XG4gIHBsYXllci5sb2cgPSAobmFtZSwgZGF0YSkgPT4ge1xuICAgIHBsYXllckxvZy5jYWxsKHtcbiAgICAgIHBsYXllcklkLFxuICAgICAgbmFtZSxcbiAgICAgIGpzb25EYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgIHN0YWdlSWQ6IHN0YWdlLl9pZCxcbiAgICAgIHJvdW5kSWQ6IHJvdW5kLl9pZCxcbiAgICAgIGdhbWVJZDogZ2FtZS5faWRcbiAgICB9KTtcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBhdWdtZW50UGxheWVyU3RhZ2VSb3VuZCA9IChcbiAgcGxheWVyLFxuICBzdGFnZSA9IHt9LFxuICByb3VuZCA9IHt9LFxuICBnYW1lID0ge31cbikgPT4ge1xuICBjb25zdCB7IF9pZDogcGxheWVySWQgfSA9IHBsYXllcjtcblxuICBhdWdtZW50UGxheWVyKHBsYXllciwgc3RhZ2UsIHJvdW5kLCBnYW1lKTtcblxuICBpZiAoc3RhZ2UpIHtcbiAgICBjb25zdCBwbGF5ZXJTdGFnZSA9IFBsYXllclN0YWdlcy5maW5kT25lKHtcbiAgICAgIHN0YWdlSWQ6IHN0YWdlLl9pZCxcbiAgICAgIHBsYXllcklkXG4gICAgfSk7XG4gICAgc3RhZ2UuZ2V0ID0ga2V5ID0+IHBsYXllclN0YWdlLmRhdGFba2V5XTtcbiAgICBzdGFnZS5zZXQgPSBzZXQocGxheWVyU3RhZ2UuZGF0YSwgc3RhZ2VTZXQocGxheWVyU3RhZ2UuX2lkKSk7XG4gICAgc3RhZ2UuYXBwZW5kID0gYXBwZW5kKHBsYXllclN0YWdlLmRhdGEsIHN0YWdlU2V0KHBsYXllclN0YWdlLl9pZCwgdHJ1ZSkpO1xuICAgIHN0YWdlLnN1Ym1pdCA9IHN0YWdlU3VibWl0KHBsYXllclN0YWdlLl9pZCwgZXJyID0+IHtcbiAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIHN0YWdlLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3RhZ2Uuc3VibWl0dGVkID0gQm9vbGVhbihwbGF5ZXJTdGFnZS5zdWJtaXR0ZWRBdCk7XG4gIH1cblxuICBpZiAocm91bmQpIHtcbiAgICBjb25zdCBwbGF5ZXJSb3VuZCA9IFBsYXllclJvdW5kcy5maW5kT25lKHtcbiAgICAgIHJvdW5kSWQ6IHJvdW5kLl9pZCxcbiAgICAgIHBsYXllcklkXG4gICAgfSk7XG4gICAgcm91bmQuZ2V0ID0ga2V5ID0+IHBsYXllclJvdW5kLmRhdGFba2V5XTtcbiAgICByb3VuZC5zZXQgPSBzZXQocGxheWVyUm91bmQuZGF0YSwgcm91bmRTZXQocGxheWVyUm91bmQuX2lkKSk7XG4gICAgcm91bmQuYXBwZW5kID0gYXBwZW5kKHBsYXllclJvdW5kLmRhdGEsIHJvdW5kU2V0KHBsYXllclJvdW5kLl9pZCwgdHJ1ZSkpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3R1YlBsYXllclN0YWdlUm91bmQgPSAocGxheWVyLCBzdGFnZSwgcm91bmQpID0+IHtcbiAgcGxheWVyLmdldCA9IG51bGxGdW5jO1xuICBwbGF5ZXIuc2V0ID0gbnVsbEZ1bmM7XG4gIHBsYXllci5hcHBlbmQgPSBudWxsRnVuYztcblxuICBpZiAoc3RhZ2UpIHtcbiAgICBzdGFnZS5nZXQgPSBudWxsRnVuYztcbiAgICBzdGFnZS5zZXQgPSBudWxsRnVuYztcbiAgICBzdGFnZS5hcHBlbmQgPSBudWxsRnVuYztcbiAgICBzdGFnZS5zdWJtaXQgPSBudWxsRnVuYztcbiAgICBzdGFnZS5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGlmIChyb3VuZCkge1xuICAgIHJvdW5kLmdldCA9IG51bGxGdW5jO1xuICAgIHJvdW5kLnNldCA9IG51bGxGdW5jO1xuICAgIHJvdW5kLmFwcGVuZCA9IG51bGxGdW5jO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgYXVnbWVudEdhbWVTdGFnZVJvdW5kID0gKGdhbWUsIHN0YWdlLCByb3VuZCkgPT4ge1xuICBpZiAoZ2FtZSkge1xuICAgIGdhbWUuZ2V0ID0ga2V5ID0+IGdhbWUuZGF0YVtrZXldO1xuICAgIGdhbWUuc2V0ID0gc2V0KGdhbWUuZGF0YSwgZ2FtZVNldChnYW1lLl9pZCkpO1xuICAgIGdhbWUuYXBwZW5kID0gYXBwZW5kKGdhbWUuZGF0YSwgZ2FtZVNldChnYW1lLl9pZCwgdHJ1ZSkpO1xuICAgIGdhbWUuZW5kID0gZW5kUmVhc29uID0+XG4gICAgICBlYXJseUV4aXRHYW1lLmNhbGwoe1xuICAgICAgICBnYW1lSWQ6IGdhbWUuX2lkLFxuICAgICAgICBlbmRSZWFzb24sXG4gICAgICAgIHN0YXR1czogXCJjdXN0b21cIlxuICAgICAgfSk7XG4gIH1cblxuICBpZiAoc3RhZ2UpIHtcbiAgICBzdGFnZS5nZXQgPSBrZXkgPT4ge1xuICAgICAgcmV0dXJuIHN0YWdlLmRhdGFba2V5XTtcbiAgICB9O1xuICAgIHN0YWdlLnNldCA9IHNldChzdGFnZS5kYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgdXBkYXRlU3RhZ2VEYXRhLmNhbGwoe1xuICAgICAgICBzdGFnZUlkOiBzdGFnZS5faWQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICAgICAgYXBwZW5kOiBmYWxzZSxcbiAgICAgICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzdGFnZS5hcHBlbmQgPSBhcHBlbmQoc3RhZ2UuZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHVwZGF0ZVN0YWdlRGF0YS5jYWxsKHtcbiAgICAgICAgc3RhZ2VJZDogc3RhZ2UuX2lkLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSksXG4gICAgICAgIGFwcGVuZDogdHJ1ZSxcbiAgICAgICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBzdGFnZS5zdWJtaXQgPSAoKSA9PiB7XG4gICAgICB0aHJvdyBcIllvdSBjYW5ub3Qgc3VibWl0IHRoZSBlbnRpcmUgc3RhZ2UgYXQgdGhlIG1vbWVudFwiO1xuICAgIH07XG4gIH1cblxuICBpZiAocm91bmQpIHtcbiAgICByb3VuZC5nZXQgPSBrZXkgPT4ge1xuICAgICAgcmV0dXJuIHJvdW5kLmRhdGFba2V5XTtcbiAgICB9O1xuICAgIHJvdW5kLnNldCA9IHNldChyb3VuZC5kYXRhLCAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgdXBkYXRlUm91bmREYXRhLmNhbGwoe1xuICAgICAgICByb3VuZElkOiByb3VuZC5faWQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IEpTT04uc3RyaW5naWZ5KHZhbHVlKSxcbiAgICAgICAgYXBwZW5kOiBmYWxzZSxcbiAgICAgICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByb3VuZC5hcHBlbmQgPSBhcHBlbmQocm91bmQuZGF0YSwgKGtleSwgdmFsdWUpID0+IHtcbiAgICAgIHVwZGF0ZVJvdW5kRGF0YS5jYWxsKHtcbiAgICAgICAgcm91bmRJZDogcm91bmQuX2lkLFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSksXG4gICAgICAgIGFwcGVuZDogdHJ1ZSxcbiAgICAgICAgbm9DYWxsYmFjazogTWV0ZW9yLmlzU2VydmVyXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHN0dWJTdGFnZVJvdW5kID0gKHN0YWdlLCByb3VuZCkgPT4ge1xuICBzdGFnZS5nZXQgPSBudWxsRnVuYztcbiAgc3RhZ2Uuc2V0ID0gbnVsbEZ1bmM7XG4gIHN0YWdlLmFwcGVuZCA9IG51bGxGdW5jO1xuICBzdGFnZS5zdWJtaXQgPSBudWxsRnVuYztcbiAgcm91bmQuZ2V0ID0gbnVsbEZ1bmM7XG4gIHJvdW5kLnNldCA9IG51bGxGdW5jO1xuICByb3VuZC5hcHBlbmQgPSBudWxsRnVuYztcbn07XG4iLCIvLyBTZWUgaWYgZXZlcnlvbmUgaXMgZG9uZSB3aXRoIHRoaXMgc3RhZ2VcbmltcG9ydCB7IFBsYXllclN0YWdlcyB9IGZyb20gXCIuL3BsYXllci1zdGFnZXNcIjtcbmltcG9ydCB7IGVuZE9mU3RhZ2UgfSBmcm9tIFwiLi4vc3RhZ2VzL2ZpbmlzaC5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnNcIjtcblxuUGxheWVyU3RhZ2VzLmFmdGVyLnVwZGF0ZShcbiAgZnVuY3Rpb24odXNlcklkLCBwbGF5ZXJTdGFnZSwgZmllbGROYW1lcywgbW9kaWZpZXIsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWZpZWxkTmFtZXMuaW5jbHVkZXMoXCJzdWJtaXR0ZWRBdFwiKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IHN0YWdlSWQgfSA9IHBsYXllclN0YWdlO1xuXG4gICAgY29uc3QgcGxheWVySURzID0gUGxheWVyU3RhZ2VzLmZpbmQoeyBzdGFnZUlkIH0pLm1hcChwID0+IHAucGxheWVySWQpO1xuICAgIGNvbnN0IGF2YWlsUGxheWVySURzID0gUGxheWVycy5maW5kKHtcbiAgICAgIF9pZDogeyAkaW46IHBsYXllcklEcyB9LFxuICAgICAgZXhpdEF0OiB7ICRleGlzdHM6IGZhbHNlIH1cbiAgICB9KS5tYXAocCA9PiBwLl9pZCk7XG5cbiAgICBjb25zdCBkb25lQ291bnQgPSBQbGF5ZXJTdGFnZXMuZmluZCh7XG4gICAgICBzdGFnZUlkLFxuICAgICAgcGxheWVySWQ6IHsgJGluOiBhdmFpbFBsYXllcklEcyB9LFxuICAgICAgc3VibWl0dGVkQXQ6IHsgJGV4aXN0czogdHJ1ZSB9XG4gICAgfSkuY291bnQoKTtcblxuICAgIGlmIChkb25lQ291bnQgPT09IGF2YWlsUGxheWVySURzLmxlbmd0aCkge1xuICAgICAgZW5kT2ZTdGFnZShzdGFnZUlkKTtcbiAgICB9XG4gIH0sXG4gIHsgZmV0Y2hQcmV2aW91czogZmFsc2UgfVxuKTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuaW1wb3J0IHsgUGxheWVyU3RhZ2VzIH0gZnJvbSBcIi4vcGxheWVyLXN0YWdlc1wiO1xuaW1wb3J0IHNoYXJlZCBmcm9tIFwiLi4vLi4vc2hhcmVkLmpzXCI7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVQbGF5ZXJTdGFnZURhdGEgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJTdGFnZXMubWV0aG9kcy51cGRhdGVEYXRhXCIsXG5cbiAgdmFsaWRhdGU6IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHBsYXllclN0YWdlSWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuICAgIGtleToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfSxcbiAgICBhcHBlbmQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgbm9DYWxsYmFjazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBwbGF5ZXJTdGFnZUlkLCBrZXksIHZhbHVlLCBhcHBlbmQsIG5vQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHBsYXllclN0YWdlID0gUGxheWVyU3RhZ2VzLmZpbmRPbmUocGxheWVyU3RhZ2VJZCk7XG4gICAgaWYgKCFwbGF5ZXJTdGFnZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGxheWVyU3RhZ2Ugbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIC8vIFRPRE8gY2hlY2sgY2FuIHVwZGF0ZSB0aGlzIHJlY29yZCBwbGF5ZXJTdGFnZVxuXG4gICAgY29uc3QgdmFsID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgbGV0IHVwZGF0ZSA9IHsgW2BkYXRhLiR7a2V5fWBdOiB2YWwgfTtcbiAgICBjb25zdCBtb2RpZmllciA9IGFwcGVuZCA/IHsgJHB1c2g6IHVwZGF0ZSB9IDogeyAkc2V0OiB1cGRhdGUgfTtcblxuICAgIFBsYXllclN0YWdlcy51cGRhdGUocGxheWVyU3RhZ2VJZCwgbW9kaWZpZXIsIHtcbiAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmICFub0NhbGxiYWNrKSB7XG4gICAgICBzaGFyZWQuY2FsbE9uQ2hhbmdlKHtcbiAgICAgICAgcGxheWVySWQ6IHBsYXllclN0YWdlLnBsYXllcklkLFxuICAgICAgICBwbGF5ZXJTdGFnZUlkLFxuICAgICAgICBwbGF5ZXJTdGFnZSxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdmFsLFxuICAgICAgICBwcmV2VmFsdWU6IHBsYXllclN0YWdlLmRhdGEgJiYgcGxheWVyU3RhZ2UuZGF0YVtrZXldLFxuICAgICAgICBhcHBlbmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBzdWJtaXRQbGF5ZXJTdGFnZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlBsYXllclN0YWdlcy5tZXRob2RzLnN1Ym1pdFwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBwbGF5ZXJTdGFnZUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfSxcbiAgICBub0NhbGxiYWNrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHBsYXllclN0YWdlSWQsIG5vQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHBsYXllclN0YWdlID0gUGxheWVyU3RhZ2VzLmZpbmRPbmUocGxheWVyU3RhZ2VJZCk7XG4gICAgaWYgKCFwbGF5ZXJTdGFnZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGxheWVyU3RhZ2Ugbm90IGZvdW5kXCIpO1xuICAgIH1cbiAgICAvLyBUT0RPIGNoZWNrIGNhbiB1cGRhdGUgdGhpcyByZWNvcmQgcGxheWVyU3RhZ2VcblxuICAgIGlmIChwbGF5ZXJTdGFnZS5zdWJtaXR0ZWRBdCkge1xuICAgICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwic3RhZ2UgYWxyZWFkeSBzdWJtaXR0ZWRcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBQbGF5ZXJTdGFnZXMudXBkYXRlKHBsYXllclN0YWdlSWQsIHsgJHNldDogeyBzdWJtaXR0ZWRBdDogbmV3IERhdGUoKSB9IH0pO1xuXG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiAhbm9DYWxsYmFjaykge1xuICAgICAgc2hhcmVkLmNhbGxPblN1Ym1pdCh7XG4gICAgICAgIHBsYXllcklkOiBwbGF5ZXJTdGFnZS5wbGF5ZXJJZCxcbiAgICAgICAgcGxheWVyU3RhZ2VcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgVGltZXN0YW1wU2NoZW1hLCBVc2VyRGF0YVNjaGVtYSwgQmVsb25nc1RvIH0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hc1wiO1xuXG5leHBvcnQgY29uc3QgUGxheWVyU3RhZ2VzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJwbGF5ZXJfc3RhZ2VzXCIpO1xuXG5QbGF5ZXJTdGFnZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN1Ym1pdHRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55SW5zZXJ0OiB0cnVlLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGluZGV4OiAxXG4gIH1cbn0pO1xuXG5QbGF5ZXJTdGFnZXMuc2NoZW1hLmV4dGVuZChUaW1lc3RhbXBTY2hlbWEpO1xuUGxheWVyU3RhZ2VzLnNjaGVtYS5leHRlbmQoVXNlckRhdGFTY2hlbWEpO1xuUGxheWVyU3RhZ2VzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiUGxheWVyc1wiKSk7XG5QbGF5ZXJTdGFnZXMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJTdGFnZXNcIikpO1xuUGxheWVyU3RhZ2VzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiUm91bmRzXCIpKTtcblBsYXllclN0YWdlcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkdhbWVzXCIpKTtcblBsYXllclN0YWdlcy5zY2hlbWEuZXh0ZW5kKEJlbG9uZ3NUbyhcIkJhdGNoZXNcIikpO1xuUGxheWVyU3RhZ2VzLmF0dGFjaFNjaGVtYShQbGF5ZXJTdGFnZXMuc2NoZW1hKTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gXCJtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2RcIjtcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSBcInNpbXBsLXNjaGVtYVwiO1xuXG5pbXBvcnQgeyBCYXRjaGVzIH0gZnJvbSBcIi4uL2JhdGNoZXMvYmF0Y2hlcy5qc1wiO1xuaW1wb3J0IHsgR2FtZUxvYmJpZXMgfSBmcm9tIFwiLi4vZ2FtZS1sb2JiaWVzL2dhbWUtbG9iYmllc1wiO1xuaW1wb3J0IHsgSWRTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzLmpzXCI7XG5pbXBvcnQgeyBMb2JieUNvbmZpZ3MgfSBmcm9tIFwiLi4vbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi9nYW1lcy9nYW1lcy5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuL3BsYXllcnNcIjtcbmltcG9ydCB7IGV4aXRTdGF0dXNlcyB9IGZyb20gXCIuL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IHNsZWVwLCB3ZWlnaHRlZFJhbmRvbSB9IGZyb20gXCIuLi8uLi9saWIvdXRpbHMuanNcIjtcbmltcG9ydCBzaGFyZWQgZnJvbSBcIi4uLy4uL3NoYXJlZC5qc1wiO1xuaW1wb3J0IGdhbWVMb2JieUxvY2sgZnJvbSBcIi4uLy4uL2dhbWVMb2JieS1sb2NrLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVQbGF5ZXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMuY3JlYXRlXCIsXG5cbiAgdmFsaWRhdGU6IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIGlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIHVybFBhcmFtczoge1xuICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHt9XG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4ocGxheWVyKSB7XG4gICAgLy8gRmluZCB0aGUgZmlyc3QgcnVubmluZyBiYXRjaCAoaW4gb3JkZXIgb2YgcnVubmluZyBzdGFydGVkIHRpbWUpXG4gICAgY29uc3QgYmF0Y2ggPSBCYXRjaGVzLmZpbmRPbmUoXG4gICAgICB7IHN0YXR1czogXCJydW5uaW5nXCIsIGZ1bGw6IGZhbHNlIH0sXG4gICAgICB7IHNvcnQ6IHsgcnVubmluZ0F0OiAxIH0gfVxuICAgICk7XG5cbiAgICBpZiAoIWJhdGNoKSB7XG4gICAgICAvLyBUaGUgVUkgc2hvdWxkIHVwZGF0ZSBhbmQgcmVhbGl6ZSB0aGVyZSBpcyBubyBiYXRjaCBhdmFpbGFibGVcbiAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGEgcmFyZSBjYXNlIHdoZXJlIGEgZnJhY3Rpb24gb2YgYSBzZWNvbmQgb2ZcbiAgICAgIC8vIGRlc3luY2hvcm5pc2F0aW9uIHdoZW4gdGhlIGxhc3QgYXZhaWxhYmxlIGJhdGNoIGp1c3QgZmluaXNoZWQuXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBjYXNlLCBzaW5jZSB0aGUgdXNlciBleGlzdCBpbiB0aGUgREIgYXQgdGhpcyBwb2ludFxuICAgICAgLy8gYnV0IGhhcyBubyBsb2JieSBhc3NpZ25lZCwgYW5kIHRoZSBVSSB3aWxsIHNvb24gZGV0ZXJtaW5lIHRoZXJlXG4gICAgICAvLyBpcyBubyBhdmFpbGFibGUgZ2FtZSwgdGhlIFVJIHdpbGwgc3dpdGNoIHRvIFwiTm8gZXhwZXJpbWVudHNcbiAgICAgIC8vIGF2YWlsYWJsZVwiLCBub3RoaW5nIGVsc2UgdG8gZG8uXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVE9ETzogTUFZQkUsIGFkZCB2ZXJpZmljYXRpb24gdGhhdCB0aGUgdXNlciBpcyBub3QgY3VycmVudCBjb25uZWN0ZWRcbiAgICAvLyBlbHNld2hlcmUgYW5kIHRoaXMgaXMgbm90IGEgZmxhZ3JhbnQgaW1wZXJzb25hdGlvbi4gTm90ZSB0aGF0IGlzXG4gICAgLy8gZXh0cmVtZWx5IGRpZmZpY3VsdCB0byBndWFyYW50eS4gQ291bGQgYWxzbyBhZGQgdmVyaWZpY2F0aW9uIG9mIHVzZXInc1xuICAgIC8vIGlkIHdpdGggZW1haWwgdmVyaWNhdGlvbiBmb3IgZXhhbXBsZS4gRm9yIG5vdyB0aGUgYXNzdW1wdGlvbiBpcyB0aGF0XG4gICAgLy8gdGhlcmUgaXMgbm8gaW1tZWRpYXRlIHJlYXNvbiBvciBsb25nLXRlcm0gbW90aXZpYXRpb24gZm9yIHBlb3BsZSB0byBoYWNrXG4gICAgLy8gZWFjaCBvdGhlcidzIHBsYXllciBhY2NvdW50LlxuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBQbGF5ZXJzLmZpbmRPbmUoeyBpZDogcGxheWVyLmlkIH0pO1xuXG4gICAgLy8gSWYgdGhlIHBsYXllciBhbHJlYWR5IGhhcyBhIGdhbWUgbG9iYnkgYXNzaWduZWQsIG5vIG5lZWQgdG9cbiAgICAvLyByZS1pbml0aWFsaXplIHRoZW1cbiAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcuZ2FtZUxvYmJ5SWQpIHtcbiAgICAgIHJldHVybiBleGlzdGluZy5faWQ7XG4gICAgfVxuXG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICBwbGF5ZXIgPSBleGlzdGluZztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQmVjYXVzZSBvZiBhIGJ1ZyBpbiBTaW1wbGVTY2hlbWEgYXJvdW5kIGJsYWNrYm94OiB0cnVlLCBza2lwcGluZ1xuICAgICAgLy8gdmFsaWRhdGlvbiBoZXJlLiBWYWxpZGF0aW9uIGRpZCBoYXBwZW4gYXQgdGhlIG1ldGhvZCBsZXZlbCB0aG91Z2guXG4gICAgICBwbGF5ZXIuX2lkID0gUGxheWVycy5pbnNlcnQocGxheWVyLCB7XG4gICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgIHZhbGlkYXRlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gTG9va2luZyBmb3IgYWxsIGxvYmJpZXMgZm9yIGJhdGNoIChmb3Igd2hpY2ggdGhhdCBnYW1lIGhhcyBub3Qgc3RhcnRlZCB5ZXQpXG4gICAgY29uc3QgbG9iYmllcyA9IEdhbWVMb2JiaWVzLmZpbmQoe1xuICAgICAgYmF0Y2hJZDogYmF0Y2guX2lkLFxuICAgICAgc3RhdHVzOiBcInJ1bm5pbmdcIixcbiAgICAgIHRpbWVkT3V0QXQ6IHsgJGV4aXN0czogZmFsc2UgfSxcbiAgICAgIGdhbWVJZDogeyAkZXhpc3RzOiBmYWxzZSB9XG4gICAgfSkuZmV0Y2goKTtcblxuICAgIGlmIChsb2JiaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgc2FtZSBjYXNlIGFzIHdoZW4gdGhlcmUgYXJlIG5vIGJhdGNoZXMgYXZhaWxhYmxlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIExldCdzIGZpcnN0IHRyeSB0byBmaW5kIGxvYmJpZXMgZm9yIHdoaWNoIHRoZWlyIHF1ZXVlIGlzbid0IGZ1bGwgeWV0XG4gICAgbGV0IGxvYmJ5UG9vbCA9IGxvYmJpZXMuZmlsdGVyKFxuICAgICAgbCA9PiBsLmF2YWlsYWJsZUNvdW50ID4gbC5xdWV1ZWRQbGF5ZXJJZHMubGVuZ3RoXG4gICAgKTtcblxuICAgIC8vIElmIG5vIGxvYmJpZXMgc3RpbGwgaGF2ZSBcImF2YWlsYWJpbGl0eVwiLCBqdXN0IGZpbGwgYW55IGxvYmJ5XG4gICAgaWYgKGxvYmJ5UG9vbC5sZW5ndGggPT09IDApIHtcbiAgICAgIGxvYmJ5UG9vbCA9IGxvYmJpZXM7XG4gICAgfVxuXG4gICAgLy8gQm9vayBwcm9wb3J0aWFsbHkgdG8gdG90YWwgZXhwZWN0ZWQgcGxheWVyQ291bnRcbiAgICBjb25zdCB3ZWlndGhlZExvYmJ5UG9vbCA9IGxvYmJ5UG9vbC5tYXAobG9iYnkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGxvYmJ5LFxuICAgICAgICB3ZWlnaHQ6IGxvYmJ5LmF2YWlsYWJsZUNvdW50XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gQ2hvb3NlIGEgbG9iYnkgaW4gdGhlIGF2YWlsYWJsZSB3ZWlndGhlZCBwb29sXG4gICAgY29uc3QgbG9iYnkgPSB3ZWlnaHRlZFJhbmRvbSh3ZWlndGhlZExvYmJ5UG9vbCkoKTtcblxuICAgIC8vIEFkZGluZyB0aGUgcGxheWVyIHRvIHNwZWNpZmllZCBsb2JieSBxdWV1ZVxuICAgIEdhbWVMb2JiaWVzLnVwZGF0ZShsb2JieS5faWQsIHtcbiAgICAgICRhZGRUb1NldDoge1xuICAgICAgICBxdWV1ZWRQbGF5ZXJJZHM6IHBsYXllci5faWRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGdhbWVMb2JieUlkID0gbG9iYnkuX2lkO1xuICAgIGNvbnN0ICRzZXQgPSB7IGdhbWVMb2JieUlkIH07XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSB3aWxsIGJlIGluc3RydWN0aW9uc1xuICAgIGxldCBza2lwSW5zdHJ1Y3Rpb25zID0gbG9iYnkuZGVidWdNb2RlO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIGluc3RydWN0aW9uLCBtYXJrIHRoZSBwbGF5ZXIgYXMgcmVhZHkgaW1tZWRpYXRlbHlcbiAgICBpZiAoc2tpcEluc3RydWN0aW9ucykge1xuICAgICAgJHNldC5yZWFkeUF0ID0gbmV3IERhdGUoKTtcbiAgICB9XG5cbiAgICBQbGF5ZXJzLnVwZGF0ZShwbGF5ZXIuX2lkLCB7ICRzZXQgfSk7XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gaW5zdHJ1Y3Rpb24sIHBsYXllciBpcyByZWFkeSwgbm90aWZ5IHRoZSBsb2JieVxuICAgIGlmIChza2lwSW5zdHJ1Y3Rpb25zKSB7XG4gICAgICBHYW1lTG9iYmllcy51cGRhdGUoZ2FtZUxvYmJ5SWQsIHtcbiAgICAgICAgJGFkZFRvU2V0OiB7IHBsYXllcklkczogcGxheWVyLl9pZCB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGxheWVyLl9pZDtcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBwbGF5ZXJSZWFkeSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlBsYXllcnMubWV0aG9kcy5yZWFkeVwiLFxuXG4gIHZhbGlkYXRlOiBJZFNjaGVtYS52YWxpZGF0b3IoKSxcblxuICBhc3luYyBydW4oeyBfaWQgfSkge1xuICAgIGlmICghTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIExvYmJ5IG1pZ2h0IGJlIGxvY2tlZCBpZiBnYW1lIGlzIGN1cnJlbnRseSBiZWluZyBjcmVhdGVkLlxuICAgICAgLy8gV2UgcmV0cnkgdW50aWwgbG9iYnkgaXMgdW5sb2NrZWQuXG4gICAgICB3aGlsZSAoIWFzc2lnblRvTG9iYnkoX2lkKSkge1xuICAgICAgICBhd2FpdCBzbGVlcCgxMDAwKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIlBsYXllcnMubWV0aG9kcy5yZWFkeVwiLCBlcnJvcik7XG4gICAgfVxuICB9XG59KTtcblxuZnVuY3Rpb24gYXNzaWduVG9Mb2JieShfaWQpIHtcbiAgY29uc3QgcGxheWVyID0gUGxheWVycy5maW5kT25lKF9pZCk7XG5cbiAgaWYgKCFwbGF5ZXIpIHtcbiAgICB0aHJvdyBgdW5rbm93biByZWFkeSBwbGF5ZXI6ICR7X2lkfWA7XG4gIH1cbiAgY29uc3QgeyByZWFkeUF0LCBnYW1lTG9iYnlJZCB9ID0gcGxheWVyO1xuXG4gIGlmIChyZWFkeUF0KSB7XG4gICAgLy8gQWxyZWFkeSByZWFkeVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgbG9iYnkgPSBHYW1lTG9iYmllcy5maW5kT25lKGdhbWVMb2JieUlkKTtcblxuICBpZiAoIWxvYmJ5KSB7XG4gICAgdGhyb3cgYHVua25vd24gbG9iYnkgZm9yIHJlYWR5IHBsYXllcjogJHtfaWR9YDtcbiAgfVxuXG4gIC8vIEdhbWVMb2JieSBpcyBsb2NrZWQuXG4gIGlmIChnYW1lTG9iYnlMb2NrW2dhbWVMb2JieUlkXSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIEdhbWUgaXMgRnVsbCwgYmFpbCB0aGUgcGxheWVyXG4gIGlmIChsb2JieS5wbGF5ZXJJZHMubGVuZ3RoID09PSBsb2JieS5hdmFpbGFibGVDb3VudCkge1xuICAgIC8vIFVzZXIgYWxyZWFkeSByZWFkeSwgc29tZXRoaW5nIGhhcHBlbmVkIG91dCBvZiBvcmRlclxuICAgIGlmIChsb2JieS5wbGF5ZXJJZHMuaW5jbHVkZXMoX2lkKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGUgcGxheWVyJ3MgcGFydGljaXBhdGlvbiBhdHRlbXAgYXMgZmFpbGVkIGlmXG4gICAgLy8gbm90IGFscmVhZHkgbWFya2VkIGV4aXRlZFxuICAgIFBsYXllcnMudXBkYXRlKFxuICAgICAge1xuICAgICAgICBfaWQsXG4gICAgICAgIGV4aXRBdDogeyAkZXhpc3RzOiBmYWxzZSB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZXhpdEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIGV4aXRTdGF0dXM6IFwiZ2FtZUZ1bGxcIlxuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gVHJ5IHRvIHVwZGF0ZSB0aGUgR2FtZUxvYmJ5IHdpdGggdGhlIHBsYXllcklkcyB3ZSBqdXN0IHF1ZXJpZWQuXG4gIEdhbWVMb2JiaWVzLnVwZGF0ZShcbiAgICB7IF9pZDogZ2FtZUxvYmJ5SWQsIHBsYXllcklkczogbG9iYnkucGxheWVySWRzIH0sXG4gICAge1xuICAgICAgJGFkZFRvU2V0OiB7IHBsYXllcklkczogX2lkIH1cbiAgICB9XG4gICk7XG5cbiAgLy8gSWYgdGhlIHBsYXllcklkIGluc2VydCBzdWNjZWVkZWQgKHBsYXllcklkIFdBUyBhZGRlZCB0byBwbGF5ZXJJZHMpLFxuICAvLyBtYXJrIHRoZSB1c2VyIHJlY29yZCBhcyByZWFkeSBhbmQgcG90ZW50aWFsbHkgc3RhcnQgdGhlIGluZGl2aWR1YWxcbiAgLy8gbG9iYnkgdGltZXIuXG4gIGNvbnN0IGxvYmJ5VXBkYXRlZCA9IEdhbWVMb2JiaWVzLmZpbmRPbmUoZ2FtZUxvYmJ5SWQpO1xuICBpZiAobG9iYnlVcGRhdGVkLnBsYXllcklkcy5pbmNsdWRlcyhfaWQpKSB7XG4gICAgLy8gSWYgaXQgZGlkIHdvcmssIG1hcmsgcGxheWVyIGFzIHJlYWR5XG4gICAgJHNldCA9IHsgcmVhZHlBdDogbmV3IERhdGUoKSB9O1xuXG4gICAgLy8gSWYgaXQncyBhbiBpbmRpdmlkdWFsIGxvYmJ5IHRpbWVvdXQsIG1hcmsgdGhlIGZpcnN0IHRpbWVyIGFzIHN0YXJ0ZWQuXG4gICAgY29uc3QgbG9iYnlDb25maWcgPSBMb2JieUNvbmZpZ3MuZmluZE9uZShsb2JieVVwZGF0ZWQubG9iYnlDb25maWdJZCk7XG4gICAgaWYgKGxvYmJ5Q29uZmlnLnRpbWVvdXRUeXBlID09PSBcImluZGl2aWR1YWxcIikge1xuICAgICAgJHNldC50aW1lb3V0U3RhcnRlZEF0ID0gbmV3IERhdGUoKTtcbiAgICAgICRzZXQudGltZW91dFdhaXRDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgUGxheWVycy51cGRhdGUoX2lkLCB7ICRzZXQgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBJZiB0aGUgcGxheWVySWQgaW5zZXJ0IGZhaWxlZCAocGxheWVySWQgTk9UIGFkZGVkIHRvIHBsYXllcklkcyksIHRoZVxuICAvLyBwbGF5ZXJJZHMgaGFzIGNoYW5nZWQgc2luY2UgaXQgd2FzIHF1ZXJpZWQgYW5kIHRoZSBsb2JieSBtaWdodCBub3RcbiAgLy8gaGF2ZSBhbnkgYXZhaWxhYmxlIHNsb3RzIGxlZnQsIGxvb3AgYW5kIHJldHJ5LlxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVQbGF5ZXJEYXRhID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiUGxheWVycy5tZXRob2RzLnVwZGF0ZURhdGFcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuICAgIGtleToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdHlwZTogU3RyaW5nXG4gICAgfSxcbiAgICBhcHBlbmQ6IHtcbiAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgbm9DYWxsYmFjazoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBwbGF5ZXJJZCwga2V5LCB2YWx1ZSwgYXBwZW5kLCBub0NhbGxiYWNrIH0pIHtcbiAgICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF5ZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cbiAgICAvLyBUT0RPIGNoZWNrIGNhbiB1cGRhdGUgdGhpcyByZWNvcmQgcGxheWVyXG5cbiAgICBjb25zdCB2YWwgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICBsZXQgdXBkYXRlID0geyBbYGRhdGEuJHtrZXl9YF06IHZhbCB9O1xuICAgIGNvbnN0IG1vZGlmaWVyID0gYXBwZW5kID8geyAkcHVzaDogdXBkYXRlIH0gOiB7ICRzZXQ6IHVwZGF0ZSB9O1xuXG4gICAgUGxheWVycy51cGRhdGUocGxheWVySWQsIG1vZGlmaWVyLCB7XG4gICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgdmFsaWRhdGU6IGZhbHNlLFxuICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgaWYgKE1ldGVvci5pc1NlcnZlciAmJiAhbm9DYWxsYmFjaykge1xuICAgICAgc2hhcmVkLmNhbGxPbkNoYW5nZSh7XG4gICAgICAgIHBsYXllcklkLFxuICAgICAgICBwbGF5ZXIsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IHZhbCxcbiAgICAgICAgcHJldlZhbHVlOiBwbGF5ZXIuZGF0YSAmJiBwbGF5ZXIuZGF0YVtrZXldLFxuICAgICAgICBhcHBlbmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCBtYXJrUGxheWVyRXhpdFN0ZXBEb25lID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6IFwiUGxheWVycy5tZXRob2RzLm1hcmtFeGl0U3RlcERvbmVcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuICAgIHN0ZXBOYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHBsYXllcklkLCBzdGVwTmFtZSB9KSB7XG4gICAgY29uc3QgcGxheWVyID0gUGxheWVycy5maW5kT25lKHBsYXllcklkKTtcbiAgICBpZiAoIXBsYXllcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwicGxheWVyIG5vdCBmb3VuZFwiKTtcbiAgICB9XG4gICAgLy8gVE9ETyBjaGVjayBjYW4gdXBkYXRlIHRoaXMgcmVjb3JkIHBsYXllclxuXG4gICAgUGxheWVycy51cGRhdGUocGxheWVySWQsIHsgJGFkZFRvU2V0OiB7IGV4aXRTdGVwc0RvbmU6IHN0ZXBOYW1lIH0gfSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZXh0ZW5kUGxheWVyVGltZW91dFdhaXQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMuZXh0ZW5kVGltZW91dFdhaXRcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHBsYXllcklkIH0pIHtcbiAgICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF5ZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIFBsYXllcnMudXBkYXRlKHBsYXllcklkLCB7XG4gICAgICAkaW5jOiB7IHRpbWVvdXRXYWl0Q291bnQ6IDEgfSxcbiAgICAgICRzZXQ6IHsgdGltZW91dFN0YXJ0ZWRBdDogbmV3IERhdGUoKSB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZW5kUGxheWVyVGltZW91dFdhaXQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMuZW5kVGltZW91dFdhaXRcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHBsYXllcklkIH0pIHtcbiAgICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF5ZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIFBsYXllcnMudXBkYXRlKHBsYXllcklkLCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGV4aXRTdGF0dXM6IFwicGxheWVyRW5kZWRMb2JieVdhaXRcIixcbiAgICAgICAgZXhpdEF0OiBuZXcgRGF0ZSgpXG4gICAgICB9XG4gICAgfSk7XG4gICAgR2FtZUxvYmJpZXMudXBkYXRlKHBsYXllci5nYW1lTG9iYnlJZCwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgcGxheWVySWRzOiBwbGF5ZXJJZFxuICAgICAgICAvLyBXZSBrZWVwIHRoZSBwbGF5ZXIgaW4gcXVldWVkUGxheWVySWRzIHNvIHRoZXkgd2lsbCBzdGlsbCBoYXZlIHRoZVxuICAgICAgICAvLyBmYWN0IHRoZXkgd2VyZSBpbiBhIGxvYmJ5IGF2YWlsYWJsZSBpbiB0aGUgVUksIGFuZCBzbyB3ZSBjYW4gc2hvd1xuICAgICAgICAvLyB0aGVtIHRoZSBleGl0IHN0ZXBzLlxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IGVhcmx5RXhpdFBsYXllciA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlBsYXllcnMubWV0aG9kcy5hZG1pbi5lYXJseUV4aXRQbGF5ZXJcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgZXhpdFJlYXNvbjoge1xuICAgICAgbGFiZWw6IFwiUmVhc29uIGZvciBFeGl0XCIsXG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogL1thLXpBLVowLTlfXSsvXG4gICAgfSxcbiAgICBwbGF5ZXJJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICAgIH0sXG4gICAgZ2FtZUlkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBleGl0UmVhc29uLCBwbGF5ZXJJZCwgZ2FtZUlkIH0pIHtcbiAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGdhbWUgPSBHYW1lcy5maW5kT25lKGdhbWVJZCk7XG5cbiAgICBpZiAoIWdhbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcImdhbWUgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGlmIChnYW1lICYmIGdhbWUuZmluaXNoZWRBdCkge1xuICAgICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiXFxuXFxuZ2FtZSBhbHJlYWR5IGVuZGVkIVwiKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgJiYgY3VycmVudFBsYXllci5leGl0QXQpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcbnBsYXllciBhbHJlYWR5IGV4aXRlZCFcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBQbGF5ZXJzLnVwZGF0ZShwbGF5ZXJJZCwge1xuICAgICAgJHNldDoge1xuICAgICAgICBleGl0QXQ6IG5ldyBEYXRlKCksXG4gICAgICAgIGV4aXRTdGF0dXM6IFwiY3VzdG9tXCIsXG4gICAgICAgIGV4aXRSZWFzb25cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHBsYXllcnMgPSBQbGF5ZXJzLmZpbmQoeyBnYW1lSWQgfSkuZmV0Y2goKTtcbiAgICBjb25zdCBvbmxpbmVQbGF5ZXJzID0gcGxheWVycy5maWx0ZXIocGxheWVyID0+ICFwbGF5ZXIuZXhpdEF0KTtcblxuICAgIGlmICghb25saW5lUGxheWVycyB8fCAob25saW5lUGxheWVycyAmJiBvbmxpbmVQbGF5ZXJzLmxlbmd0aCA9PT0gMCkpIHtcbiAgICAgIEdhbWVzLnVwZGF0ZShnYW1lSWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGZpbmlzaGVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RhdHVzOiBcImN1c3RvbVwiLFxuICAgICAgICAgIGVuZFJlYXNvbjogXCJmaW5pc2hlZF9lYXJseVwiXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBHYW1lTG9iYmllcy51cGRhdGUoXG4gICAgICAgIHsgZ2FtZUlkIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzdGF0dXM6IFwiY3VzdG9tXCIsXG4gICAgICAgICAgICBlbmRSZWFzb246IFwiZmluaXNoZWRfZWFybHlcIlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5leHBvcnQgY29uc3QgZWFybHlFeGl0UGxheWVyTG9iYnkgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMuYWRtaW4uZWFybHlFeGl0UGxheWVyTG9iYnlcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgZXhpdFJlYXNvbjoge1xuICAgICAgbGFiZWw6IFwiUmVhc29uIGZvciBFeGl0XCIsXG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogL1thLXpBLVowLTlfXSsvXG4gICAgfSxcbiAgICBwbGF5ZXJJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICAgIH0sXG4gICAgZ2FtZUxvYmJ5SWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IGV4aXRSZWFzb24sIHBsYXllcklkLCBnYW1lTG9iYnlJZCB9KSB7XG4gICAgaWYgKCFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBnYW1lTG9iYnkgPSBHYW1lTG9iYmllcy5maW5kT25lKGdhbWVMb2JieUlkKTtcblxuICAgIGlmICghZ2FtZUxvYmJ5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJnYW1lTG9iYnkgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuXG4gICAgaWYgKGN1cnJlbnRQbGF5ZXIgJiYgY3VycmVudFBsYXllci5leGl0QXQpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlxcbnBsYXllciBhbHJlYWR5IGV4aXRlZCFcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBQbGF5ZXJzLnVwZGF0ZShwbGF5ZXJJZCwge1xuICAgICAgJHNldDoge1xuICAgICAgICBleGl0QXQ6IG5ldyBEYXRlKCksXG4gICAgICAgIGV4aXRTdGF0dXM6IFwiY3VzdG9tXCIsXG4gICAgICAgIGV4aXRSZWFzb25cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCByZXRpcmVTaW5nbGVQbGF5ZXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMuYWRtaW4ucmV0aXJlU2luZ2xlXCIsXG5cbiAgdmFsaWRhdGU6IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHBsYXllcklkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gICAgfVxuICB9KS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBwbGF5ZXJJZCB9KSB7XG4gICAgaWYgKCFwbGF5ZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZW1wdHkgcGxheWVySWRcIik7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXllciA9IFBsYXllcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHBsYXllcklkLFxuICAgICAgcmV0aXJlZEF0OiB7ICRleGlzdHM6IGZhbHNlIH1cbiAgICB9KTtcblxuICAgIGlmICghcGxheWVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcblxuICAgIFBsYXllcnMudXBkYXRlKHBsYXllcklkLCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGlkOiBgJHtwbGF5ZXIuaWR9IChSZXRpcmVkIGN1c3RvbSBhdCAke3RpbWVzdGFtcH0pYCxcbiAgICAgICAgcmV0aXJlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICByZXRpcmVkUmVhc29uOiBcImN1c3RvbVwiXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcGxheWVyO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHJldGlyZUdhbWVGdWxsUGxheWVycyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlBsYXllcnMubWV0aG9kcy5hZG1pbi5yZXRpcmVHYW1lRnVsbFwiLFxuXG4gIHZhbGlkYXRlOiBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICByZXRpcmVkUmVhc29uOiB7XG4gICAgICBsYWJlbDogXCJSZXRpcmVkIFJlYXNvblwiLFxuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBhbGxvd2VkVmFsdWVzOiBleGl0U3RhdHVzZXNcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHJldGlyZWRSZWFzb24gfSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVuYXV0aG9yaXplZFwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5ZXJzID0gUGxheWVycy5maW5kKHtcbiAgICAgIGV4aXRTdGF0dXM6IHJldGlyZWRSZWFzb24sXG4gICAgICByZXRpcmVkQXQ6IHsgJGV4aXN0czogZmFsc2UgfVxuICAgIH0pLmZldGNoKCk7XG5cbiAgICBjb25zdCB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBsYXllciA9IHBsYXllcnNbaV07XG5cbiAgICAgIFBsYXllcnMudXBkYXRlKHBsYXllci5faWQsIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGlkOiBgJHtwbGF5ZXIuaWR9IChSZXRpcmVkICR7cmV0aXJlZFJlYXNvbn0gYXQgJHt0aW1lc3RhbXB9KWAsXG4gICAgICAgICAgcmV0aXJlZEF0OiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHJldGlyZWRSZWFzb25cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBsYXllcnMubGVuZ3RoO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHBsYXllcldhc1JldGlyZWQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJQbGF5ZXJzLm1ldGhvZHMucGxheWVyV2FzUmV0aXJlZFwiLFxuXG4gIHZhbGlkYXRlOiBJZFNjaGVtYS52YWxpZGF0b3IoKSxcblxuICBydW4oeyBfaWQgfSkge1xuICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgUGxheWVycy5maW5kT25lKHtcbiAgICAgICAgX2lkLFxuICAgICAgICBleGl0U3RhdHVzOiB7ICRleGlzdHM6IHRydWUgfSxcbiAgICAgICAgcmV0aXJlZEF0OiB7ICRleGlzdHM6IHRydWUgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZVBsYXllclN0YXR1cyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlBsYXllcnMubWV0aG9kcy51cGRhdGVTdGF0dXNcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcGxheWVySWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgICB9LFxuXG4gICAgaWRsZToge1xuICAgICAgdHlwZTogQm9vbGVhblxuICAgIH0sXG5cbiAgICBsYXN0QWN0aXZpdHlBdDoge1xuICAgICAgdHlwZTogRGF0ZVxuICAgIH1cbiAgfSkudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgcGxheWVySWQsIGlkbGUsIGxhc3RBY3Rpdml0eUF0IH0pIHtcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBjb25zdCBwbGF5ZXJJZENvbm4gPSBzaGFyZWQucGxheWVySWRGb3JDb25uKHRoaXMuY29ubmVjdGlvbik7XG4gICAgICBpZiAoIXBsYXllcklkQ29ubikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocGxheWVySWQgIT09IHBsYXllcklkQ29ubikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiQXR0ZW1wdGluZyB0byB1cGRhdGUgcGxheWVyIHN0YXR1cyBmcm9tIHdyb25nIGNvbm5lY3Rpb25cIlxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgUGxheWVycy51cGRhdGUocGxheWVySWQsIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgaWRsZSxcbiAgICAgICAgbGFzdEFjdGl2aXR5QXRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCB7IENvdW50ZXIgfSBmcm9tIFwiLi4vLi4vbGliL2NvdW50ZXJzXCI7XG5pbXBvcnQgeyBCZWxvbmdzVG8sIFRpbWVzdGFtcFNjaGVtYSwgVXNlckRhdGFTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5cbmNsYXNzIFBsYXllcnNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChkb2MsIGNhbGxiYWNrKSB7XG4gICAgZG9jLmluZGV4ID0gQ291bnRlci5pbmMoXCJwbGF5ZXJzXCIpO1xuICAgIHJldHVybiBzdXBlci5pbnNlcnQoZG9jLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFBsYXllcnMgPSBuZXcgUGxheWVyc0NvbGxlY3Rpb24oXCJwbGF5ZXJzXCIpO1xuXG5leHBvcnQgY29uc3QgZXhpdFN0YXR1c2VzID0gW1xuICBcImdhbWVGdWxsXCIsXG4gIFwiZ2FtZUNhbmNlbGxlZFwiLFxuICBcImdhbWVMb2JieVRpbWVkT3V0XCIsXG4gIFwicGxheWVyRW5kZWRMb2JieVdhaXRcIixcbiAgXCJwbGF5ZXJMb2JieVRpbWVkT3V0XCIsXG4gIFwiZmluaXNoZWRcIixcbiAgXCJjYW5jZWxsZWRcIixcbiAgXCJmYWlsZWRcIixcbiAgXCJjdXN0b21cIlxuXTtcblxuUGxheWVycy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgLy8gVGhlIFBsYXllciBgaWRgIGlzIHVzZWQgdG8gdW5pcXVlbHkgaWRlbnRpZnkgdGhlIHBsYXllciB0byBhdm9pZFxuICAvLyBoYXZpbmcgYSB1c2VyIHBsYXkgbXVsdGlwbGUgdGltZXMuIEl0IGNhbiBiZSBhbnkgc3RyaW5nLCBmb3IgZXhhbXBsZVxuICAvLyBhbiBlbWFpbCBhZGRyZXNzLCBhIE1lY2hhbmljYWwgVHVyayBJRCwgYSBtYW51YWxseSBhc3NpZ25lZCBwYXJ0aWNpcGF0aW9uXG4gIC8vIG51bWJlciAoc2F2ZWQgYXMgc3RyaW5nKSwgZXRjLi4uXG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG1heDogMjU2XG4gIH0sXG5cbiAgLy8gVHJ1ZSBpZiB0aGUgcGxheWVyIGlzIGN1cnJlbnRseSBvbmxpbmUgYW5kIGlkbGVcbiAgaWRsZToge1xuICAgIGxhYmVsOiBcIklkbGVcIixcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG5cbiAgLy8gVHJ1ZSBpZiB0aGUgcGxheWVyIGlzIGN1cnJlbnRseSBvbmxpbmVcbiAgb25saW5lOiB7XG4gICAgbGFiZWw6IFwiT25saW5lXCIsXG4gICAgdHlwZTogQm9vbGVhbixcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuXG4gIC8vIFRpbWUgd2hlbiB0aGUgcGxheWVyIHdhcyBsYXN0IHNlZW4gb25saW5lIGFuZCBhY3RpdmVcbiAgbGFzdEFjdGl2aXR5QXQ6IHtcbiAgICBsYWJlbDogXCJMYXN0IEFjdGl2aXR5IEF0XCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuXG4gIGxhc3RMb2dpbjogeyB0eXBlOiBPYmplY3QsIG9wdGlvbmFsOiB0cnVlIH0sXG4gIFwibGFzdExvZ2luLmF0XCI6IHsgdHlwZTogRGF0ZSwgb3B0aW9uYWw6IHRydWUgfSxcbiAgXCJsYXN0TG9naW4uaXBcIjogeyB0eXBlOiBTdHJpbmcsIG9wdGlvbmFsOiB0cnVlIH0sXG4gIFwibGFzdExvZ2luLnVzZXJBZ2VudFwiOiB7IHR5cGU6IFN0cmluZywgb3B0aW9uYWw6IHRydWUgfSxcblxuICAvLyBBdXRvLWluY3JlbWVudGVkIG51bWJlciBhc3NpZ25lZCB0byBwbGF5ZXJzIGFzIHRoZXkgYXJlIGNyZWF0ZWRcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlclxuICB9LFxuXG4gIC8vIHBhcmFtcyBjb250YWlucyBhbnkgVVJMIHBhc3NlZCBwYXJhbWV0ZXJzXG4gIHVybFBhcmFtczoge1xuICAgIHR5cGU6IE9iamVjdCxcbiAgICBibGFja2JveDogdHJ1ZSxcbiAgICBkZWZhdWx0VmFsdWU6IHt9XG4gIH0sXG5cbiAgYm90OiB7XG4gICAgbGFiZWw6IFwiTmFtZSBvZiBib3QgZGVmaW5pdGlvbiBpZiBwbGF5ZXIgaXMgYSBib3RcIixcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgaW5kZXg6IDFcbiAgfSxcblxuICAvLyBUaW1lIGF0IHdpdGNoIHRoZSBwbGF5ZXIgYmVjYW1lIHJlYWR5IChkb25lIHdpdGggaW50cm8pXG4gIHJlYWR5QXQ6IHtcbiAgICBsYWJlbDogXCJSZWFkeSBBdFwiLFxuICAgIHR5cGU6IERhdGUsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcblxuICB0aW1lb3V0U3RhcnRlZEF0OiB7XG4gICAgbGFiZWw6IFwiVGltZSB0aGUgZmlyc3QgcGxheWVyIGFycml2ZWQgaW4gdGhlIGxvYmJ5XCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICB0aW1lb3V0V2FpdENvdW50OiB7XG4gICAgbGFiZWw6IFwiTnVtYmVyIG9mIHRpbWUgdGhlIHBsYXllciBoYXMgd2FpdGVkIGZvciB0aW1lb3V0U3RhcnRlZEF0XCIsXG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgbWluOiAxXG4gIH0sXG5cbiAgZXhpdFN0ZXBzRG9uZToge1xuICAgIHR5cGU6IEFycmF5LFxuICAgIGRlZmF1bHRWYWx1ZTogW11cbiAgfSxcbiAgXCJleGl0U3RlcHNEb25lLiRcIjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuXG4gIC8vIEZhaWxlZCBmaWVsZHMgYXJlIGZpbGxlZCB3aGVuIHRoZSBwbGF5ZXIncyBwYXJ0aWNpcGF0aW9uIGluIGEgZ2FtZSBmYWlsZWRcbiAgZXhpdEF0OiB7XG4gICAgbGFiZWw6IFwiRXhpdGVkIEF0XCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBleGl0U3RhdHVzOiB7XG4gICAgbGFiZWw6IFwiRmFpbGVkIFN0YXR1c1wiLFxuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBhbGxvd2VkVmFsdWVzOiBleGl0U3RhdHVzZXNcbiAgfSxcbiAgZXhpdFJlYXNvbjoge1xuICAgIGxhYmVsOiBcIkZhaWxlZCBSZWFzb25cIixcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IC9bYS16QS1aMC05X10rL1xuICB9LFxuXG4gIC8vIEEgcGxheWVyIGNhbiBiZSByZXRpcmVkLiBSZXRpcmVkIHBsYXllcnMgc2hvdWxkIG5vIGxvbmdlciBiZSB1c2VkIGluIGFjdGl2ZVxuICAvLyBnYW1lLCBidXQgTk9USElORyBpcyBkb25lIGluIHRoZSBjb2RlIHRvIGJsb2NrIHRoYXQgZnJvbSBoYXBwZW5pbmcuIEl0J3NcbiAgLy8gbW9yZSBvZiBhbiBpbmRpY2F0b3IgZm9yIGRlYnVnZ2luZyBkb3duIHRoZSBsaW5lLlxuICByZXRpcmVkQXQ6IHtcbiAgICBsYWJlbDogXCJSZXRpcmVkIEF0XCIsXG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICByZXRpcmVkUmVhc29uOiB7XG4gICAgbGFiZWw6IFwiUmV0aXJlZCBSZWFzb25cIixcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgYWxsb3dlZFZhbHVlczogZXhpdFN0YXR1c2VzXG4gIH1cbn0pO1xuXG5QbGF5ZXJzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcblBsYXllcnMuc2NoZW1hLmV4dGVuZChVc2VyRGF0YVNjaGVtYSk7XG5QbGF5ZXJzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiR2FtZXNcIiwgZmFsc2UpKTtcblBsYXllcnMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJHYW1lTG9iYmllc1wiLCBmYWxzZSkpO1xuUGxheWVycy5hdHRhY2hTY2hlbWEoUGxheWVycy5zY2hlbWEpO1xuIiwiaW1wb3J0IHsgc2F2ZVBsYXllcklkIH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Nvbm5lY3Rpb25zLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uL3BsYXllcnMuanNcIjtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi1wbGF5ZXJzXCIsIGZ1bmN0aW9uKHByb3BzKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghcHJvcHMgfHwgcHJvcHMucmV0aXJlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFBsYXllcnMuZmluZCgpO1xuICB9XG5cbiAgcmV0dXJuIFBsYXllcnMuZmluZCh7IHJldGlyZWRBdDogeyAkZXhpc3RzOiBCb29sZWFuKHByb3BzLnJldGlyZWQpIH0gfSk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJwbGF5ZXJJbmZvXCIsIGZ1bmN0aW9uKHsgcGxheWVySWQgfSkge1xuICBjb25zdCBzZWxlY3RvciA9IHtcbiAgICBfaWQ6IHBsYXllcklkLFxuICAgIHJldGlyZWRBdDogeyAkZXhpc3RzOiBmYWxzZSB9XG4gIH07XG4gIGNvbnN0IHBsYXllckV4aXN0cyA9IFBsYXllcnMuZmluZChzZWxlY3RvcikuY291bnQoKSA+IDA7XG5cbiAgaWYgKHBsYXllckV4aXN0cykge1xuICAgIHNhdmVQbGF5ZXJJZCh0aGlzLmNvbm5lY3Rpb24sIHBsYXllcklkKTtcbiAgfVxuICByZXR1cm4gUGxheWVycy5maW5kKHNlbGVjdG9yKTtcbn0pO1xuXG5jb25zdCBjbGllbnRzID0ge307XG5sZXQgaGFzUGxheWVycyA9IGZhbHNlO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGxldCBpbml0aWFsaXppbmcgPSB0cnVlO1xuICBoYXNQbGF5ZXJzID0gUGxheWVycy5maW5kKCkuY291bnQoKSA+IDA7XG4gIC8vIGBvYnNlcnZlQ2hhbmdlc2Agb25seSByZXR1cm5zIGFmdGVyIHRoZSBpbml0aWFsIGBhZGRlZGAgY2FsbGJhY2tzIGhhdmUgcnVuLlxuICAvLyBVbnRpbCB0aGVuLCB3ZSBkb24ndCB3YW50IHRvIHNlbmQgYSBsb3Qgb2YgYGNoYW5nZWRgIG1lc3NhZ2Vz4oCUaGVuY2VcbiAgLy8gdHJhY2tpbmcgdGhlIGBpbml0aWFsaXppbmdgIHN0YXRlLlxuICBjb25zdCBoYW5kbGUgPSBQbGF5ZXJzLmZpbmQoe30sIHsgZmllbGRzOiB7IF9pZDogMSB9IH0pLm9ic2VydmVDaGFuZ2VzKHtcbiAgICBhZGRlZDogaWQgPT4ge1xuICAgICAgaWYgKGluaXRpYWxpemluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoUGxheWVycy5maW5kKCkuY291bnQoKSA+IDAgJiYgIWhhc1BsYXllcnMpIHtcbiAgICAgICAgaGFzUGxheWVycyA9IHRydWU7XG4gICAgICAgIGZvciAoY29uc3QgaWQgaW4gY2xpZW50cykge1xuICAgICAgICAgIGlmIChjbGllbnRzLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgY29uc3QgY2xpZW50ID0gY2xpZW50c1tpZF07XG4gICAgICAgICAgICBjbGllbnQuY2hhbmdlZChcImhhc1BsYXllcnNcIiwgXCJpZFwiLCB7IGhhc1BsYXllcnMgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlbW92ZWQ6IGlkID0+IHtcbiAgICAgIGlmIChQbGF5ZXJzLmZpbmQoKS5jb3VudCgpID09PSAwICYmIGhhc1BsYXllcnMpIHtcbiAgICAgICAgaGFzUGxheWVycyA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGlkIGluIGNsaWVudHMpIHtcbiAgICAgICAgICBpZiAoY2xpZW50cy5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IGNsaWVudHNbaWRdO1xuICAgICAgICAgICAgY2xpZW50LmNoYW5nZWQoXCJoYXNQbGF5ZXJzXCIsIFwiaWRcIiwgeyBoYXNQbGF5ZXJzIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaW5pdGlhbGl6aW5nID0gZmFsc2U7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2gobnVsbCwgZnVuY3Rpb24oKSB7XG4gIGNsaWVudHNbdGhpcy5jb25uZWN0aW9uLmlkXSA9IHRoaXM7XG4gIHRoaXMuYWRkZWQoXCJoYXNQbGF5ZXJzXCIsIFwiaWRcIiwgeyBoYXNQbGF5ZXJzIH0pO1xuICB0aGlzLnJlYWR5KCk7XG4gIHRoaXMub25TdG9wKCgpID0+IGRlbGV0ZSBjbGllbnRzW3RoaXMuY29ubmVjdGlvbi5pZF0pO1xufSk7XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgUm91bmRzIH0gZnJvbSBcIi4vcm91bmRzLmpzXCI7XG5pbXBvcnQgc2hhcmVkIGZyb20gXCIuLi8uLi9zaGFyZWQuanNcIjtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZVJvdW5kRGF0YSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlJvdW5kcy5tZXRob2RzLnVwZGF0ZURhdGFcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgcm91bmRJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICAgIH0sXG4gICAga2V5OiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIGFwcGVuZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICBub0NhbGxiYWNrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHJvdW5kSWQsIGtleSwgdmFsdWUsIGFwcGVuZCwgbm9DYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgcm91bmQgPSBSb3VuZHMuZmluZE9uZShyb3VuZElkKTtcbiAgICBpZiAoIXJvdW5kKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJyb3VuZCBub3QgZm91bmRcIik7XG4gICAgfVxuICAgIC8vIFRPRE8gY2hlY2sgY2FuIHVwZGF0ZSB0aGlzIHJlY29yZCByb3VuZFxuXG4gICAgY29uc3QgdmFsID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgbGV0IHVwZGF0ZSA9IHsgW2BkYXRhLiR7a2V5fWBdOiB2YWwgfTtcbiAgICBjb25zdCBtb2RpZmllciA9IGFwcGVuZCA/IHsgJHB1c2g6IHVwZGF0ZSB9IDogeyAkc2V0OiB1cGRhdGUgfTtcblxuICAgIFJvdW5kcy51cGRhdGUocm91bmRJZCwgbW9kaWZpZXIsIHtcbiAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmICFub0NhbGxiYWNrKSB7XG4gICAgICBzaGFyZWQuY2FsbE9uQ2hhbmdlKHtcbiAgICAgICAgY29ubjogdGhpcy5jb25uZWN0aW9uLFxuICAgICAgICByb3VuZElkLFxuICAgICAgICByb3VuZCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdmFsLFxuICAgICAgICBwcmV2VmFsdWU6IHJvdW5kLmRhdGEgJiYgcm91bmQuZGF0YVtrZXldLFxuICAgICAgICBhcHBlbmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHtcbiAgQmVsb25nc1RvLFxuICBIYXNNYW55QnlSZWYsXG4gIFVzZXJEYXRhU2NoZW1hLFxuICBUaW1lc3RhbXBTY2hlbWFcbn0gZnJvbSBcIi4uL2RlZmF1bHQtc2NoZW1hc1wiO1xuXG5leHBvcnQgY29uc3QgUm91bmRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJyb3VuZHNcIik7XG5cblJvdW5kcy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgLy8gSW5kZXggcmVwcmVzZW50cyB0aGUgMCBiYXNlZCBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCByb3VuZCBpbiB0aGUgb3JkZXJlZFxuICAvLyBsaXN0IG9mIGEgZ2FtZSdzIHJvdW5kcy4gRm9yIGRpc3BsYXksIGFkZCAxLlxuICBpbmRleDoge1xuICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgIG1pbjogMCxcbiAgICBtYXg6IDk5OTkgLy8gVGhhdCdzIGEgbG90IG9mIHJvdW5kcy4uLlxuICB9XG59KTtcblxuUm91bmRzLnNjaGVtYS5leHRlbmQoVGltZXN0YW1wU2NoZW1hKTtcblJvdW5kcy5zY2hlbWEuZXh0ZW5kKFVzZXJEYXRhU2NoZW1hKTtcblJvdW5kcy5zY2hlbWEuZXh0ZW5kKEhhc01hbnlCeVJlZihcIlN0YWdlc1wiKSk7XG5Sb3VuZHMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJHYW1lc1wiKSk7XG5Sb3VuZHMuc2NoZW1hLmV4dGVuZChIYXNNYW55QnlSZWYoXCJQbGF5ZXJSb3VuZHNcIikpO1xuUm91bmRzLmF0dGFjaFNjaGVtYShSb3VuZHMuc2NoZW1hKTtcbiIsImltcG9ydCBzaGFyZWQgZnJvbSBcIi4uLy4uL3NoYXJlZC5qc1wiO1xuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi4vZ2FtZXMvZ2FtZXMuanNcIjtcbmltcG9ydCB7IFBsYXllcnMgfSBmcm9tIFwiLi4vcGxheWVycy9wbGF5ZXJzLmpzXCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vcm91bmRzL3JvdW5kcy5qc1wiO1xuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4uL3N0YWdlcy9zdGFnZXMuanNcIjtcbmltcG9ydCB7IFRyZWF0bWVudHMgfSBmcm9tIFwiLi4vdHJlYXRtZW50cy90cmVhdG1lbnRzLmpzXCI7XG5pbXBvcnQge1xuICBhdWdtZW50R2FtZVN0YWdlUm91bmQsXG4gIGF1Z21lbnRQbGF5ZXJTdGFnZVJvdW5kXG59IGZyb20gXCIuLi9wbGF5ZXItc3RhZ2VzL2F1Z21lbnQuanNcIjtcbmltcG9ydCB7IGF1Z21lbnRHYW1lT2JqZWN0IH0gZnJvbSBcIi4uL2dhbWVzL2F1Z21lbnQuanNcIjtcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gXCIuLi8uLi9zZXJ2ZXJcIjtcblxuY29uc3QgdGFyZ2V0cyA9IHtcbiAgcGxheWVyU3RhZ2VJZDogXCJwbGF5ZXJTdGFnZVwiLFxuICBwbGF5ZXJSb3VuZElkOiBcInBsYXllclJvdW5kXCIsXG4gIHN0YWdlSWQ6IFwic3RhZ2VcIixcbiAgcm91bmRJZDogXCJyb3VuZFwiLFxuICBnYW1lSWQ6IFwiZ2FtZVwiXG59O1xuXG4vLyBDZW50cmFsIHBvaW50IGZvciB0cmlnZ2VyaW5nIHRoZSBvblNldCwgb25BcHBlbmQgYW5kIG9uQ2hhbmdlIGNhbGxiYWNrcy5cbi8vIFRoZXNlIGNhbGxiYWNrcyBhcmUgY2FsbGVkIHdoZW4gdGhlIGV4cGVyaW1lbnQgY29kZSBjYWxscyBjdXN0b20gZGF0YSB1cGRhdGVcbi8vIG1ldGhvZHMgb24gZ2FtZXMsIHJvdW5kcywgc3RhZ2VzLCBwbGF5ZXJzLCBwbGF5ZXJSb3VuZHMgb3IgcGxheWVyU3RhZ2VzLlxuLy8gb25TZXQgaXMgY2FsbGVkIHdoZW4gdGhlIC5zZXQoKSBtZXRob2QgaXMgdXNlZC5cbi8vIG9uQXBwZW5kIGlzIGNhbGxlZCB3aGVuIHRoZSAuYXBwZW5kKCkgbWV0aG9kIGlzIHVzZWQuXG4vLyBvbkNoYW5nZSBpcyBjYWxsZWQgd2hlbiB0aGUgLnNldCgpIG9yIC5hcHBlbmQoKSBtZXRob2QgaXMgdXNlZC5cbmV4cG9ydCBjb25zdCBjYWxsT25DaGFuZ2UgPSBwYXJhbXMgPT4ge1xuICBjb25zdCBjYk5hbWUgPSBwYXJhbXMuYXBwZW5kID8gXCJvbkFwcGVuZFwiIDogXCJvblNldFwiO1xuICBjb25zdCB7IG9uQ2hhbmdlLCBbY2JOYW1lXTogb25TZXRBcHBlbmQgfSA9IGNvbmZpZztcbiAgY29uc3QgY2FsbGJhY2tzID0gW107XG4gIGlmIChvblNldEFwcGVuZCkge1xuICAgIGNhbGxiYWNrcy5wdXNoKG9uU2V0QXBwZW5kKTtcbiAgfVxuICBpZiAob25DaGFuZ2UpIHtcbiAgICBjYWxsYmFja3MucHVzaChvbkNoYW5nZSk7XG4gIH1cbiAgaWYgKGNhbGxiYWNrcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAocGFyYW1zLmNvbm4gJiYgIXBhcmFtcy5wbGF5ZXJJZCkge1xuICAgIHBhcmFtcy5wbGF5ZXJJZCA9IHNoYXJlZC5wbGF5ZXJJZEZvckNvbm4ocGFyYW1zLmNvbm4pO1xuICB9XG5cbiAgbGV0IHRhcmdldCA9IHBhcmFtcy5wbGF5ZXIsXG4gICAgdGFyZ2V0VHlwZSA9IFwicGxheWVyXCI7XG4gIGZvciAoY29uc3Qga2V5IGluIHRhcmdldHMpIHtcbiAgICBpZiAocGFyYW1zW2tleV0pIHtcbiAgICAgIHRhcmdldFR5cGUgPSB0YXJnZXRzW2tleV07XG4gICAgICB0YXJnZXQgPSBwYXJhbXNbdGFyZ2V0c1trZXldXTtcbiAgICAgIC8vIFVwZGF0ZSBmaWVsZCB0byBsYXRlc3QgdmFsdWVcbiAgICAgIGlmIChwYXJhbXMuYXBwZW5kKSB7XG4gICAgICAgIGlmICghdGFyZ2V0LmRhdGFbcGFyYW1zLmtleV0pIHtcbiAgICAgICAgICB0YXJnZXQuZGF0YVtwYXJhbXMua2V5XSA9IFtwYXJhbXMudmFsdWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5kYXRhW3BhcmFtcy5rZXldID0gdGFyZ2V0LmRhdGFbcGFyYW1zLmtleV0uc2xpY2UoMCk7XG4gICAgICAgICAgdGFyZ2V0LmRhdGFbcGFyYW1zLmtleV0ucHVzaChwYXJhbXMudmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQuZGF0YVtwYXJhbXMua2V5XSA9IHBhcmFtcy52YWx1ZTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGxldCB7IHBsYXllciwgZ2FtZSwgcm91bmQsIHN0YWdlIH0gPSBwYXJhbXM7XG5cbiAgcGxheWVyID0gcGxheWVyIHx8IFBsYXllcnMuZmluZE9uZShwYXJhbXMucGxheWVySWQpO1xuICBnYW1lID0gZ2FtZSB8fCBHYW1lcy5maW5kT25lKHBsYXllci5nYW1lSWQpO1xuICBpZiAoIWdhbWUpIHtcbiAgICBjb25zb2xlLmVycm9yKGAke3RhcmdldFR5cGV9IGRhdGEgdXBkYXRlZCB3aXRob3V0IGdhbWVgKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3RhZ2UgPSBzdGFnZSB8fCBTdGFnZXMuZmluZE9uZShnYW1lLmN1cnJlbnRTdGFnZUlkKTtcbiAgaWYgKCFzdGFnZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoYCR7dGFyZ2V0VHlwZX0gZGF0YSB1cGRhdGVkIHdpdGhvdXQgc3RhZ2VgKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB7IHJvdW5kSWQgfSA9IHN0YWdlO1xuICByb3VuZCA9IHJvdW5kIHx8IFJvdW5kcy5maW5kT25lKHJvdW5kSWQpO1xuICBjb25zdCB0cmVhdG1lbnQgPSBUcmVhdG1lbnRzLmZpbmRPbmUoZ2FtZS50cmVhdG1lbnRJZCk7XG5cbiAgYXVnbWVudEdhbWVPYmplY3QoeyBnYW1lLCB0cmVhdG1lbnQsIHJvdW5kLCBzdGFnZSB9KTtcblxuICBhdWdtZW50R2FtZVN0YWdlUm91bmQoZ2FtZSwgc3RhZ2UsIHJvdW5kKTtcblxuICBjYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiB7XG4gICAgY2FsbGJhY2soXG4gICAgICBnYW1lLFxuICAgICAgcm91bmQsXG4gICAgICBzdGFnZSxcbiAgICAgIHBsYXllcixcbiAgICAgIHRhcmdldCxcbiAgICAgIHRhcmdldFR5cGUsXG4gICAgICBwYXJhbXMua2V5LFxuICAgICAgcGFyYW1zLnZhbHVlLFxuICAgICAgcGFyYW1zLnByZXZWYWx1ZSxcbiAgICAgIHBhcmFtcy5hcHBlbmQgLy8gZm9yIG9uQ2hhbmdlXG4gICAgKTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHNoYXJlZCBmcm9tIFwiLi4vLi4vc2hhcmVkLmpzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi9nYW1lcy9nYW1lcy5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IFJvdW5kcyB9IGZyb20gXCIuLi9yb3VuZHMvcm91bmRzLmpzXCI7XG5pbXBvcnQgeyBTdGFnZXMgfSBmcm9tIFwiLi4vc3RhZ2VzL3N0YWdlcy5qc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuLi90cmVhdG1lbnRzL3RyZWF0bWVudHMuanNcIjtcbmltcG9ydCB7XG4gIGF1Z21lbnRHYW1lU3RhZ2VSb3VuZCxcbiAgYXVnbWVudFBsYXllclN0YWdlUm91bmRcbn0gZnJvbSBcIi4uL3BsYXllci1zdGFnZXMvYXVnbWVudC5qc1wiO1xuaW1wb3J0IHsgYXVnbWVudEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vZ2FtZXMvYXVnbWVudC5qc1wiO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcIi4uLy4uL3NlcnZlclwiO1xuXG5leHBvcnQgY29uc3QgY2FsbE9uU3VibWl0ID0gcGFyYW1zID0+IHtcbiAgY29uc3QgeyBvblN1Ym1pdCB9ID0gY29uZmlnO1xuICBpZiAoIW9uU3VibWl0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyBwbGF5ZXJJZCwgcGxheWVyU3RhZ2UgfSA9IHBhcmFtcztcblxuICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICBjb25zdCBnYW1lID0gR2FtZXMuZmluZE9uZShwbGF5ZXIuZ2FtZUlkKTtcbiAgaWYgKCFnYW1lKSB7XG4gICAgY29uc29sZS5lcnJvcihgJHt0YXJnZXRUeXBlfSBkYXRhIHVwZGF0ZWQgd2l0aG91dCBnYW1lYCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHN0YWdlID0gU3RhZ2VzLmZpbmRPbmUocGxheWVyU3RhZ2Uuc3RhZ2VJZCk7XG4gIGlmICghc3RhZ2UpIHtcbiAgICBjb25zb2xlLmVycm9yKGAke3RhcmdldFR5cGV9IGRhdGEgdXBkYXRlZCB3aXRob3V0IHN0YWdlYCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgeyByb3VuZElkIH0gPSBzdGFnZTtcbiAgY29uc3Qgcm91bmQgPSBSb3VuZHMuZmluZE9uZShyb3VuZElkKTtcbiAgY29uc3QgdHJlYXRtZW50ID0gVHJlYXRtZW50cy5maW5kT25lKGdhbWUudHJlYXRtZW50SWQpO1xuXG4gIGF1Z21lbnRHYW1lT2JqZWN0KHsgZ2FtZSwgdHJlYXRtZW50LCByb3VuZCwgc3RhZ2UgfSk7XG5cbiAgYXVnbWVudEdhbWVTdGFnZVJvdW5kKGdhbWUsIHN0YWdlLCByb3VuZCk7XG5cbiAgcGxheWVyLnN0YWdlID0gXy5leHRlbmQoe30sIHN0YWdlKTtcbiAgcGxheWVyLnJvdW5kID0gXy5leHRlbmQoe30sIHJvdW5kKTtcbiAgYXVnbWVudFBsYXllclN0YWdlUm91bmQocGxheWVyLCBwbGF5ZXIuc3RhZ2UsIHBsYXllci5yb3VuZCwgZ2FtZSk7XG5cbiAgb25TdWJtaXQoZ2FtZSwgcm91bmQsIHN0YWdlLCBwbGF5ZXIpO1xufTtcbiIsImltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSBcIi4uLy4uL3NlcnZlclwiO1xuaW1wb3J0IHsgR2FtZXMgfSBmcm9tIFwiLi4vZ2FtZXMvZ2FtZXMuanNcIjtcbmltcG9ydCB7XG4gIGF1Z21lbnRHYW1lU3RhZ2VSb3VuZCxcbiAgYXVnbWVudFBsYXllclN0YWdlUm91bmRcbn0gZnJvbSBcIi4uL3BsYXllci1zdGFnZXMvYXVnbWVudC5qc1wiO1xuaW1wb3J0IHsgYXVnbWVudEdhbWVPYmplY3QgfSBmcm9tIFwiLi4vZ2FtZXMvYXVnbWVudC5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi9wbGF5ZXJzL3BsYXllcnMuanNcIjtcbmltcG9ydCB7IFJvdW5kcyB9IGZyb20gXCIuLi9yb3VuZHMvcm91bmRzLmpzXCI7XG5pbXBvcnQgeyBUcmVhdG1lbnRzIH0gZnJvbSBcIi4uL3RyZWF0bWVudHMvdHJlYXRtZW50cy5qc1wiO1xuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4vc3RhZ2VzLmpzXCI7XG5pbXBvcnQgeyBHYW1lTG9iYmllcyB9IGZyb20gXCIuLi9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzXCI7XG5cbi8vIGVuZE9mU3RhZ2Ugc2hvdWxkIG9ubHkgZXZlciBydW4gb25jZSBwZXIgc3RhZ2VJZC4gSWYgb25lIG9mIHRoZSBjYWxsYmFja1xuLy8gKG9yIHRoZSBleGVjdXRpb24gb2YgZW5kT2ZTdGFnZSBpdHNlbGYpIHRha2VzIHRvbyBtdWNoIHRpbWUsIGEgc2Vjb25kXG4vLyB0cmlnZ2VyIGNvdWxkIHRyeSB0byBydW4gZW5kT2ZTdGFnZSBhZ2FpbiAoZS5nLiBhbGwgcGxheWVycyBzdWJtaXR0ZWQgK1xuLy8gY3JvbikuIFRoZSBsb2NrIGVuc3VyZXMgZW5kT2ZTdGFnZSBjYW4gb25seSBydW4gb25jZS5cbmNvbnN0IGxvY2sgPSB7fTtcblxuZXhwb3J0IGNvbnN0IGVuZE9mU3RhZ2UgPSBzdGFnZUlkID0+IHtcbiAgaWYgKGxvY2tbc3RhZ2VJZF0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsb2NrW3N0YWdlSWRdID0gdHJ1ZTtcblxuICBjb25zdCBzdGFnZSA9IFN0YWdlcy5maW5kT25lKHN0YWdlSWQpO1xuICBjb25zdCB7IGluZGV4LCBnYW1lSWQsIHJvdW5kSWQgfSA9IHN0YWdlO1xuICBjb25zdCBnYW1lID0gR2FtZXMuZmluZE9uZShnYW1lSWQpO1xuICBjb25zdCByb3VuZCA9IFJvdW5kcy5maW5kT25lKHJvdW5kSWQpO1xuICBjb25zdCB0cmVhdG1lbnQgPSBUcmVhdG1lbnRzLmZpbmRPbmUoZ2FtZS50cmVhdG1lbnRJZCk7XG5cbiAgYXVnbWVudEdhbWVPYmplY3QoeyBnYW1lLCB0cmVhdG1lbnQsIHJvdW5kLCBzdGFnZSB9KTtcblxuICBhdWdtZW50R2FtZVN0YWdlUm91bmQoZ2FtZSwgc3RhZ2UsIHJvdW5kKTtcblxuICBjb25zdCB7IG9uU3RhZ2VFbmQsIG9uUm91bmRFbmQsIG9uUm91bmRTdGFydCwgb25TdGFnZVN0YXJ0IH0gPSBjb25maWc7XG4gIGlmIChvblN0YWdlRW5kKSB7XG4gICAgb25TdGFnZUVuZChnYW1lLCByb3VuZCwgc3RhZ2UpO1xuICB9XG5cbiAgY29uc3QgbmV4dFN0YWdlID0gU3RhZ2VzLmZpbmRPbmUoeyBnYW1lSWQsIGluZGV4OiBpbmRleCArIDEgfSk7XG5cbiAgaWYgKChvblJvdW5kRW5kICYmICFuZXh0U3RhZ2UpIHx8IHN0YWdlLnJvdW5kSWQgIT09IG5leHRTdGFnZS5yb3VuZElkKSB7XG4gICAgb25Sb3VuZEVuZChnYW1lLCByb3VuZCk7XG4gIH1cblxuICBpZiAobmV4dFN0YWdlICYmIChvblJvdW5kU3RhcnQgfHwgb25TdGFnZVN0YXJ0KSkge1xuICAgIGNvbnN0IG5leHRSb3VuZCA9IFJvdW5kcy5maW5kT25lKG5leHRTdGFnZS5yb3VuZElkKTtcbiAgICBhdWdtZW50R2FtZVN0YWdlUm91bmQoZ2FtZSwgbmV4dFN0YWdlLCBuZXh0Um91bmQpO1xuICAgIGdhbWUucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICBwbGF5ZXIucm91bmQgPSBfLmV4dGVuZCh7fSwgbmV4dFJvdW5kKTtcbiAgICAgIHBsYXllci5zdGFnZSA9IF8uZXh0ZW5kKHt9LCBuZXh0U3RhZ2UpO1xuICAgICAgYXVnbWVudFBsYXllclN0YWdlUm91bmQocGxheWVyLCBwbGF5ZXIuc3RhZ2UsIHBsYXllci5yb3VuZCwgZ2FtZSk7XG4gICAgfSk7XG5cbiAgICBpZiAob25Sb3VuZFN0YXJ0ICYmIHN0YWdlLnJvdW5kSWQgIT09IG5leHRTdGFnZS5yb3VuZElkKSB7XG4gICAgICBvblJvdW5kU3RhcnQoZ2FtZSwgbmV4dFJvdW5kKTtcbiAgICB9XG5cbiAgICBpZiAob25TdGFnZVN0YXJ0KSB7XG4gICAgICBvblN0YWdlU3RhcnQoZ2FtZSwgbmV4dFJvdW5kLCBuZXh0U3RhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChuZXh0U3RhZ2UpIHtcbiAgICAvLyBnbyB0byBuZXh0IHN0YWdlXG4gICAgY29uc3QgY3VycmVudFN0YWdlSWQgPSBuZXh0U3RhZ2UuX2lkO1xuICAgIEdhbWVzLnVwZGF0ZShnYW1lSWQsIHtcbiAgICAgICRzZXQ6IHsgY3VycmVudFN0YWdlSWQgfVxuICAgIH0pO1xuICAgIGNvbnN0IHN0YXJ0VGltZUF0ID0gbW9tZW50KCkuYWRkKFN0YWdlcy5zdGFnZVBhZGRpbmdEdXJhdGlvbik7XG4gICAgU3RhZ2VzLnVwZGF0ZShjdXJyZW50U3RhZ2VJZCwge1xuICAgICAgJHNldDoge1xuICAgICAgICBzdGFydFRpbWVBdDogc3RhcnRUaW1lQXQudG9EYXRlKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBvbkdhbWVFbmQgPSBjb25maWcub25HYW1lRW5kO1xuICAgIGlmIChvbkdhbWVFbmQpIHtcbiAgICAgIG9uR2FtZUVuZChnYW1lKTtcbiAgICB9XG4gICAgUGxheWVycy51cGRhdGUoXG4gICAgICB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogXy5wbHVjayhnYW1lLnBsYXllcnMsIFwiX2lkXCIpLFxuICAgICAgICAgICRleGlzdHM6IHsgZXhpdFN0YXR1czogZmFsc2UgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAkc2V0OiB7IGV4aXRTdGF0dXM6IFwiZmluaXNoZWRcIiwgZXhpdEF0OiBuZXcgRGF0ZSgpIH1cbiAgICAgIH0sXG4gICAgICB7IG11bHRpOiB0cnVlIH1cbiAgICApO1xuICAgIEdhbWVzLnVwZGF0ZShnYW1lSWQsIHtcbiAgICAgICRzZXQ6IHsgZmluaXNoZWRBdDogbmV3IERhdGUoKSwgc3RhdHVzOiBcImZpbmlzaGVkXCIgfVxuICAgIH0pO1xuICAgIEdhbWVMb2JiaWVzLnVwZGF0ZShcbiAgICAgIHsgZ2FtZUlkIH0sXG4gICAgICB7XG4gICAgICAgICRzZXQ6IHsgc3RhdHVzOiBcImZpbmlzaGVkXCIgfVxuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBkZWxldGUgbG9ja1tzdGFnZUlkXTtcbn07XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgU3RhZ2VzIH0gZnJvbSBcIi4vc3RhZ2VzLmpzXCI7XG5pbXBvcnQgc2hhcmVkIGZyb20gXCIuLi8uLi9zaGFyZWQuanNcIjtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZVN0YWdlRGF0YSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlN0YWdlcy5tZXRob2RzLnVwZGF0ZURhdGFcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3RhZ2VJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICAgIH0sXG4gICAga2V5OiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIHZhbHVlOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9LFxuICAgIGFwcGVuZDoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICBub0NhbGxiYWNrOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih7IHN0YWdlSWQsIGtleSwgdmFsdWUsIGFwcGVuZCwgbm9DYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgc3RhZ2UgPSBTdGFnZXMuZmluZE9uZShzdGFnZUlkKTtcbiAgICBpZiAoIXN0YWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdGFnZSBub3QgZm91bmRcIik7XG4gICAgfVxuICAgIC8vIFRPRE8gY2hlY2sgY2FuIHVwZGF0ZSB0aGlzIHJlY29yZCBzdGFnZVxuXG4gICAgY29uc3QgdmFsID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgbGV0IHVwZGF0ZSA9IHsgW2BkYXRhLiR7a2V5fWBdOiB2YWwgfTtcbiAgICBjb25zdCBtb2RpZmllciA9IGFwcGVuZCA/IHsgJHB1c2g6IHVwZGF0ZSB9IDogeyAkc2V0OiB1cGRhdGUgfTtcblxuICAgIFN0YWdlcy51cGRhdGUoc3RhZ2VJZCwgbW9kaWZpZXIsIHtcbiAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZSxcbiAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICB2YWxpZGF0ZTogZmFsc2UsXG4gICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmICFub0NhbGxiYWNrKSB7XG4gICAgICBzaGFyZWQuY2FsbE9uQ2hhbmdlKHtcbiAgICAgICAgY29ubjogdGhpcy5jb25uZWN0aW9uLFxuICAgICAgICBzdGFnZUlkLFxuICAgICAgICBzdGFnZSxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdmFsLFxuICAgICAgICBwcmV2VmFsdWU6IHN0YWdlLmRhdGEgJiYgc3RhZ2UuZGF0YVtrZXldLFxuICAgICAgICBhcHBlbmRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuXG5pbXBvcnQge1xuICBCZWxvbmdzVG8sXG4gIFRpbWVzdGFtcFNjaGVtYSxcbiAgVXNlckRhdGFTY2hlbWEsXG4gIEhhc01hbnlCeVJlZlxufSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi9nYW1lcy9nYW1lc1wiO1xuaW1wb3J0IHsgUGxheWVyU3RhZ2VzIH0gZnJvbSBcIi4uL3BsYXllci1zdGFnZXMvcGxheWVyLXN0YWdlc1wiO1xuaW1wb3J0IHsgUm91bmRzIH0gZnJvbSBcIi4uL3JvdW5kcy9yb3VuZHNcIjtcblxuZXhwb3J0IGNvbnN0IFN0YWdlcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKFwic3RhZ2VzXCIpO1xuXG5TdGFnZXMuaGVscGVycyh7XG4gIHJvdW5kKCkge1xuICAgIHJldHVybiBSb3VuZHMuZmluZE9uZSh0aGlzLnJvdW5kSWQpO1xuICB9XG59KTtcblxuU3RhZ2VzLnN0YWdlUGFkZGluZ0R1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKDAuMjUsIFwic2Vjb25kc1wiKTtcblxuU3RhZ2VzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAvLyBJbmRleCByZXByZXNlbnRzIHRoZSAwIGJhc2VkIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IHN0YWdlIGluIHRoZSBvcmRlcmVkXG4gIC8vIGxpc3Qgb2YgYSBhbGwgdGhlIGdhbWUncyBzdGFnZXMuIEZvciBkaXNwbGF5LCBhZGQgMS5cbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBtaW46IDAsXG4gICAgbWF4OiA5OTk5OTkgLy8gVGhhdCdzIGEgbG90IG9mIHN0YWdlcy4uLlxuICB9LFxuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG1heDogNjRcbiAgfSxcbiAgZGlzcGxheU5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgbWF4OiAxMjhcbiAgICAvLyBUT0RPIEFkZCBhdXRvIHZhbHVlIHRvIGJ5IGRlZmF1bHQgY29weSB0aGUgbmFtZSBpbnRvIHRoZSBkaXNwbGF5TmFtZT9cbiAgfSxcbiAgLy8gVGhpcyB3aWxsIHN5bmNocm9uaXplIHRoZSBjbGllbnRzIHRpbWVyIHN0YXJ0IHRpbWUgYW5kIHJlY29yZCBzdGFydCB0aW1lXG4gIC8vIGZvciB0aGUgcmVjb3JkXG4gIHN0YXJ0VGltZUF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBkdXJhdGlvbkluU2Vjb25kczoge1xuICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgIC8vIE9uZSBkYXksIHRoYXQncyBhIGxvdCwgYnV0IGNvdWxkIGJlIFwid2VpcmRcIiBleHBlcmltZW50LCB5ZXQgbm8gZ29pbmcgbnV0c1xuICAgIC8vIGludG8gaHVuZHJlZHMgb2YgeWVhcnMgZm9yIGV4YW1wbGUuXG4gICAgbWF4OiAyNCAqIDYwICogNjAsXG4gICAgLy8gSXQgd291bGQgYmUgZGlmZmljdWx0IHRvIG1hbmFnZSBhIHRpbWVyIHRoYXQgaXMgbGVzcyB0aGFuIDVzIGdpdmVuIGFsbFxuICAgIC8vIHRoZSBtdWx0aS1wZWVyIHN5bmNocm9uaXphdGlvbiBnb2luZyBvbi5cbiAgICBtaW46IDVcbiAgfVxufSk7XG5cblN0YWdlcy5zY2hlbWEuZXh0ZW5kKFRpbWVzdGFtcFNjaGVtYSk7XG5TdGFnZXMuc2NoZW1hLmV4dGVuZChVc2VyRGF0YVNjaGVtYSk7XG5TdGFnZXMuc2NoZW1hLmV4dGVuZChCZWxvbmdzVG8oXCJSb3VuZHNcIikpO1xuU3RhZ2VzLnNjaGVtYS5leHRlbmQoQmVsb25nc1RvKFwiR2FtZXNcIikpO1xuU3RhZ2VzLnNjaGVtYS5leHRlbmQoSGFzTWFueUJ5UmVmKFwiUGxheWVyU3RhZ2VzXCIpKTtcblN0YWdlcy5hdHRhY2hTY2hlbWEoU3RhZ2VzLnNjaGVtYSk7XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tIFwibWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kXCI7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgSWRTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzLmpzXCI7XG5pbXBvcnQgeyBGYWN0b3JUeXBlcyB9IGZyb20gXCIuLi9mYWN0b3ItdHlwZXMvZmFjdG9yLXR5cGVzLmpzXCI7XG5pbXBvcnQgeyBGYWN0b3JzIH0gZnJvbSBcIi4uL2ZhY3RvcnMvZmFjdG9ycy5qc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuL3RyZWF0bWVudHNcIjtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZVRyZWF0bWVudCA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiBcIlRyZWF0bWVudHMubWV0aG9kcy5jcmVhdGVcIixcblxuICB2YWxpZGF0ZTogbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgbmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgbWF4OiAyNTYsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgZmFjdG9ySWRzOiB7XG4gICAgICB0eXBlOiBBcnJheSxcbiAgICAgIGxhYmVsOiBcIkZhY3RvcnNcIlxuICAgIH0sXG4gICAgXCJmYWN0b3JJZHMuJFwiOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgICB9XG4gIH0pLnZhbGlkYXRvcigpLFxuXG4gIHJ1bih0cmVhdG1lbnQpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmF1dGhvcml6ZWRcIik7XG4gICAgfVxuXG4gICAgLy8gVmFsaWRhdGUgdGhlIHJlcXVpcmVkIGZhY3RvciB0eXBlc1xuICAgIGNvbnN0IHJlcXVpcmVkRmFjdG9yVHlwZXMgPSBGYWN0b3JUeXBlcy5maW5kKHtcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgYXJjaGl2ZWRBdDogeyAkZXhpc3RzOiBmYWxzZSB9XG4gICAgfSkuZmV0Y2goKTtcblxuICAgIGlmIChyZXF1aXJlZEZhY3RvclR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNyZWF0ZWRGYWN0b3JzID0gRmFjdG9ycy5maW5kKHtcbiAgICAgICAgX2lkOiB7ICRpbjogdHJlYXRtZW50LmZhY3RvcklkcyB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgY29uc3QgY3JlYXRlZEZhY3RvclR5cGVzID0gRmFjdG9yVHlwZXMuZmluZCh7XG4gICAgICAgICRhbmQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgJGluOiBjcmVhdGVkRmFjdG9ycy5tYXAoZiA9PiBmLmZhY3RvclR5cGVJZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgcmVxdWlyZWQ6IHRydWUgfVxuICAgICAgICBdXG4gICAgICB9KS5mZXRjaCgpO1xuXG4gICAgICBpZiAocmVxdWlyZWRGYWN0b3JUeXBlcy5sZW5ndGggIT09IGNyZWF0ZWRGYWN0b3JUeXBlcy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmlsbCBhbGwgcmVxdWlyZWQgZmFjdG9ycyFcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgVHJlYXRtZW50cy5pbnNlcnQodHJlYXRtZW50KTtcbiAgfVxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVUcmVhdG1lbnQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogXCJUcmVhdG1lbnRzLm1ldGhvZHMudXBkYXRlXCIsXG5cbiAgdmFsaWRhdGU6IFRyZWF0bWVudHMuc2NoZW1hXG4gICAgLnBpY2soXCJuYW1lXCIpXG4gICAgLmV4dGVuZChcbiAgICAgIG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgICAgICBhcmNoaXZlZDoge1xuICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApXG4gICAgLmV4dGVuZChJZFNjaGVtYSlcbiAgICAudmFsaWRhdG9yKCksXG5cbiAgcnVuKHsgX2lkLCBuYW1lLCBhcmNoaXZlZCB9KSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5hdXRob3JpemVkXCIpO1xuICAgIH1cbiAgICBjb25zdCB0cmVhdG1lbnQgPSBUcmVhdG1lbnRzLmZpbmRPbmUoX2lkKTtcbiAgICBpZiAoIXRyZWF0bWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGNvbnN0ICRzZXQgPSB7fSxcbiAgICAgICR1bnNldCA9IHt9O1xuICAgIGlmIChuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICRzZXQubmFtZSA9IG5hbWU7XG4gICAgfVxuICAgIGlmIChhcmNoaXZlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKHRyZWF0bWVudC5hcmNoaXZlZEF0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm90IGZvdW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNldC5hcmNoaXZlZEF0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgJHNldC5hcmNoaXZlZEJ5SWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgIH1cbiAgICAgIGlmICghYXJjaGl2ZWQpIHtcbiAgICAgICAgaWYgKCF0cmVhdG1lbnQuYXJjaGl2ZWRBdCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm5vdCBmb3VuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgICR1bnNldC5hcmNoaXZlZEF0ID0gdHJ1ZTtcbiAgICAgICAgJHVuc2V0LmFyY2hpdmVkQnlJZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgbW9kaWZpZXIgPSB7fTtcbiAgICBpZiAoT2JqZWN0LmtleXMoJHNldCkubGVuZ3RoID4gMCkge1xuICAgICAgbW9kaWZpZXIuJHNldCA9ICRzZXQ7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cygkdW5zZXQpLmxlbmd0aCA+IDApIHtcbiAgICAgIG1vZGlmaWVyLiR1bnNldCA9ICR1bnNldDtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKG1vZGlmaWVyKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBUcmVhdG1lbnRzLnVwZGF0ZShfaWQsIG1vZGlmaWVyKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcblxuaW1wb3J0IHsgRmFjdG9ycyB9IGZyb20gXCIuLi9mYWN0b3JzL2ZhY3RvcnMuanNcIjtcbmltcG9ydCB7IEZhY3RvclR5cGVzIH0gZnJvbSBcIi4uL2ZhY3Rvci10eXBlcy9mYWN0b3ItdHlwZXMuanNcIjtcbmltcG9ydCB7IFRpbWVzdGFtcFNjaGVtYSwgQXJjaGl2ZWRTY2hlbWEgfSBmcm9tIFwiLi4vZGVmYXVsdC1zY2hlbWFzXCI7XG5cbmV4cG9ydCBjb25zdCBUcmVhdG1lbnRzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJ0cmVhdG1lbnRzXCIpO1xuXG5UcmVhdG1lbnRzLmhlbHBlcnMoe1xuICBkaXNwbGF5TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lIHx8IF8ubWFwKHRoaXMuZmFjdG9ycygpLCBjID0+IGMuZnVsbExhYmVsKCkpLmpvaW4oXCIgLSBcIik7XG4gIH0sXG5cbiAgZmFjdG9yKG5hbWUpIHtcbiAgICBjb25zdCB0eXBlID0gRmFjdG9yVHlwZXMuZmluZE9uZSh7IG5hbWUgfSk7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZhY3RvcnMoKS5maW5kKGMgPT4gYy5mYWN0b3JUeXBlSWQgPT09IHR5cGUuX2lkKTtcbiAgfSxcblxuICBmYWN0b3JzKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0geyBfaWQ6IHsgJGluOiB0aGlzLmZhY3RvcklkcyB9IH07XG4gICAgcmV0dXJuIEZhY3RvcnMuZmluZChxdWVyeSkuZmV0Y2goKTtcbiAgfSxcblxuICBmYWN0b3JzT2JqZWN0KCkge1xuICAgIGNvbnN0IGRvYyA9IHt9O1xuICAgIHRoaXMuZmFjdG9ycygpLmZvckVhY2goYyA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gRmFjdG9yVHlwZXMuZmluZE9uZShjLmZhY3RvclR5cGVJZCk7XG4gICAgICBkb2NbdHlwZS5uYW1lXSA9IGMudmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRvYztcbiAgfVxufSk7XG5cblRyZWF0bWVudHMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8vIE9wdGlvbmFsIGV4cGVyaW1lbnRlciBnaXZlbiBuYW1lIGZvciB0aGUgdHJlYXRtZW50XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgbWF4OiAyNTYsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgY3VzdG9tKCkge1xuICAgICAgaWYgKHRoaXMuaXNTZXQgJiYgVHJlYXRtZW50cy5maW5kKHsgbmFtZTogdGhpcy52YWx1ZSB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4gXCJub3RVbmlxdWVcIjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZWdFeDogL15bYS16QS1aMC05X10rJC9cbiAgfSxcblxuICAvLyBBcnJheSBvZiBmYWN0b3JJZHNcbiAgZmFjdG9ySWRzOiB7XG4gICAgdHlwZTogQXJyYXksXG4gICAgbWluQ291bnQ6IEZhY3RvclR5cGVzLnJlcXVpcmVkVHlwZXMsXG4gICAgbGFiZWw6IFwiRmFjdG9yc1wiLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgICAvLyAvLyBDdXN0b20gdmFsaWRhdGlvbiB2ZXJpZmllcyByZXF1aXJlZCBmYWN0b3JzIGFyZSBwcmVzZW50IGFuZCB0aGF0XG4gICAgLy8gLy8gdGhlcmUgYXJlIG5vIGR1cGxpY2F0ZSBmYWN0b3JzIHdpdGggdGhlIHNhbWUga2V5LiBXZSBjYW5ub3QgZWFzaWx5XG4gICAgLy8gLy8gdmVyaWZ5IG9uZSBvZiBlYWNoIGZhY3RvcnMgaXMgcHJlc2VudC5cbiAgICAvLyBjdXN0b20oKSB7XG4gICAgLy8gICBpZiAoIU1ldGVvci5pc1NlcnZlciB8fCAhdGhpcy5pc0luc2VydCkge1xuICAgIC8vICAgICByZXR1cm47XG4gICAgLy8gICB9XG5cbiAgICAvLyAgIGNvbnN0IGZhY3RvcnMgPSBGYWN0b3JzLmZpbmQoeyBfaWQ6IHsgJGluOiB0aGlzLnZhbHVlIH0gfSkuZmV0Y2goKTtcbiAgICAvLyAgIGNvbnN0IGRvYyA9IHt9O1xuICAgIC8vICAgZmFjdG9ycy5mb3JFYWNoKGMgPT4gKGRvY1tjLnR5cGVdID0gYy52YWx1ZSkpO1xuXG4gICAgLy8gICBjb25zdCBjb250ZXh0ID0gZmFjdG9yc1NjaGVtYS5uZXdDb250ZXh0KCk7XG4gICAgLy8gICBjb250ZXh0LnZhbGlkYXRlKGRvYyk7XG4gICAgLy8gICBpZiAoIWNvbnRleHQuaXNWYWxpZCgpKSB7XG4gICAgLy8gICAgIGNvbnN0IGVycm9yID0ge1xuICAgIC8vICAgICAgIG5hbWU6IFwiZmFjdG9ySWRzXCIsXG4gICAgLy8gICAgICAgdHlwZTogXCJpbnZhbGlkXCIsXG4gICAgLy8gICAgICAgZGV0YWlsczogY29udGV4dC52YWxpZGF0aW9uRXJyb3JzKClcbiAgICAvLyAgICAgfTtcbiAgICAvLyAgICAgdGhpcy5hZGRWYWxpZGF0aW9uRXJyb3JzKFtlcnJvcl0pO1xuICAgIC8vICAgICByZXR1cm4gXCJpbnZhbGlkXCI7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9LFxuXG4gIFwiZmFjdG9ySWRzLiRcIjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICAgIGxhYmVsOiBgRmFjdG9yIEl0ZW1gXG4gIH1cbn0pO1xuXG5UcmVhdG1lbnRzLnNjaGVtYS5hZGREb2NWYWxpZGF0b3IoKHsgZmFjdG9ySWRzIH0pID0+IHtcbiAgaWYgKCF0aGlzLmlzSW5zZXJ0KSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGNvbnN0IHF1ZXJ5ID0ge1xuICAgIGZhY3Rvcklkczoge1xuICAgICAgJHNpemU6IGZhY3Rvcklkcy5sZW5ndGgsXG4gICAgICAkYWxsOiBmYWN0b3JJZHNcbiAgICB9XG4gIH07XG4gIGlmIChCb29sZWFuKFRyZWF0bWVudHMuZmluZE9uZShxdWVyeSkpKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogXCJmYWN0b3JJZHNcIixcbiAgICAgICAgdHlwZTogXCJub3RVbmlxdWVcIlxuICAgICAgfVxuICAgIF07XG4gIH1cbiAgcmV0dXJuIFtdO1xufSk7XG5cblRyZWF0bWVudHMuc2NoZW1hLmV4dGVuZChUaW1lc3RhbXBTY2hlbWEpO1xuVHJlYXRtZW50cy5zY2hlbWEuZXh0ZW5kKEFyY2hpdmVkU2NoZW1hKTtcblRyZWF0bWVudHMuYXR0YWNoU2NoZW1hKFRyZWF0bWVudHMuc2NoZW1hKTtcbiIsImltcG9ydCB7IFRyZWF0bWVudHMgfSBmcm9tIFwiLi4vdHJlYXRtZW50c1wiO1xuaW1wb3J0IHsgRmFjdG9ycyB9IGZyb20gXCIuLi8uLi9mYWN0b3JzL2ZhY3RvcnMuanNcIjtcbmltcG9ydCB7IEZhY3RvclR5cGVzIH0gZnJvbSBcIi4uLy4uL2ZhY3Rvci10eXBlcy9mYWN0b3ItdHlwZXMuanNcIjtcblxuTWV0ZW9yLnB1Ymxpc2goXCJhZG1pbi10cmVhdG1lbnRzXCIsIGZ1bmN0aW9uKHsgYXJjaGl2ZWQgfSkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoYXJjaGl2ZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBUcmVhdG1lbnRzLmZpbmQoKTtcbiAgfVxuXG4gIHJldHVybiBUcmVhdG1lbnRzLmZpbmQoeyBhcmNoaXZlZEF0OiB7ICRleGlzdHM6IEJvb2xlYW4oYXJjaGl2ZWQpIH0gfSk7XG59KTtcblxuTWV0ZW9yLnB1Ymxpc2goXCJ0cmVhdG1lbnRcIiwgZnVuY3Rpb24odHJlYXRtZW50SWQpIHtcbiAgaWYgKCF0cmVhdG1lbnRJZCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHRyZWF0bWVudCA9IFRyZWF0bWVudHMuZmluZE9uZSh0cmVhdG1lbnRJZCk7XG5cbiAgaWYgKCF0cmVhdG1lbnQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gW1xuICAgIFRyZWF0bWVudHMuZmluZCh0cmVhdG1lbnRJZCksXG4gICAgRmFjdG9ycy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHRyZWF0bWVudC5mYWN0b3JJZHNcbiAgICAgIH1cbiAgICB9KSxcbiAgICBGYWN0b3JUeXBlcy5maW5kKClcbiAgXTtcbn0pO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5mdW5jdGlvbiBpc0NsYXNzQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbXBvbmVudCA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgISFjb21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnRcbiAgICA/IHRydWVcbiAgICA6IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICByZXR1cm4gdHlwZW9mIGNvbXBvbmVudCA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgU3RyaW5nKGNvbXBvbmVudCkuaW5jbHVkZXMoXCJyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudFwiKVxuICAgID8gdHJ1ZVxuICAgIDogZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzUmVhY3RDb21wb25lbnQoY29tcG9uZW50KSB7XG4gIHJldHVybiBpc0NsYXNzQ29tcG9uZW50KGNvbXBvbmVudCkgfHwgaXNGdW5jdGlvbkNvbXBvbmVudChjb21wb25lbnQpXG4gICAgPyB0cnVlXG4gICAgOiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIFJlYWN0LmlzVmFsaWRFbGVtZW50KGVsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBpc0RPTVR5cGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSAmJiB0eXBlb2YgZWxlbWVudC50eXBlID09PSBcInN0cmluZ1wiO1xufVxuXG5mdW5jdGlvbiBpc0NvbXBvc2l0ZVR5cGVFbGVtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIGlzRWxlbWVudChlbGVtZW50KSAmJiB0eXBlb2YgZWxlbWVudC50eXBlID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0NsYXNzQ29tcG9uZW50LFxuICBpc0Z1bmN0aW9uQ29tcG9uZW50LFxuICBpc1JlYWN0Q29tcG9uZW50LFxuICBpc0VsZW1lbnQsXG4gIGlzRE9NVHlwZUVsZW1lbnQsXG4gIGlzQ29tcG9zaXRlVHlwZUVsZW1lbnRcbn07XG4iLCIvLyBOYW1lZCBBdG9taWMgY291bnRlcnNcbi8vXG4vLyBFeGFtcGxlOlxuLy8gICAgQ291bnRlci5pbmMoXCJzb21ldGhpbmdcIikgLy8gPT4gMVxuLy8gICAgQ291bnRlci5pbmMoXCJzb21ldGhpbmdcIikgLy8gPT4gMlxuLy8gICAgQ291bnRlci5pbmMoXCJzb21ldGhpbmdcIiwgOCkgLy8gPT4gMTBcbi8vICAgIENvdW50ZXIuaW5jKFwic29tZXRoaW5nXCIsIC01KSAvLyA9PiA1XG4vLyAgICBDb3VudGVyLnNldChcInNvbWV0aGluZ1wiLCA0MikgLy8gPT4gNDJcblxubGV0IGluY3NldDtcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY29uc3QgcmF3ID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oXCJjb3VudGVyc1wiKS5yYXdDb2xsZWN0aW9uKCk7XG4gIGZpbmRBbmRNb2RpZnkgPSBNZXRlb3Iud3JhcEFzeW5jKHJhdy5maW5kQW5kTW9kaWZ5LCByYXcpO1xuXG4gIGluY3NldCA9IG9wID0+IChuYW1lLCBhbW91bnQgPSAxKSA9PiB7XG4gICAgY29uc3QgcmVzID0gZmluZEFuZE1vZGlmeShcbiAgICAgIHsgX2lkOiBuYW1lIH0sIC8vIHF1ZXJ5XG4gICAgICBudWxsLCAvLyBzb3J0XG4gICAgICB7IFtgJCR7b3B9YF06IHsgdmFsdWU6IGFtb3VudCB9IH0sIC8vIHVwZGF0ZVxuICAgICAgeyBuZXc6IHRydWUsIHVwc2VydDogdHJ1ZSB9IC8vIG9wdGlvbnNcbiAgICApO1xuICAgIHJldHVybiByZXMudmFsdWUgJiYgcmVzLnZhbHVlLnZhbHVlO1xuICB9O1xufSBlbHNlIHtcbiAgaW5jc2V0ID0gb3AgPT4gKCkgPT4ge307XG59XG5cbmV4cG9ydCBjb25zdCBDb3VudGVyID0ge1xuICBpbmM6IGluY3NldChcImluY1wiKSxcbiAgc2V0OiBpbmNzZXQoXCJzZXRcIilcbn07XG4iLCIvLyBTZWUgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvbG9nbGV2ZWwgZm9yIGxvZ2dpbmcgZG9jc1xuaW1wb3J0ICogYXMgbG9nZ2luZyBmcm9tIFwibG9nbGV2ZWxcIjtcblxuY29uc3QgbG9nID0gbG9nZ2luZy5nZXRMb2dnZXIoXCJtYWluXCIpO1xuXG4vLyBGYWxsYmFjayBsZXZlbCBpZiBub25lIGlzIHNldCBpbiBjb25maWcgZmlsZVxubG9nLnNldERlZmF1bHRMZXZlbChNZXRlb3IuaXNEZXZlbG9wbWVudCA/IFwiaW5mb1wiIDogXCJ3YXJuXCIpO1xuXG4vLyBMb2cgbGV2ZWwgaXMgc2V0IGluIFwicHVibGljXCIgc28gaXQncyBhY2Nlc3NpYmxlIG9uIHRoZSBjbGllbnRcbi8vIFZhbGlkIGxvZyBsZXZlbCBzdHJpbmdzIGFyZTogdHJhY2UsIGRlYnVnLCBpbmZvLCB3YXJuLCBlcnJvciBvciBzaWxlbnQuXG5pZiAoTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5sb2dsZXZlbCkge1xuICBsb2cuc2V0TGV2ZWwoTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5sb2dsZXZlbCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxvZztcbiIsImltcG9ydCB7XG4gIGlzQ2xhc3NDb21wb25lbnQsXG4gIGlzRnVuY3Rpb25Db21wb25lbnQsXG4gIGlzUmVhY3RDb21wb25lbnQsXG4gIGlzRWxlbWVudFxufSBmcm9tIFwiLi9jb21wb25lbnRDaGVja2VyXCI7XG5cbmV4cG9ydCBjb25zdCBzbGVlcCA9IG1zID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIF8pIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9LCBtcyk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHdlaWdodGVkUmFuZG9tID0gdmFsdWVzID0+IHtcbiAgY29uc3Qgc2FtcGxlcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKFxuICAgICAgIXZhbHVlc1tpXSB8fFxuICAgICAgIXZhbHVlc1tpXS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlXCIpIHx8XG4gICAgICAhdmFsdWVzW2ldLmhhc093blByb3BlcnR5KFwid2VpZ2h0XCIpXG4gICAgKSB7XG4gICAgICB0aHJvdyBcImFsbCB2YWx1ZXMgcGFzc2VkIHRvIHdlaWdodGVkUmFuZG9tIG11c3QgaGF2ZSBhIHZhbHVlIGFuZCB3ZWlnaHQgZmllbGRcIjtcbiAgICB9XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZXNbaV0ud2VpZ2h0OyBqICs9IDEpIHtcbiAgICAgIHNhbXBsZXMucHVzaCh2YWx1ZXNbaV0udmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoKSA9PiBzYW1wbGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNhbXBsZXMubGVuZ3RoKV07XG59O1xuXG5leHBvcnQgY29uc3QgaXNSZWFjdENvbXBvbmVudHMgPSBjb21wb25lbnRzID0+IHtcbiAgbGV0IGlzVmFsaWQgPSB0cnVlO1xuXG4gIGlmIChjb21wb25lbnRzICYmIF8uaXNBcnJheShjb21wb25lbnRzKSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKFxuICAgICAgICAhaXNDbGFzc0NvbXBvbmVudChjb21wb25lbnRzW2ldKSAmJlxuICAgICAgICAhaXNGdW5jdGlvbkNvbXBvbmVudChjb21wb25lbnRzW2ldKSAmJlxuICAgICAgICAhaXNSZWFjdENvbXBvbmVudChjb21wb25lbnRzW2ldKSAmJlxuICAgICAgICAhaXNFbGVtZW50KGNvbXBvbmVudHNbaV0pXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNvbXBvbmVudCBpcyBub3QgYSBSZWFjdCBDb21wb25lbnQhXCIsIGNvbXBvbmVudHNbaV0pO1xuICAgICAgICBpc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiY29tcG9uZW50cyBpcyBub3QgVmFsaWQhXCIpO1xuICAgIGlzVmFsaWQgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBpc1ZhbGlkO1xufTtcblxubGV0IFNUUklQX0NPTU1FTlRTID0gLygoXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLykpL2dtO1xubGV0IEFSR1VNRU5UX05BTUVTID0gLyg/Ol58LClcXHMqKFteXFxzLD1dKykvZztcblxuZXhwb3J0IGNvbnN0IGdldEZ1bmN0aW9uUGFyYW1ldGVycyA9IGZ1bmMgPT4ge1xuICBsZXQgZm5TdHIgPSBmdW5jLnRvU3RyaW5nKCkucmVwbGFjZShTVFJJUF9DT01NRU5UUywgXCJcIik7XG4gIGZuU3RyID0gZm5TdHIuc3BsaXQoXCI9PlwiKVswXTtcbiAgY29uc3QgYXJnc0xpc3QgPSBmblN0ci5zbGljZShmblN0ci5pbmRleE9mKFwiKFwiKSArIDEsIGZuU3RyLmluZGV4T2YoXCIpXCIpKTtcbiAgY29uc3QgcmVzdWx0ID0gYXJnc0xpc3QubWF0Y2goQVJHVU1FTlRfTkFNRVMpO1xuXG4gIGlmIChyZXN1bHQgPT09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH0gZWxzZSB7XG4gICAgbGV0IHN0cmlwcGVkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0cmlwcGVkLnB1c2gocmVzdWx0W2ldLnJlcGxhY2UoL1tcXHMsXS9nLCBcIlwiKSk7XG4gICAgfVxuICAgIHJldHVybiBzdHJpcHBlZDtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZUZhY3RvclZhbHVlRXJyb3JNZXNzYWdlID0gZXJyb3IgPT4ge1xuICBzd2l0Y2ggKGVycm9yLnR5cGUpIHtcbiAgICBjYXNlIFwibWF4TnVtYmVyXCI6XG4gICAgY2FzZSBcIm1heFN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGBWYWx1ZSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAgJHtlcnJvci5tYXh9ICR7XG4gICAgICAgIGVycm9yLnR5cGUgPT09IFwibWF4U3RyaW5nXCIgPyBcImNoYXJhY3RlcihzKVwiIDogXCJcIlxuICAgICAgfS5gO1xuXG4gICAgY2FzZSBcIm1pbk51bWJlclwiOlxuICAgIGNhc2UgXCJtaW5TdHJpbmdcIjpcbiAgICAgIHJldHVybiBgVmFsdWUgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gICR7ZXJyb3IubWlufSAke1xuICAgICAgICBlcnJvci50eXBlID09PSBcIm1pblN0cmluZ1wiID8gXCJjaGFyYWN0ZXIocylcIiA6IFwiXCJcbiAgICAgIH0uYDtcblxuICAgIGNhc2UgXCJzY29wZWRVbmlxdWVcIjpcbiAgICAgIHJldHVybiBgJHtlcnJvci5uYW1lfSBtdXN0IGJlIHVuaXF1ZS5gO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBcIlVua25vd24gRXJyb3JcIjtcbiAgfVxufTtcbiIsIi8vIEltcG9ydCBtb2R1bGVzIHVzZWQgYnkgYm90aCBjbGllbnQgYW5kIHNlcnZlciB0aHJvdWdoIGEgc2luZ2xlIGluZGV4IGVudHJ5IHBvaW50XG4vLyBlLmcuIHVzZXJhY2NvdW50cyBjb25maWd1cmF0aW9uIGZpbGUuXG5cbmltcG9ydCBcIi4uLy4uL2FwaS9zY2hlbWEtaGVscGVycy5qc1wiO1xuIiwiQWNjb3VudHMuY29uZmlnKHtcbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsOiBmYWxzZSxcbiAgZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uOiB0cnVlLFxuICBhbWJpZ3VvdXNFcnJvck1lc3NhZ2VzOiB0cnVlXG59KTtcbiIsIi8vIEF1dG9tYXRlZCBhdmF0YXIgZ2VuZXJhdGlvblxuLy8gRm9ybWF0OiAvYXZhdGFycy9baWRlbnRpY29ufGpkZW50aWNvbl0vOnBsYXllcklEXG5cbmltcG9ydCBjcnlwdG8gZnJvbSBcImNyeXB0b1wiO1xuaW1wb3J0IElkZW50aWNvbiBmcm9tIFwiaWRlbnRpY29uLmpzXCI7XG5pbXBvcnQgamRlbnRpY29uIGZyb20gXCJqZGVudGljb25cIjtcblxuV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvYXZhdGFyc1wiLCAocmVxLCByZXMpID0+IHtcbiAgY29uc3QgW3R5cGUsIGlkXSA9IHJlcS51cmwuc2xpY2UoMSkuc3BsaXQoXCIvXCIpO1xuXG4gIGNvbnN0IGhhc2ggPSBjcnlwdG9cbiAgICAuY3JlYXRlSGFzaChcInNoYTFcIilcbiAgICAudXBkYXRlKGlkKVxuICAgIC5kaWdlc3QoXCJoZXhcIik7XG5cbiAgbGV0IHN2ZztcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBcImlkZW50aWNvblwiOlxuICAgICAgc3ZnID0gbmV3IElkZW50aWNvbihoYXNoLCB7IHNpemU6IDIwMCwgZm9ybWF0OiBcInN2Z1wiIH0pLnRvU3RyaW5nKHRydWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImpkZW50aWNvblwiOlxuICAgICAgc3ZnID0gamRlbnRpY29uLnRvU3ZnKGhhc2gsIDIwMCk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgcmVzLndyaXRlSGVhZCg0MDQsIHt9KTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7IFwiQ29udGVudC1UeXBlXCI6IFwiaW1hZ2Uvc3ZnK3htbFwiIH0pO1xuICByZXMuZW5kKHN2Zyk7XG59KTtcbiIsImltcG9ydCBsb2cgZnJvbSBcIi4uLy4uL2xpYi9sb2cuanNcIjtcblxuY29uc3QgYWRtaW5zID0gW107XG5cbmNvbnN0IHNldHRpbmdzQWRtaW5zID0gTWV0ZW9yLnNldHRpbmdzLmFkbWlucztcbmlmIChzZXR0aW5nc0FkbWlucykge1xuICBpZiAoIV8uaXNBcnJheShzZXR0aW5nc0FkbWlucykpIHtcbiAgICBsb2cuZXJyb3IoXCJzZXR0aW5nczogYGFkbWluc2AgZmllbGQgaXMgbm90IGFuIGFycmF5XCIpO1xuICB9IGVsc2Uge1xuICAgIHNldHRpbmdzQWRtaW5zLmZvckVhY2goKHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pID0+IHtcbiAgICAgIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgIGxvZy5lcnJvcihcInNldHRpbmdzOiBgYWRtaW5zYCByZXF1aXJlIGB1c2VybmFtZWAgYW5kIGBwYXNzd29yZGBcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZG1pbnMucHVzaCh7IHVzZXJuYW1lLCBwYXNzd29yZCB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5pZiAoYWRtaW5zLmxlbmd0aCA9PT0gMCkge1xuICBjb25zdCB0ZW1wUGFzc3dvcmQgPVxuICAgIE1hdGgucmFuZG9tKClcbiAgICAgIC50b1N0cmluZygzNilcbiAgICAgIC5zbGljZSgyKSArXG4gICAgTWF0aC5yYW5kb20oKVxuICAgICAgLnRvU3RyaW5nKDM2KVxuICAgICAgLnNsaWNlKDIpO1xuXG4gIGFkbWlucy5wdXNoKHtcbiAgICB1c2VybmFtZTogXCJhZG1pblwiLFxuICAgIHBhc3N3b3JkOiB0ZW1wUGFzc3dvcmRcbiAgfSk7XG5cbiAgbG9nLndhcm4oXG4gICAgYFlvdSBoYXZlIG5vdCBzZXQgYSBjdXN0b20gcGFzc3dvcmQgZm9yIGFkbWluIGxvZ2luLlxuSWYgeW91IGhhdmUgYSBzZXR0aW5ncyBmaWxlIChlLmcuIGxvY2FsLmpzb24pIHdpdGggXCJhZG1pbnNcIiBjb25maWd1cmVkLCB5b3UgY2FuXG5yZXN0YXJ0IHRoZSBhcHAgcGFzc2luZyBpbiB0aGUgc2V0dGluZ3MgYXJnOiBcIm1ldGVvciAtLXNldHRpbmdzIGxvY2FsLmpzb25cIi5cbllvdSBjYW4gdGVtcG9yYXJpbHkgbG9nIGluIHdpdGggKHJlc2V0IG9uIGVhY2ggYXBwIHJlbG9hZCk6XG4gIC0gdXNlcm5hbWU6IGFkbWluXG4gIC0gcGFzc3dvcmQ6ICR7dGVtcFBhc3N3b3JkfVxuYFxuICApO1xufVxuXG5leHBvcnQgY29uc3QgYm9vdHN0cmFwRnVuY3Rpb25zID0gW107XG5leHBvcnQgY29uc3QgYm9vdHN0cmFwID0gKCkgPT4ge1xuICBib290c3RyYXBGdW5jdGlvbnMuZm9yRWFjaChmID0+IGYoKSk7XG4gIGxvZy5kZWJ1ZyhcIkJvb3RzdHJhcHBlZCFcIik7XG59O1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGJvb3RzdHJhcCgpO1xufSk7XG5cbmJvb3RzdHJhcEZ1bmN0aW9ucy5wdXNoKCgpID0+IHtcbiAgYWRtaW5zLmZvckVhY2goYWRtaW4gPT4ge1xuICAgIGNvbnN0IGV4aXN0cyA9IE1ldGVvci51c2Vycy5maW5kT25lKF8ub21pdChhZG1pbiwgXCJwYXNzd29yZFwiKSk7XG4gICAgaWYgKCFleGlzdHMpIHtcbiAgICAgIEFjY291bnRzLmNyZWF0ZVVzZXIoYWRtaW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBBY2NvdW50cy5zZXRQYXNzd29yZChleGlzdHMuX2lkLCBhZG1pbi5wYXNzd29yZCwgeyBsb2dvdXQ6IGZhbHNlIH0pO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uLy4uL2FwaS9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJzIH0gZnJvbSBcIi4uLy4uL2FwaS9wbGF5ZXJzL3BsYXllcnMuanNcIjtcblxuZXhwb3J0IGNvbnN0IGNvbm5lY3Rpb25zID0ge307XG5cbmNvbnN0IHBsYXllckluTG9iYnkgPSAocGxheWVySWQsIGtleSA9IFwicGxheWVySWRzXCIpID0+IHtcbiAgY29uc3QgcXVlcnkgPSB7XG4gICAgc3RhdHVzOiBcInJ1bm5pbmdcIixcbiAgICBnYW1lSWQ6IHsgJGV4aXN0czogZmFsc2UgfSxcbiAgICB0aW1lZE91dEF0OiB7ICRleGlzdHM6IGZhbHNlIH0sXG4gICAgW2tleV06IHBsYXllcklkXG4gIH07XG5cbiAgcmV0dXJuIEdhbWVMb2JiaWVzLmZpbmRPbmUocXVlcnkpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBsYXllcklkRm9yQ29ubiA9IGNvbm4gPT4ge1xuICByZXR1cm4gY29ubmVjdGlvbnNbY29ubi5pZF07XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZVBsYXllcklkID0gKGNvbm4sIHBsYXllcklkKSA9PiB7XG4gIGNvbm5lY3Rpb25zW2Nvbm4uaWRdID0gcGxheWVySWQ7XG5cbiAgY29uc3QgcGlpID0gTWV0ZW9yLnNldHRpbmdzLmNvbGxlY3RQSUlcbiAgICA/IHsgaXA6IGNvbm4uY2xpZW50QWRkcmVzcywgdXNlckFnZW50OiBjb25uLmh0dHBIZWFkZXJzW1widXNlci1hZ2VudFwiXSB9XG4gICAgOiB7fTtcblxuICBQbGF5ZXJzLnVwZGF0ZShwbGF5ZXJJZCwge1xuICAgICRzZXQ6IHtcbiAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgIGxhc3RMb2dpbjoge1xuICAgICAgICBhdDogbmV3IERhdGUoKSxcbiAgICAgICAgLi4ucGlpXG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBwbGF5ZXIgPSBQbGF5ZXJzLmZpbmRPbmUocGxheWVySWQpO1xuICBpZiAoIXBsYXllci5yZWFkeUF0KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbG9iYnkgPSBwbGF5ZXJJbkxvYmJ5KHBsYXllcklkLCBcInF1ZXVlZFBsYXllcklkc1wiKTtcbiAgaWYgKCFsb2JieSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIEdhbWVMb2JiaWVzLnVwZGF0ZShsb2JieS5faWQsIHtcbiAgICAkYWRkVG9TZXQ6IHsgcGxheWVySWRzOiBwbGF5ZXJJZCB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcmdldFBsYXllcklkID0gY29ubiA9PiB7XG4gIGlmICghY29ubmVjdGlvbnNbY29ubi5pZF0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwbGF5ZXJJZCA9IGNvbm5lY3Rpb25zW2Nvbm4uaWRdO1xuXG4gIFBsYXllcnMudXBkYXRlKHBsYXllcklkLCB7XG4gICAgJHNldDogeyBvbmxpbmU6IGZhbHNlIH0sXG4gICAgJHVuc2V0OiB7XG4gICAgICBpZGxlOiBudWxsXG4gICAgfVxuICB9KTtcblxuICBjb25zdCBsb2JieSA9IHBsYXllckluTG9iYnkocGxheWVySWQpO1xuXG4gIGlmICghbG9iYnkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBHYW1lTG9iYmllcy51cGRhdGUobG9iYnkuX2lkLCB7XG4gICAgJHB1bGw6IHsgcGxheWVySWRzOiBwbGF5ZXJJZCB9XG4gIH0pO1xuXG4gIGRlbGV0ZSBjb25uZWN0aW9uc1tjb25uLmlkXTtcbn07XG5cbk1ldGVvci5vbkNvbm5lY3Rpb24oY29ubiA9PiB7XG4gIGNvbm4ub25DbG9zZSgoKSA9PiB7XG4gICAgZm9yZ2V0UGxheWVySWQoY29ubik7XG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gXCJzaW1wbC1zY2hlbWFcIjtcbmltcG9ydCBjb2xvcnMgZnJvbSBcImNvbG9ycy9zYWZlXCI7XG5cbmNvbnN0IHRhc2tzID0ge307XG5cbmNvbnN0IENyb24gPSB7XG4gIGFkZChvcHRpb25zKSB7XG4gICAgbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxuICAgICAgaW50ZXJ2YWw6IHsgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIgfSwgLy8gSW4gbXMsIHNob3VsZG4ndCBiZSBsZXNzIHRoYW4gMTAwMG1zXG4gICAgICB0YXNrOiB7IHR5cGU6IEZ1bmN0aW9uIH1cbiAgICB9KS52YWxpZGF0ZShvcHRpb25zKTtcblxuICAgIGlmICh0YXNrc1tvcHRpb25zLm5hbWVdKSB7XG4gICAgICB0aHJvdyBgQ3JvbiB0YXNrIHdpdGggbmFtZSAke29wdGlvbnMubmFtZX0gYWxyZWFkeSBleGlzdHNgO1xuICAgIH1cblxuICAgIHRhc2tzW29wdGlvbnMubmFtZV0gPSBvcHRpb25zO1xuICB9XG59O1xuXG5jb25zdCBsb2dDcm9uID0gKE1ldGVvci5jcm9uICYmIE1ldGVvci5jcm9uLmxvZykgfHwgZmFsc2U7XG5jb25zdCBjcm9uTG9nID0gbXNnID0+IGxvZ0Nyb24gJiYgY29uc29sZS5pbmZvKG1zZyk7XG5jb25zdCBjcm9uTG9nRXJyID0gbXNnID0+IGxvZ0Nyb24gJiYgY29uc29sZS5lcnJvcihtc2cpO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGZvciAoY29uc3QgbmFtZSBpbiB0YXNrcykge1xuICAgIGlmICghdGFza3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB0YXNrID0gdGFza3NbbmFtZV07XG5cbiAgICBNZXRlb3IuZGVmZXIoKCkgPT4ge1xuICAgICAgY29uc3QgdGFza05hbWUgPSBjb2xvcnMuYm9sZCh0YXNrLm5hbWUpO1xuICAgICAgY29uc3Qgc3RhcnRMb2cgPSBgJHtjb2xvcnMuZ3JlZW4oXCLilrZcIil9ICR7dGFza05hbWV9YDtcbiAgICAgIGNvbnN0IGRvbmVMb2cgPSAodG9vaywgd2FpdCkgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGAke2NvbG9ycy5yZWQoXCLil7xcIil9ICR7dGFza05hbWV9OiBEb25lIGluICR7dG9va31tcy4gYCArXG4gICAgICAgICAgYFdhaXRpbmcgZm9yICR7d2FpdCA8IDAgPyAwIDogd2FpdH1tcy5gXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgICAgY29uc3QgbG9nID0ge1xuICAgICAgICBpbmZvKG1zZykge1xuICAgICAgICAgIGNyb25Mb2coYCR7Y29sb3JzLmRpbShcImlcIil9ICR7dGFza05hbWV9OiAke21zZ30gYCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yKG1zZykge1xuICAgICAgICAgIGNyb25Mb2coYCR7Y29sb3JzLnJlZChcIuKcmFwiKX0gJHtjb2xvcnMucmVkKHRhc2tOYW1lICsgXCI6XCIpfSAke21zZ30gYCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBsZXQgcnVuID0gKCkgPT4ge1xuICAgICAgICBjcm9uTG9nKHN0YXJ0TG9nKTtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB0YXNrLnRhc2sobG9nKTtcbiAgICAgICAgY29uc3QgdG9vayA9IG5ldyBEYXRlKCkgLSBzdGFydDtcbiAgICAgICAgY29uc3Qgd2FpdCA9IHRhc2suaW50ZXJ2YWwgLSB0b29rO1xuICAgICAgICBjcm9uTG9nKGRvbmVMb2codG9vaywgd2FpdCkpO1xuICAgICAgICBpZiAod2FpdCA8PSAwKSB7XG4gICAgICAgICAgTWV0ZW9yLmRlZmVyKHJ1bik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQocnVuLCB3YWl0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJ1bigpO1xuICAgIH0pO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgQ3JvbjtcbiIsImltcG9ydCBhcmNoaXZlciBmcm9tIFwiYXJjaGl2ZXJcIjtcbmltcG9ydCBjb250ZW50RGlzcG9zaXRpb24gZnJvbSBcImNvbnRlbnQtZGlzcG9zaXRpb25cIjtcbmltcG9ydCBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuaW1wb3J0IHN0cmVhbXMgZnJvbSBcInN0cmVhbS1idWZmZXJzXCI7XG5pbXBvcnQgeyBCYXRjaGVzIH0gZnJvbSBcIi4uLy4uL2FwaS9iYXRjaGVzL2JhdGNoZXMuanNcIjtcbmltcG9ydCB7IEZhY3RvclR5cGVzIH0gZnJvbSBcIi4uLy4uL2FwaS9mYWN0b3ItdHlwZXMvZmFjdG9yLXR5cGVzLmpzXCI7XG5pbXBvcnQgeyBGYWN0b3JzIH0gZnJvbSBcIi4uLy4uL2FwaS9mYWN0b3JzL2ZhY3RvcnMuanNcIjtcbmltcG9ydCB7IEdhbWVMb2JiaWVzIH0gZnJvbSBcIi4uLy4uL2FwaS9nYW1lLWxvYmJpZXMvZ2FtZS1sb2JiaWVzLmpzXCI7XG5pbXBvcnQgeyBHYW1lcyB9IGZyb20gXCIuLi8uLi9hcGkvZ2FtZXMvZ2FtZXMuanNcIjtcbmltcG9ydCB7IExvYmJ5Q29uZmlncyB9IGZyb20gXCIuLi8uLi9hcGkvbG9iYnktY29uZmlncy9sb2JieS1jb25maWdzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJJbnB1dHMgfSBmcm9tIFwiLi4vLi4vYXBpL3BsYXllci1pbnB1dHMvcGxheWVyLWlucHV0cy5qc1wiO1xuaW1wb3J0IHsgUGxheWVyTG9ncyB9IGZyb20gXCIuLi8uLi9hcGkvcGxheWVyLWxvZ3MvcGxheWVyLWxvZ3MuanNcIjtcbmltcG9ydCB7IFBsYXllclJvdW5kcyB9IGZyb20gXCIuLi8uLi9hcGkvcGxheWVyLXJvdW5kcy9wbGF5ZXItcm91bmRzLmpzXCI7XG5pbXBvcnQgeyBQbGF5ZXJTdGFnZXMgfSBmcm9tIFwiLi4vLi4vYXBpL3BsYXllci1zdGFnZXMvcGxheWVyLXN0YWdlcy5qc1wiO1xuaW1wb3J0IHsgUGxheWVycyB9IGZyb20gXCIuLi8uLi9hcGkvcGxheWVycy9wbGF5ZXJzLmpzXCI7XG5pbXBvcnQgeyBSb3VuZHMgfSBmcm9tIFwiLi4vLi4vYXBpL3JvdW5kcy9yb3VuZHMuanNcIjtcbmltcG9ydCB7IFN0YWdlcyB9IGZyb20gXCIuLi8uLi9hcGkvc3RhZ2VzL3N0YWdlcy5qc1wiO1xuaW1wb3J0IHsgVHJlYXRtZW50cyB9IGZyb20gXCIuLi8uLi9hcGkvdHJlYXRtZW50cy90cmVhdG1lbnRzLmpzXCI7XG5pbXBvcnQgbG9nIGZyb20gXCIuLi8uLi9saWIvbG9nLmpzXCI7XG5cbmV4cG9ydCBjb25zdCBCT00gPSBcIlxcdUZFRkZcIjtcblxuLy8gR2V0IGFsbCBwb3NzaWJsZSBrZXlzIGluIHRoZSBkYXRhIGZpZWxkIG9mIGNvbGxlY3Rpb25zIHRoYXQgaGF2ZSBhIGRhdGEgZmllbGRcbi8vIHN1Y2ggYXMgUGxheWVycywgUGxheWVyU3RhZ2VzIGFuZCBQbGF5ZXJSb3VuZHMuXG5jb25zdCBnZXREYXRhS2V5cyA9IGNvbGwgPT4ge1xuICBjb25zdCBtYXAgPSB7fTtcbiAgY29sbC5maW5kKHt9LCB7IGZpZWxkczogeyBkYXRhOiAxIH0gfSkuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgIF8ua2V5cyhyZWNvcmQuZGF0YSkuZm9yRWFjaChrZXkgPT4gKG1hcFtrZXldID0gdHJ1ZSkpO1xuICB9KTtcbiAgcmV0dXJuIF8ua2V5cyhtYXApO1xufTtcblxuZXhwb3J0IGNvbnN0IGNhc3QgPSBvdXQgPT4ge1xuICBpZiAoXy5pc0FycmF5KG91dCkpIHtcbiAgICAvLyBUaGUgY2FzdCBoZXJlIHdpbGwgZmxhdHRlbiBhcnJheXMgYnV0IHdpbGwgc3RpbGwgY2F0Y2ggZGF0ZXMgY29ycmVjdGx5XG4gICAgcmV0dXJuIG91dC5tYXAoYSA9PiBjYXN0KGEpKS5qb2luKFwiLFwiKTtcbiAgfVxuICBpZiAoXy5pc0RhdGUob3V0KSkge1xuICAgIHJldHVybiBtb21lbnQob3V0KVxuICAgICAgLnV0YygpXG4gICAgICAuZm9ybWF0KCk7XG4gIH1cbiAgaWYgKF8uaXNPYmplY3Qob3V0KSkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvdXQpO1xuICB9XG4gIGlmIChfLmlzU3RyaW5nKG91dCkpIHtcbiAgICByZXR1cm4gb3V0LnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpO1xuICB9XG5cbiAgaWYgKG91dCA9PT0gZmFsc2UgfHwgb3V0ID09PSAwKSB7XG4gICAgcmV0dXJuIG91dC50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiAob3V0IHx8IFwiXCIpLnRvU3RyaW5nKCk7XG59O1xuXG5leHBvcnQgY29uc3QgcXVvdGVNYXJrID0gJ1wiJztcbmV4cG9ydCBjb25zdCBkb3VibGVRdW90ZU1hcmsgPSAnXCJcIic7XG5leHBvcnQgY29uc3QgcXVvdGVSZWdleCA9IC9cIi9nO1xuXG5leHBvcnQgY29uc3QgZW5jb2RlQ2VsbHMgPSBsaW5lID0+IHtcbiAgY29uc3Qgcm93ID0gbGluZS5zbGljZSgwKTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJvdy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJvd1tpXSA9IGNhc3Qocm93W2ldKTtcbiAgICBpZiAocm93W2ldLmluZGV4T2YocXVvdGVNYXJrKSAhPT0gLTEpIHtcbiAgICAgIHJvd1tpXSA9XG4gICAgICAgIHF1b3RlTWFyayArIHJvd1tpXS5yZXBsYWNlKHF1b3RlUmVnZXgsIGRvdWJsZVF1b3RlTWFyaykgKyBxdW90ZU1hcms7XG4gICAgfSBlbHNlIGlmIChyb3dbaV0uaW5kZXhPZihcIixcIikgIT09IC0xIHx8IHJvd1tpXS5pbmRleE9mKFwiXFxcXG5cIikgIT09IC0xKSB7XG4gICAgICByb3dbaV0gPSBxdW90ZU1hcmsgKyByb3dbaV0gKyBxdW90ZU1hcms7XG4gICAgfVxuICB9XG4gIHJldHVybiByb3cuam9pbihcIixcIikgKyBcIlxcblwiO1xufTtcblxuY29uc3QgYmF0Y2ggPSAoY29sbCwgcXVlcnkgPSB7fSwgc29ydCA9IHt9LCBsaW1pdCA9IDEwMDApID0+IGl0ZXJhdG9yID0+IHtcbiAgbGV0IHNraXAgPSAwLFxuICAgIHJlY29yZHM7XG4gIHdoaWxlICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA+IDApIHtcbiAgICByZWNvcmRzID0gY29sbC5maW5kKHF1ZXJ5LCB7IHNvcnQsIGxpbWl0LCBza2lwIH0pLmZldGNoKCk7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKGl0ZXJhdG9yKTtcbiAgICBza2lwICs9IGxpbWl0O1xuICB9XG59O1xuXG5XZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9hZG1pbi9leHBvcnRcIiwgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIC8vXG4gIC8vIEF1dGhlbnRpY2F0aW9uXG4gIC8vXG5cbiAgY29uc3QgbG9naW5Ub2tlbiA9IHJlcS5jb29raWVzICYmIHJlcS5jb29raWVzLm1ldGVvcl9sb2dpbl90b2tlbjtcbiAgbGV0IHVzZXI7XG4gIGlmIChsb2dpblRva2VuKSB7XG4gICAgY29uc3QgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4obG9naW5Ub2tlbik7XG4gICAgY29uc3QgcXVlcnkgPSB7IFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuIH07XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgZmllbGRzOiB7IF9pZDogMSB9IH07XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHF1ZXJ5LCBvcHRpb25zKTtcbiAgfVxuXG4gIGlmICghdXNlcikge1xuICAgIHJlcy53cml0ZUhlYWQoNDAzKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy9cbiAgLy8gRm9ybWF0XG4gIC8vXG5cbiAgbGV0IGZvcm1hdDtcbiAgc3dpdGNoICh0cnVlKSB7XG4gICAgY2FzZSByZXEudXJsID09PSBcIi9cIjpcbiAgICAgIG5leHQoKTtcbiAgICAgIHJldHVybjtcbiAgICBjYXNlIHJlcS51cmwuaW5jbHVkZXMoXCIvLmpzb25cIik6XG4gICAgICBmb3JtYXQgPSBcImpzb25cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgcmVxLnVybC5pbmNsdWRlcyhcIi8uanNvbmxcIik6XG4gICAgICBmb3JtYXQgPSBcImpzb25sXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIHJlcS51cmwuaW5jbHVkZXMoXCIvLmNzdlwiKTpcbiAgICAgIGZvcm1hdCA9IFwiY3N2XCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgcmVzLndyaXRlSGVhZCg0MDQpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICB9XG5cbiAgLy9cbiAgLy8gQ29ubmVjdGlvbiBib29ra2VlcGluZ1xuICAvL1xuXG4gIGxldCBjYW5jZWxSZXF1ZXN0ID0gZmFsc2UsXG4gICAgcmVxdWVzdEZpbmlzaGVkID0gZmFsc2U7XG5cbiAgcmVxLm9uKFwiY2xvc2VcIiwgZnVuY3Rpb24oZXJyKSB7XG4gICAgaWYgKCFyZXF1ZXN0RmluaXNoZWQpIHtcbiAgICAgIGxvZy5pbmZvKFwiRXhwb3J0IHJlcXVlc3Qgd2FzIGNhbmNlbGxlZFwiKTtcbiAgICAgIGNhbmNlbFJlcXVlc3QgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy9cbiAgLy8gSGVhZGVyc1xuICAvL1xuXG4gIGNvbnN0IHRzID0gbW9tZW50KCkuZm9ybWF0KFwiWVlZWS1NTS1ERCBISC1tbS1zc1wiKTtcbiAgY29uc3QgZmlsZW5hbWUgPSBgRW1waXJpY2EgRGF0YSAtICR7dHN9YDtcbiAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgY29udGVudERpc3Bvc2l0aW9uKGZpbGVuYW1lICsgXCIuemlwXCIpKTtcbiAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL3ppcFwiKTtcbiAgcmVzLndyaXRlSGVhZCgyMDApO1xuXG4gIC8vXG4gIC8vIENyZWF0ZSBhcmNoaXZlXG4gIC8vXG5cbiAgdmFyIGFyY2hpdmUgPSBhcmNoaXZlcihcInppcFwiKTtcblxuICAvLyBnb29kIHByYWN0aWNlIHRvIGNhdGNoIHdhcm5pbmdzIChpZSBzdGF0IGZhaWx1cmVzIGFuZCBvdGhlciBub24tYmxvY2tpbmcgZXJyb3JzKVxuICBhcmNoaXZlLm9uKFwid2FybmluZ1wiLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT09IFwiRU5PRU5UXCIpIHtcbiAgICAgIGxvZy53YXJuKFwiYXJjaGl2ZSB3YXJuaW5nXCIsIGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5lcnIoXCJhcmNoaXZlIGVycm9yXCIpO1xuICAgICAgLy8gdGhyb3cgZXJyb3JcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGdvb2QgcHJhY3RpY2UgdG8gY2F0Y2ggdGhpcyBlcnJvciBleHBsaWNpdGx5XG4gIGFyY2hpdmUub24oXCJlcnJvclwiLCBmdW5jdGlvbihlcnIpIHtcbiAgICBsb2cuZXJyKFwiYXJjaGl2ZSBlcnJvclwiKTtcbiAgICB0aHJvdyBlcnI7XG4gIH0pO1xuXG4gIC8vIHBpcGUgYXJjaGl2ZSBkYXRhIHRvIHRoZSBmaWxlXG4gIGFyY2hpdmUucGlwZShyZXMpO1xuXG4gIC8vXG4gIC8vIEZpbGUgY3JlYXRpb24gaGVscGVyXG4gIC8vXG5cbiAgY29uc3QgZXhpc3RpbmdGaWxlID0ge307XG4gIGNvbnN0IHNhdmVGaWxlID0gKG5hbWUsIGtleXMsIGZ1bmMsIGRhdGFLZXlzID0gW10pID0+IHtcbiAgICBpZiAoZXhpc3RpbmdGaWxlW25hbWVdKSB7XG4gICAgICB0aHJvdyBgZXhwb3J0IGZpbGVuYW1lIGFscmVhZHkgZXhpc3RzOiAke25hbWV9YDtcbiAgICB9XG4gICAgZXhpc3RpbmdGaWxlW25hbWVdID0gdHJ1ZTtcblxuICAgIGNvbnN0IGZpbGUgPSBuZXcgc3RyZWFtcy5SZWFkYWJsZVN0cmVhbUJ1ZmZlcigpO1xuICAgIGFyY2hpdmUuYXBwZW5kKGZpbGUsIHsgbmFtZTogYCR7ZmlsZW5hbWV9LyR7bmFtZX0uJHtmb3JtYXR9YCB9KTtcbiAgICBpZiAoZm9ybWF0ID09PSBcImNzdlwiKSB7XG4gICAgICBmaWxlLnB1dChCT00pO1xuICAgICAgZmlsZS5wdXQoZW5jb2RlQ2VsbHMoa2V5cy5jb25jYXQoZGF0YUtleXMubWFwKGsgPT4gYGRhdGEuJHtrfWApKSkpO1xuICAgIH1cblxuICAgIGZvcm1hdCA9PT0gXCJqc29uXCIgJiYgZmlsZS5wdXQoXCJbXCIpO1xuXG4gICAgbGV0IGlzRmlyc3RMaW5lID0gdHJ1ZTtcblxuICAgIGZ1bmMoKGRhdGEsIHVzZXJEYXRhID0ge30pID0+IHtcbiAgICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICAgIGNhc2UgXCJjc3ZcIjpcbiAgICAgICAgICBjb25zdCBvdXQgPSBbXTtcbiAgICAgICAgICBrZXlzLmZvckVhY2goayA9PiB7XG4gICAgICAgICAgICBvdXQucHVzaChkYXRhW2tdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkYXRhS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgb3V0LnB1c2godXNlckRhdGFba10pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGZpbGUucHV0KGVuY29kZUNlbGxzKG91dCkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwianNvbmxcIjpcbiAgICAgICAgICBfLmVhY2godXNlckRhdGEsICh2LCBrKSA9PiAoZGF0YVtgZGF0YS4ke2t9YF0gPSB2KSk7XG4gICAgICAgICAgZmlsZS5wdXQoSlNPTi5zdHJpbmdpZnkoZGF0YSkgKyBcIlxcblwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImpzb25cIjpcbiAgICAgICAgICBfLmVhY2godXNlckRhdGEsICh2LCBrKSA9PiAoZGF0YVtgZGF0YS4ke2t9YF0gPSB2KSk7XG4gICAgICAgICAgaWYgKGlzRmlyc3RMaW5lKSB7XG4gICAgICAgICAgICBpc0ZpcnN0TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgZmlsZS5wdXQoXCJcXHRcIiArIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlsZS5wdXQoXCIsXFx0XCIgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGB1bmtub3duIGZvcm1hdDogJHtmb3JtYXR9YDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGZvcm1hdCA9PT0gXCJqc29uXCIgJiYgZmlsZS5wdXQoXCJcXG5dXCIpO1xuXG4gICAgZmlsZS5zdG9wKCk7XG4gIH07XG5cbiAgLy9cbiAgLy8gRXhwb3J0c1xuICAvL1xuXG4gIGNvbnN0IGZhY3RvclR5cGVGaWVsZHMgPSBbXG4gICAgXCJfaWRcIixcbiAgICBcIm5hbWVcIixcbiAgICBcInJlcXVpcmVkXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiLFxuICAgIFwidHlwZVwiLFxuICAgIFwibWluXCIsXG4gICAgXCJtYXhcIixcbiAgICBcImNyZWF0ZWRBdFwiLFxuICAgIFwiYXJjaGl2ZWRBdFwiXG4gIF07XG4gIHNhdmVGaWxlKFwiZmFjdG9yLXR5cGVzXCIsIGZhY3RvclR5cGVGaWVsZHMsIHB1dHMgPT4ge1xuICAgIEZhY3RvclR5cGVzLmZpbmQoKS5mb3JFYWNoKGZ0ID0+IHB1dHMoXy5waWNrKGZ0LCBmYWN0b3JUeXBlRmllbGRzKSkpO1xuICB9KTtcblxuICBjb25zdCBmYWN0b3JGaWVsZHMgPSBbXCJfaWRcIiwgXCJuYW1lXCIsIFwidmFsdWVcIiwgXCJmYWN0b3JUeXBlSWRcIiwgXCJjcmVhdGVkQXRcIl07XG4gIHNhdmVGaWxlKFwiZmFjdG9yc1wiLCBmYWN0b3JGaWVsZHMsIHB1dHMgPT4ge1xuICAgIGJhdGNoKEZhY3RvcnMpKGYgPT4gcHV0cyhfLnBpY2soZiwgZmFjdG9yRmllbGRzKSkpO1xuICB9KTtcblxuICBjb25zdCB0cmVhdG1lbnRGaWVsZHMgPSBbXG4gICAgXCJfaWRcIixcbiAgICBcIm5hbWVcIixcbiAgICBcImZhY3Rvcklkc1wiLFxuICAgIFwiY3JlYXRlZEF0XCIsXG4gICAgXCJhcmNoaXZlZEF0XCJcbiAgXTtcbiAgc2F2ZUZpbGUoXCJ0cmVhdG1lbnRzXCIsIHRyZWF0bWVudEZpZWxkcywgcHV0cyA9PiB7XG4gICAgYmF0Y2goVHJlYXRtZW50cykoZiA9PiBwdXRzKF8ucGljayhmLCB0cmVhdG1lbnRGaWVsZHMpKSk7XG4gIH0pO1xuXG4gIGNvbnN0IGxvYmJ5Q29uZmlnRmllbGRzID0gW1xuICAgIFwiX2lkXCIsXG4gICAgXCJuYW1lXCIsXG4gICAgXCJ0aW1lb3V0VHlwZVwiLFxuICAgIFwidGltZW91dEluU2Vjb25kc1wiLFxuICAgIFwidGltZW91dFN0cmF0ZWd5XCIsXG4gICAgXCJ0aW1lb3V0Qm90c1wiLFxuICAgIFwiZXh0ZW5kQ291bnRcIixcbiAgICBcImNyZWF0ZWRBdFwiLFxuICAgIFwiYXJjaGl2ZWRBdFwiXG4gIF07XG4gIHNhdmVGaWxlKFwibG9iYnktY29uZmlnc1wiLCBsb2JieUNvbmZpZ0ZpZWxkcywgcHV0cyA9PiB7XG4gICAgYmF0Y2goTG9iYnlDb25maWdzKShmID0+IHB1dHMoXy5waWNrKGYsIGxvYmJ5Q29uZmlnRmllbGRzKSkpO1xuICB9KTtcblxuICBjb25zdCBiYXRjaEZpZWxkcyA9IFtcbiAgICBcIl9pZFwiLFxuICAgIFwiaW5kZXhcIixcbiAgICBcImFzc2lnbm1lbnRcIixcbiAgICBcImZ1bGxcIixcbiAgICBcInJ1bm5pbmdBdFwiLFxuICAgIFwiZmluaXNoZWRBdFwiLFxuICAgIFwic3RhdHVzXCIsXG4gICAgXCJnYW1lSWRzXCIsXG4gICAgXCJnYW1lTG9iYnlJZHNcIixcbiAgICBcImNyZWF0ZWRBdFwiLFxuICAgIFwiYXJjaGl2ZWRBdFwiXG4gIF07XG4gIHNhdmVGaWxlKFwiYmF0Y2hlc1wiLCBiYXRjaEZpZWxkcywgcHV0cyA9PiB7XG4gICAgYmF0Y2goQmF0Y2hlcykoZiA9PiBwdXRzKF8ucGljayhmLCBiYXRjaEZpZWxkcykpKTtcbiAgfSk7XG5cbiAgY29uc3QgZ2FtZUxvYmJ5RmllbGRzID0gW1xuICAgIFwiX2lkXCIsXG4gICAgXCJpbmRleFwiLFxuICAgIFwiYXZhaWxhYmxlQ291bnRcIixcbiAgICBcInRpbWVvdXRTdGFydGVkQXRcIixcbiAgICBcInRpbWVkT3V0QXRcIixcbiAgICBcInF1ZXVlZFBsYXllcklkc1wiLFxuICAgIFwicGxheWVySWRzXCIsXG4gICAgXCJnYW1lSWRcIixcbiAgICBcInRyZWF0bWVudElkXCIsXG4gICAgXCJiYXRjaElkXCIsXG4gICAgXCJsb2JieUNvbmZpZ0lkXCIsXG4gICAgXCJjcmVhdGVkQXRcIlxuICBdO1xuICBzYXZlRmlsZShcImdhbWUtbG9iYmllc1wiLCBnYW1lTG9iYnlGaWVsZHMsIHB1dHMgPT4ge1xuICAgIGJhdGNoKEdhbWVMb2JiaWVzKShmID0+IHB1dHMoXy5waWNrKGYsIGdhbWVMb2JieUZpZWxkcykpKTtcbiAgfSk7XG5cbiAgY29uc3QgZ2FtZUZpZWxkcyA9IFtcbiAgICBcIl9pZFwiLFxuICAgIFwiZmluaXNoZWRBdFwiLFxuICAgIFwiZ2FtZUxvYmJ5SWRcIixcbiAgICBcInRyZWF0bWVudElkXCIsXG4gICAgXCJyb3VuZElkc1wiLFxuICAgIFwicGxheWVySWRzXCIsXG4gICAgXCJiYXRjaElkXCIsXG4gICAgXCJjcmVhdGVkQXRcIlxuICBdO1xuICBjb25zdCBnYW1lRGF0YUZpZWxkcyA9IGdldERhdGFLZXlzKEdhbWVzKTtcbiAgc2F2ZUZpbGUoXG4gICAgXCJnYW1lc1wiLFxuICAgIGdhbWVGaWVsZHMsXG4gICAgcHV0cyA9PiB7XG4gICAgICBiYXRjaChHYW1lcykoZiA9PlxuICAgICAgICBwdXRzKF8ucGljayhmLCBnYW1lRmllbGRzKSwgXy5waWNrKGYuZGF0YSwgZ2FtZURhdGFGaWVsZHMpKVxuICAgICAgKTtcbiAgICB9LFxuICAgIGdhbWVEYXRhRmllbGRzXG4gICk7XG5cbiAgY29uc3QgcGxheWVyRmllbGRzID0gW1xuICAgIFwiX2lkXCIsXG4gICAgXCJib3RcIixcbiAgICBcInJlYWR5QXRcIixcbiAgICBcInRpbWVvdXRTdGFydGVkQXRcIixcbiAgICBcInRpbWVvdXRXYWl0Q291bnRcIixcbiAgICBcImV4aXRTdGVwc0RvbmVcIixcbiAgICBcImV4aXRBdFwiLFxuICAgIFwiZXhpdFN0YXR1c1wiLFxuICAgIFwiZXhpdFJlYXNvblwiLFxuICAgIFwicmV0aXJlZEF0XCIsXG4gICAgXCJyZXRpcmVkUmVhc29uXCIsXG4gICAgXCJjcmVhdGVkQXRcIlxuICBdO1xuICBpZiAocmVxLnF1ZXJ5LmluY2x1ZGVfcGlpID09PSBcInRydWVcIikge1xuICAgIHBsYXllckZpZWxkcy5zcGxpY2UoMSwgMCwgXCJpZFwiLCBcInVybFBhcmFtc1wiKTtcbiAgICBwbGF5ZXJGaWVsZHMuc3BsaWNlKHBsYXllckZpZWxkcy5sZW5ndGgsIDAsIFwibGFzdExvZ2luXCIpO1xuICB9XG5cbiAgY29uc3QgcGxheWVyRGF0YUZpZWxkcyA9IGdldERhdGFLZXlzKFBsYXllcnMpO1xuICBzYXZlRmlsZShcbiAgICBcInBsYXllcnNcIixcbiAgICBwbGF5ZXJGaWVsZHMsXG4gICAgcHV0cyA9PiB7XG4gICAgICBiYXRjaChQbGF5ZXJzKShwID0+XG4gICAgICAgIHB1dHMoXy5waWNrKHAsIHBsYXllckZpZWxkcyksIF8ucGljayhwLmRhdGEsIHBsYXllckRhdGFGaWVsZHMpKVxuICAgICAgKTtcbiAgICB9LFxuICAgIHBsYXllckRhdGFGaWVsZHNcbiAgKTtcblxuICBjb25zdCByb3VuZEZpZWxkcyA9IFtcIl9pZFwiLCBcImluZGV4XCIsIFwic3RhZ2VJZHNcIiwgXCJnYW1lSWRcIiwgXCJjcmVhdGVkQXRcIl07XG4gIGNvbnN0IHJvdW5kRGF0YUZpZWxkcyA9IGdldERhdGFLZXlzKFJvdW5kcyk7XG4gIHNhdmVGaWxlKFxuICAgIFwicm91bmRzXCIsXG4gICAgcm91bmRGaWVsZHMsXG4gICAgcHV0cyA9PiB7XG4gICAgICBiYXRjaChSb3VuZHMpKHAgPT5cbiAgICAgICAgcHV0cyhfLnBpY2socCwgcm91bmRGaWVsZHMpLCBfLnBpY2socC5kYXRhLCByb3VuZERhdGFGaWVsZHMpKVxuICAgICAgKTtcbiAgICB9LFxuICAgIHJvdW5kRGF0YUZpZWxkc1xuICApO1xuXG4gIGNvbnN0IHN0YWdlRmllbGRzID0gW1xuICAgIFwiX2lkXCIsXG4gICAgXCJpbmRleFwiLFxuICAgIFwibmFtZVwiLFxuICAgIFwiZGlzcGxheU5hbWVcIixcbiAgICBcInN0YXJ0VGltZUF0XCIsXG4gICAgXCJkdXJhdGlvbkluU2Vjb25kc1wiLFxuICAgIFwicm91bmRJZFwiLFxuICAgIFwiZ2FtZUlkXCIsXG4gICAgXCJjcmVhdGVkQXRcIlxuICBdO1xuICBjb25zdCBzdGFnZURhdGFGaWVsZHMgPSBnZXREYXRhS2V5cyhTdGFnZXMpO1xuICBzYXZlRmlsZShcbiAgICBcInN0YWdlc1wiLFxuICAgIHN0YWdlRmllbGRzLFxuICAgIHB1dHMgPT4ge1xuICAgICAgYmF0Y2goU3RhZ2VzKShwID0+XG4gICAgICAgIHB1dHMoXy5waWNrKHAsIHN0YWdlRmllbGRzKSwgXy5waWNrKHAuZGF0YSwgc3RhZ2VEYXRhRmllbGRzKSlcbiAgICAgICk7XG4gICAgfSxcbiAgICBzdGFnZURhdGFGaWVsZHNcbiAgKTtcblxuICBjb25zdCBwbGF5ZXJSb3VuZEZpZWxkcyA9IFtcbiAgICBcIl9pZFwiLFxuICAgIFwiYmF0Y2hJZFwiLFxuICAgIFwicGxheWVySWRcIixcbiAgICBcInJvdW5kSWRcIixcbiAgICBcImdhbWVJZFwiLFxuICAgIFwiY3JlYXRlZEF0XCJcbiAgXTtcbiAgY29uc3QgcGxheWVyUm91bmREYXRhRmllbGRzID0gZ2V0RGF0YUtleXMoUGxheWVyUm91bmRzKTtcbiAgc2F2ZUZpbGUoXG4gICAgXCJwbGF5ZXItcm91bmRzXCIsXG4gICAgcGxheWVyUm91bmRGaWVsZHMsXG4gICAgcHV0cyA9PiB7XG4gICAgICBiYXRjaChQbGF5ZXJSb3VuZHMpKHAgPT5cbiAgICAgICAgcHV0cyhcbiAgICAgICAgICBfLnBpY2socCwgcGxheWVyUm91bmRGaWVsZHMpLFxuICAgICAgICAgIF8ucGljayhwLmRhdGEsIHBsYXllclJvdW5kRGF0YUZpZWxkcylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LFxuICAgIHBsYXllclJvdW5kRGF0YUZpZWxkc1xuICApO1xuXG4gIGNvbnN0IHBsYXllclN0YWdlRmllbGRzID0gW1xuICAgIFwiX2lkXCIsXG4gICAgXCJiYXRjaElkXCIsXG4gICAgXCJwbGF5ZXJJZFwiLFxuICAgIFwic3RhZ2VJZFwiLFxuICAgIFwicm91bmRJZFwiLFxuICAgIFwiZ2FtZUlkXCIsXG4gICAgXCJjcmVhdGVkQXRcIixcbiAgICBcInN1Ym1pdHRlZEF0XCJcbiAgXTtcbiAgY29uc3QgcGxheWVyU3RhZ2VEYXRhRmllbGRzID0gZ2V0RGF0YUtleXMoUGxheWVyU3RhZ2VzKTtcbiAgc2F2ZUZpbGUoXG4gICAgXCJwbGF5ZXItc3RhZ2VzXCIsXG4gICAgcGxheWVyU3RhZ2VGaWVsZHMsXG4gICAgcHV0cyA9PiB7XG4gICAgICBiYXRjaChQbGF5ZXJTdGFnZXMpKHAgPT5cbiAgICAgICAgcHV0cyhcbiAgICAgICAgICBfLnBpY2socCwgcGxheWVyU3RhZ2VGaWVsZHMpLFxuICAgICAgICAgIF8ucGljayhwLmRhdGEsIHBsYXllclN0YWdlRGF0YUZpZWxkcylcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LFxuICAgIHBsYXllclN0YWdlRGF0YUZpZWxkc1xuICApO1xuXG4gIGNvbnN0IHBsYXllcklucHV0RmllbGRzID0gW1wiX2lkXCIsIFwicGxheWVySWRcIiwgXCJnYW1lSWRcIiwgXCJjcmVhdGVkQXRcIl07XG4gIGNvbnN0IHBsYXllcklucHV0RGF0YUZpZWxkcyA9IGdldERhdGFLZXlzKFBsYXllcklucHV0cyk7XG4gIHNhdmVGaWxlKFxuICAgIFwicGxheWVyLWlucHV0c1wiLFxuICAgIHBsYXllcklucHV0RmllbGRzLFxuICAgIHB1dHMgPT4ge1xuICAgICAgYmF0Y2goUGxheWVySW5wdXRzKShwID0+XG4gICAgICAgIHB1dHMoXG4gICAgICAgICAgXy5waWNrKHAsIHBsYXllcklucHV0RmllbGRzKSxcbiAgICAgICAgICBfLnBpY2socC5kYXRhLCBwbGF5ZXJJbnB1dERhdGFGaWVsZHMpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSxcbiAgICBwbGF5ZXJJbnB1dERhdGFGaWVsZHNcbiAgKTtcblxuICBjb25zdCBwbGF5ZXJMb2dGaWVsZHMgPSBbXG4gICAgXCJfaWRcIixcbiAgICBcInBsYXllcklkXCIsXG4gICAgXCJnYW1lSWRcIixcbiAgICBcInJvdW5kSWRcIixcbiAgICBcInN0YWdlSWRcIixcbiAgICBcIm5hbWVcIixcbiAgICBcImpzb25EYXRhXCIsXG4gICAgXCJjcmVhdGVkQXRcIlxuICBdO1xuICBzYXZlRmlsZShcInBsYXllci1sb2dzXCIsIHBsYXllckxvZ0ZpZWxkcywgcHV0cyA9PiB7XG4gICAgYmF0Y2goUGxheWVyTG9ncykocCA9PiBwdXRzKF8ucGljayhwLCBwbGF5ZXJMb2dGaWVsZHMpKSk7XG4gIH0pO1xuXG4gIGFyY2hpdmUuZmluYWxpemUoKTtcbiAgcmVxdWVzdEZpbmlzaGVkID0gdHJ1ZTtcbn0pO1xuIiwiLy8gSW1wb3J0IHNlcnZlciBzdGFydHVwIHRocm91Z2ggYSBzaW5nbGUgaW5kZXggZW50cnkgcG9pbnRcblxuaW1wb3J0IFwiLi4vYm90aC9pbmRleC5qc1wiO1xuaW1wb3J0IFwiLi9hdXRoLmpzXCI7XG5pbXBvcnQgXCIuL2Jvb3RzdHJhcC5qc1wiO1xuaW1wb3J0IFwiLi9jcm9uLmpzXCI7XG5pbXBvcnQgXCIuL3JlZ2lzdGVyLWFwaS5qc1wiO1xuaW1wb3J0IFwiLi9hdmF0YXJzLmpzXCI7XG5pbXBvcnQgXCIuL2V4cG9ydC5qc1wiO1xuaW1wb3J0IFwiLi9jb25uZWN0aW9ucy5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vbGliL3V0aWxzLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvaW5kZXhlcy5qc1wiO1xuIiwiLy8gUmVnaXN0ZXIgeW91ciBhcGlzIGhlcmVcblxuaW1wb3J0IFwiLi4vLi4vYXBpL2FkbWluL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9iYXRjaGVzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9iYXRjaGVzL2hvb2tzLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvYmF0Y2hlcy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZmFjdG9ycy9tZXRob2RzLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZmFjdG9ycy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZmFjdG9yLXR5cGVzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9mYWN0b3ItdHlwZXMvaG9va3MuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9mYWN0b3ItdHlwZXMvc2VydmVyL3B1YmxpY2F0aW9ucy5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vYXBpL2ZhY3Rvci10eXBlcy9zZXJ2ZXIvYm9vdHN0cmFwLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZ2FtZS1sb2JiaWVzL2hvb2tzLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZ2FtZS1sb2JiaWVzL3NlcnZlci9jcm9uLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZ2FtZS1sb2JiaWVzL3NlcnZlci9wdWJsaWNhdGlvbnMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9nYW1lcy9ob29rcy5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vYXBpL2dhbWVzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9nYW1lcy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZ2FtZXMvc2VydmVyL2Nyb24uanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9sb2JieS1jb25maWdzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9sb2JieS1jb25maWdzL3NlcnZlci9wdWJsaWNhdGlvbnMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXJzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXJzL3NlcnZlci9wdWJsaWNhdGlvbnNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXItaW5wdXRzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXItcm91bmRzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXItc3RhZ2VzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9wbGF5ZXItc3RhZ2VzL2hvb2tzLmpzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvcm91bmRzL21ldGhvZHMuanNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9zdGFnZXMvbWV0aG9kcy5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vYXBpL3RyZWF0bWVudHMvbWV0aG9kcy5qc1wiO1xuaW1wb3J0IFwiLi4vLi4vYXBpL3RyZWF0bWVudHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qc1wiO1xuIl19
