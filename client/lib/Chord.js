
Chord = {
  classify: function(root, noteNumbers) {
    var diff = [];
    noteNumbers.forEach(function(noteNumber){
      while (noteNumber - root < 0) {
        noteNumber += 12;
      }
      while (noteNumber - root > 11) {
        noteNumber -= 12;
      }
      diff.push(noteNumber - root);
    });
    var ret = this._classifyQuad(diff);
    if (!ret) {
      ret = this._classifyTriad(diff);
    }
    // if (!ret) {
    //   root -= 7;
    //   diff = [];
    //   noteNumbers.forEach(function(noteNumber){
    //     while (noteNumber - root < 0) {
    //       noteNumber += 12;
    //     }
    //     while (noteNumber - root > 11) {
    //       noteNumber -= 12;
    //     }
    //     diff.push(noteNumber - root);
    //   });
    //   ret = this._classifyQuad(diff);
    //   if (!ret) {
    //     ret = this._classifyTriad(diff);
    //   }
    // } 
    return ret;
  },
  _classifyTriad: function(diff) {
    if (diff.indexOf(4) > -1 && diff.indexOf(7) > -1) {
      return 'maj';
    } else if (diff.indexOf(3) > -1 && diff.indexOf(7) > -1) {
      return 'min';
    } else if (diff.indexOf(3) > -1 && diff.indexOf(6) > -1) {
      return 'dim';
    } else if (diff.indexOf(4) > -1 && diff.indexOf(8) > -1) {
      return 'aug';
    } else if (diff.indexOf(5) > -1 && diff.indexOf(7) > -1) {
      return 'sus4';
    }
  },
  
  classifyTriad: function(noteNumbers){
    var ret = {};
    var self = this;
    noteNumbers.forEach(function(root) {
      var diff = [];
      noteNumbers.forEach(function(noteNumber){
        while (noteNumber - root < 0) {
          noteNumber += 12;
        }
        while (noteNumber - root > 11) {
          noteNumber -= 12;
        }
        diff.push(noteNumber - root);
      });
      var type = self._classifyTriad(diff);
      if (type) {
        ret.type = type;
        ret.root = root;
      }
    });
    return ret;
  },
  _classifyQuad: function(diff){
    var ret;
    if (diff.indexOf(8) === -1 && diff.indexOf(6) === -1) {
      if (diff.indexOf(4) > -1 && diff.indexOf(11) > -1) {
        ret = 'maj7';
      } else if (diff.indexOf(4) > -1 && diff.indexOf(10) > -1) {
        ret = '7';
      } else if (diff.indexOf(3) > -1 && diff.indexOf(10) > -1) {
        ret = 'min7';
      } else if (diff.indexOf(5) > -1 && diff.indexOf(10) > -1) {
        ret = 'sus7';
      } else if (diff.indexOf(4) > -1 && diff.indexOf(9) > -1) {
        ret = '6';
      } else if (diff.indexOf(3) > -1 && diff.indexOf(9) > -1) {
        ret = 'min6';
      } 
    } else {
      if (diff.indexOf(3) > -1 && diff.indexOf(6) > -1 && diff.indexOf(10) > -1) {
        ret = 'min7b5';
      // } else if (diff.indexOf(4) > -1 && diff.indexOf(8) > -1) {
        // ret = 'aug';
      }
    }
    return ret;
  },
  classifyQuad: function(noteNumbers) {
    var ret = {};
    var self = this;
    noteNumbers.forEach(function(root) {
      var diff = [];
      noteNumbers.forEach(function(noteNumber){
        while (noteNumber - root < 0) {
          noteNumber += 12;
        }
        while (noteNumber - root > 11) {
          noteNumber -= 12;
        }
        diff.push(noteNumber - root);
        var type = self._classifyTriad(diff);
        if (type) {
          ret.type = type;
          ret.root = root;
        }
      });
    });
    return ret;
  }
}