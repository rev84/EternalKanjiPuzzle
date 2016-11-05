// Generated by CoffeeScript 1.10.0
var Board, Utl, newGame, switchLoading;

$().ready(function() {
  newGame();
  return $('#regenerate').on('click', newGame);
});

newGame = function() {
  var countRankMax, openId, xy;
  switchLoading(true);
  xy = Number($('#config_xy').val());
  openId = Number($('#config_open_id').val());
  countRankMax = Number($('#config_count_rank_max').val());
  window.board = new Board(xy, xy, openId, countRankMax);
  return switchLoading(false);
};

switchLoading = function(bool) {
  if (bool) {
    return $('.loading').removeClass('no_display');
  } else {
    return $('.loading').addClass('no_display');
  }
};

Board = (function() {
  var answerBoard, directionX, directionY;

  Board.prototype.CONST = {
    FIRST_CHAR_FREQUENCY: 0.2,
    CELL_SIZE: 100,
    OPEN_ID: {
      ICHIMATU: 1,
      DIAGONAL: 2,
      RANDOM_50: 3,
      RANDOM_25: 4,
      RANDOM_3: 5,
      RANDOM_2: 6,
      RANDOM_1: 7,
      NONE: 8
    }
  };

  answerBoard = null;

  directionX = null;

  directionY = null;

  function Board(x1, y1, openId1, countRankMax1) {
    this.x = x1;
    this.y = y1;
    this.openId = openId1;
    this.countRankMax = countRankMax1;
    this.init();
    this.initDraw();
    this.open();
  }

  Board.prototype.countRankMax2count = function(countRankMax) {
    switch (countRankMax) {
      case 10:
        return 1980000;
      case 20:
        return 567000;
      case 30:
        return 166000;
      case 40:
        return 62600;
      case 50:
        return 29700;
      case 60:
        return 12200;
      case 70:
        return 5230;
      case 80:
        return 2720;
      default:
        return 0;
    }
  };

  Board.prototype.initDraw = function() {
    var hint, img, j, kakusuu, l, o, ref, ref1, ref2, table, td, text, tr, x, y;
    $('#field').html('');
    table = $('<table>').addClass('game_table').css('width', '' + (this.x * this.CONST.CELL_SIZE + (this.x - 1) * (this.CONST.CELL_SIZE / 4)) + 'px').css('height', '' + (this.y * this.CONST.CELL_SIZE + (this.y - 1) * (this.CONST.CELL_SIZE / 4)) + 'px');
    for (y = j = 0, ref = this.y; 0 <= ref ? j < ref : j > ref; y = 0 <= ref ? ++j : --j) {
      tr = $('<tr>');
      for (x = l = 0, ref1 = this.x; 0 <= ref1 ? l < ref1 : l > ref1; x = 0 <= ref1 ? ++l : --l) {
        kakusuu = window.c2kakusuu[this.answerBoard[x][y]];
        td = $('<td>').addClass('cell').css('width', '' + this.CONST.CELL_SIZE + 'px').css('height', '' + this.CONST.CELL_SIZE + 'px');
        text = $('<span>').addClass('char').data('kakusuu', kakusuu).attr('x', x).attr('y', y).attr('xy', '' + x + '_' + y).css('width', '' + this.CONST.CELL_SIZE + 'px').css('height', '' + this.CONST.CELL_SIZE + 'px').css('font-size', '' + (this.CONST.CELL_SIZE * 0.5) + 'px').css('line-height', '' + this.CONST.CELL_SIZE + 'px').on('click', function() {
          if ($(this).hasClass('locked')) {
            return;
          }
          $('.char').removeClass('choiced');
          $(this).addClass('choiced');
          return window.board.drawCharPallet($(this).data('kakusuu'));
        });
        hint = $('<span>').addClass('hint').html(kakusuu);
        td.append(text).append(hint);
        tr.append(td);
        if ((this.directionX[x] != null) && (this.directionX[x][y] != null)) {
          if (this.directionX[x][y] === 0) {
            img = $('<img>').attr('src', './img/left.png');
          } else {
            img = $('<img>').attr('src', './img/right.png');
          }
          img.css('max-height', '' + (this.CONST.CELL_SIZE / 5) + 'px').css('max-width', '' + (this.CONST.CELL_SIZE / 5) + 'px');
          td = $('<td>').addClass('arrow').css('width', '' + (this.CONST.CELL_SIZE / 4) + 'px').css('font-size', '' + (this.CONST.CELL_SIZE / 4) + 'px').append(img);
          tr.append(td);
        }
        table.append(tr);
      }
      if ((this.directionY[0] != null) && (this.directionY[0][y] != null)) {
        tr = $('<tr>');
        for (x = o = 0, ref2 = this.x; 0 <= ref2 ? o < ref2 : o > ref2; x = 0 <= ref2 ? ++o : --o) {
          if (this.directionY[x][y] === 0) {
            img = $('<img>').attr('src', './img/down.png');
          } else {
            img = $('<img>').attr('src', './img/up.png');
          }
          img.css('max-height', '' + (this.CONST.CELL_SIZE / 5) + 'px').css('max-width', '' + (this.CONST.CELL_SIZE / 5) + 'px');
          td = $('<td>').addClass('arrow').css('height', '' + (this.CONST.CELL_SIZE / 4) + 'px').append(img);
          tr.append(td);
          if (x !== this.x - 1) {
            tr.append($('<td>'));
          }
        }
        table.append(tr);
      }
    }
    return $('#field').append(table);
  };

  Board.prototype.open = function() {
    var aa, ab, ac, ad, ae, j, l, len, o, openCell, q, r, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, s, t, u, w, x, y, z;
    openCell = [];
    if (this.openId === this.CONST.OPEN_ID.ICHIMATU) {
      for (x = j = 0, ref = this.x; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
        for (y = l = 0, ref1 = this.y; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
          if ((x + y) % 2 === 0) {
            openCell.push([x, y]);
          }
        }
      }
    } else if (this.openId === this.CONST.OPEN_ID.DIAGONAL) {
      for (x = o = 0, ref2 = this.x; 0 <= ref2 ? o < ref2 : o > ref2; x = 0 <= ref2 ? ++o : --o) {
        for (y = q = 0, ref3 = this.y; 0 <= ref3 ? q < ref3 : q > ref3; y = 0 <= ref3 ? ++q : --q) {
          if (x === y) {
            openCell.push([x, y]);
          }
        }
      }
    } else if (this.openId === this.CONST.OPEN_ID.RANDOM_50) {
      for (x = r = 0, ref4 = this.x; 0 <= ref4 ? r < ref4 : r > ref4; x = 0 <= ref4 ? ++r : --r) {
        for (y = s = 0, ref5 = this.y; 0 <= ref5 ? s < ref5 : s > ref5; y = 0 <= ref5 ? ++s : --s) {
          openCell.push([x, y]);
        }
      }
      openCell = Utl.shuffle(openCell);
      openCell.splice(0, Math.ceil(openCell.length * 0.5));
    } else if (this.openId === this.CONST.OPEN_ID.RANDOM_25) {
      for (x = t = 0, ref6 = this.x; 0 <= ref6 ? t < ref6 : t > ref6; x = 0 <= ref6 ? ++t : --t) {
        for (y = u = 0, ref7 = this.y; 0 <= ref7 ? u < ref7 : u > ref7; y = 0 <= ref7 ? ++u : --u) {
          openCell.push([x, y]);
        }
      }
      openCell = Utl.shuffle(openCell);
      openCell.splice(0, Math.ceil(openCell.length * 0.25));
    } else if (this.openId === this.CONST.OPEN_ID.RANDOM_3) {
      for (x = w = 0, ref8 = this.x; 0 <= ref8 ? w < ref8 : w > ref8; x = 0 <= ref8 ? ++w : --w) {
        for (y = z = 0, ref9 = this.y; 0 <= ref9 ? z < ref9 : z > ref9; y = 0 <= ref9 ? ++z : --z) {
          openCell.push([x, y]);
        }
      }
      openCell = Utl.shuffle(openCell);
      openCell.splice(0, 3);
    } else if (this.openId === this.CONST.OPEN_ID.RANDOM_2) {
      for (x = aa = 0, ref10 = this.x; 0 <= ref10 ? aa < ref10 : aa > ref10; x = 0 <= ref10 ? ++aa : --aa) {
        for (y = ab = 0, ref11 = this.y; 0 <= ref11 ? ab < ref11 : ab > ref11; y = 0 <= ref11 ? ++ab : --ab) {
          openCell.push([x, y]);
        }
      }
      openCell = Utl.shuffle(openCell);
      openCell.splice(0, 2);
    } else if (this.openId === this.CONST.OPEN_ID.RANDOM_1) {
      for (x = ac = 0, ref12 = this.x; 0 <= ref12 ? ac < ref12 : ac > ref12; x = 0 <= ref12 ? ++ac : --ac) {
        for (y = ad = 0, ref13 = this.y; 0 <= ref13 ? ad < ref13 : ad > ref13; y = 0 <= ref13 ? ++ad : --ad) {
          openCell.push([x, y]);
        }
      }
      openCell = Utl.shuffle(openCell);
      openCell.splice(0, 1);
    }
    results = [];
    for (ae = 0, len = openCell.length; ae < len; ae++) {
      ref14 = openCell[ae], x = ref14[0], y = ref14[1];
      results.push($('.char[xy="' + x + '_' + y + '"]').addClass('locked').html(this.answerBoard[x][y]));
    }
    return results;
  };

  Board.prototype.drawCharPallet = function(kakusuu) {
    var char, j, len, ref, results, span;
    $('#char_pallet').html('');
    ref = window.kakusuu2c[kakusuu];
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      char = ref[j];
      span = $('<span>').addClass('pallet').html(char).on('click', function() {
        return $('.choiced').html($(this).html());
      });
      results.push($('#char_pallet').append(span));
    }
    return results;
  };

  Board.prototype.init = function() {
    var count, enableChars, initChar, initX, initY, isAlreadyTriedCount, isComplete, isEmpty, isHead, j, l, len, len1, nearCells, o, okChar, q, r, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, resChar, s, t, targetChar, targetWords, tempEnableChars, triedPatterns, u, usedChars, x, xPlus, y, yPlus;
    answerBoard = Utl.array2dFill(this.x, this.y, null);
    while (true) {
      isEmpty = true;
      for (x = j = 0, ref = this.x; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
        for (y = l = 0, ref1 = this.y; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
          if (answerBoard[x][y] !== null) {
            isEmpty = false;
            break;
          }
        }
      }
      if (isEmpty || isAlreadyTriedCount > this.x * this.y * 5) {
        answerBoard = Utl.array2dFill(this.x, this.y, null);
        usedChars = [];
        triedPatterns = [];
        isAlreadyTriedCount = 0;
        directionX = this.getDirectionX();
        directionY = this.getDirectionY();
        initX = Utl.rand(0, this.x - 1);
        initY = Utl.rand(0, this.y - 1);
        initChar = this.getCharFromFrequency(this.CONST.FIRST_CHAR_FREQUENCY);
        answerBoard[initX][initY] = initChar;
        usedChars.push(initChar);
      }
      for (x = o = 0, ref2 = this.x; 0 <= ref2 ? o < ref2 : o > ref2; x = 0 <= ref2 ? ++o : --o) {
        for (y = q = 0, ref3 = this.y; 0 <= ref3 ? q < ref3 : q > ref3; y = 0 <= ref3 ? ++q : --q) {
          if (answerBoard[x][y] !== null) {
            continue;
          }
          if (this.isAlreadyTriedPattern(triedPatterns, x, y, answerBoard, directionX, directionY)) {
            ref4 = this.eraseAroundCell(usedChars, answerBoard, x, y), usedChars = ref4[0], answerBoard = ref4[1];
            ref5 = this.eraseAroundCell(usedChars, answerBoard, x - 1, y), usedChars = ref5[0], answerBoard = ref5[1];
            ref6 = this.eraseAroundCell(usedChars, answerBoard, x + 1, y), usedChars = ref6[0], answerBoard = ref6[1];
            ref7 = this.eraseAroundCell(usedChars, answerBoard, x, y - 1), usedChars = ref7[0], answerBoard = ref7[1];
            ref8 = this.eraseAroundCell(usedChars, answerBoard, x, y + 1), usedChars = ref8[0], answerBoard = ref8[1];
            isAlreadyTriedCount++;
            continue;
          }
          nearCells = [];
          ref9 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (r = 0, len = ref9.length; r < len; r++) {
            ref10 = ref9[r], xPlus = ref10[0], yPlus = ref10[1];
            if (xPlus === 0 && yPlus === 0) {
              continue;
            }
            if (!((0 <= (ref11 = x + xPlus) && ref11 < this.x))) {
              continue;
            }
            if (!((0 <= (ref12 = y + yPlus) && ref12 < this.y))) {
              continue;
            }
            if (answerBoard[x + xPlus][y + yPlus] !== null) {
              nearCells.push([xPlus, yPlus]);
            }
          }
          if (0 < nearCells.length) {
            enableChars = null;
            for (s = 0, len1 = nearCells.length; s < len1; s++) {
              ref13 = nearCells[s], xPlus = ref13[0], yPlus = ref13[1];
              targetChar = answerBoard[x + xPlus][y + yPlus];
              if (yPlus === 0) {
                if (xPlus < 0 && directionX[x - 1][y] === 1 || xPlus > 0 && directionX[x][y] === 0) {
                  targetWords = window.wordsReverse[targetChar];
                  isHead = true;
                } else {
                  targetWords = window.words[targetChar];
                  isHead = false;
                }
              } else {
                if (yPlus < 0 && directionY[x][y - 1] === 1 || yPlus > 0 && directionY[x][y] === 0) {
                  targetWords = window.wordsReverse[targetChar];
                  isHead = true;
                } else {
                  targetWords = window.words[targetChar];
                  isHead = false;
                }
              }
              tempEnableChars = [];
              for (okChar in targetWords) {
                count = targetWords[okChar];
                if (isHead && (!window.words[okChar] || (window.words[okChar][targetChar] == null) || window.words[okChar][targetChar] < this.countRankMax2count(this.countRankMax) / 100)) {
                  continue;
                }
                if (!isHead && ((window.words[targetChar] == null) || (window.words[targetChar][okChar] == null) || window.words[targetChar][okChar] < this.countRankMax2count(this.countRankMax) / 100)) {
                  continue;
                }
                tempEnableChars.push(okChar);
              }
              enableChars = this.filterEnableChar(enableChars, tempEnableChars, usedChars);
              if (enableChars.length <= 0) {
                break;
              }
            }
            if (enableChars.length > 0) {
              resChar = enableChars[Utl.rand(0, enableChars.length - 1)];
              answerBoard[x][y] = resChar;
              usedChars.push(resChar);
            } else {
              triedPatterns.push(this.generateTriedPattern(x, y, answerBoard, directionX, directionY));
              ref14 = this.eraseAroundCell(usedChars, answerBoard, x, y), usedChars = ref14[0], answerBoard = ref14[1];
            }
          }
        }
      }
      isComplete = true;
      for (x = t = 0, ref15 = this.x; 0 <= ref15 ? t < ref15 : t > ref15; x = 0 <= ref15 ? ++t : --t) {
        for (y = u = 0, ref16 = this.y; 0 <= ref16 ? u < ref16 : u > ref16; y = 0 <= ref16 ? ++u : --u) {
          if (answerBoard[x][y] === null) {
            isComplete = false;
          }
        }
      }
      if (isComplete) {
        break;
      }
      this.outputAnswerBoard(answerBoard, directionX, directionY);
    }
    this.outputAnswerBoard(answerBoard, directionX, directionY);
    this.directionX = directionX;
    this.directionY = directionY;
    return this.answerBoard = answerBoard;
  };

  Board.prototype.filterEnableChar = function(enableChars, okChars, rejectChars) {
    var c, j, l, len, len1, res;
    if (rejectChars == null) {
      rejectChars = [];
    }
    if (enableChars === null) {
      res = [];
      for (j = 0, len = okChars.length; j < len; j++) {
        c = okChars[j];
        if (!Utl.inArray(c, rejectChars)) {
          res.push(c);
        }
      }
    } else {
      res = [];
      for (l = 0, len1 = enableChars.length; l < len1; l++) {
        c = enableChars[l];
        if (Utl.inArray(c, okChars) && !Utl.inArray(c, rejectChars)) {
          res.push(c);
        }
      }
    }
    return res;
  };

  Board.prototype.eraseAroundCell = function(usedChars, answerBoard, x, y) {
    var j, len, ref, ref1, ref2, ref3, resChar, xPlus, yPlus;
    ref = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (j = 0, len = ref.length; j < len; j++) {
      ref1 = ref[j], xPlus = ref1[0], yPlus = ref1[1];
      if (!((0 <= (ref2 = x + xPlus) && ref2 < this.x) && (0 <= (ref3 = y + yPlus) && ref3 < this.y))) {
        continue;
      }
      resChar = answerBoard[x + xPlus][y + yPlus];
      if (resChar !== null) {
        answerBoard[x + xPlus][y + yPlus] = null;
        if (usedChars.indexOf(resChar >= 0)) {
          usedChars.splice(usedChars.indexOf(resChar), 1);
        }
      }
    }
    return [usedChars, answerBoard];
  };

  Board.prototype.isAlreadyTriedPattern = function(triedPatterns, x, y, answerBoard, directionX, directionY) {
    var downChar, downDirection, j, leftChar, leftDirection, len, p, rightChar, rightDirection, upChar, upDirection;
    for (j = 0, len = triedPatterns.length; j < len; j++) {
      p = triedPatterns[j];
      if (x !== p[0]) {
        continue;
      }
      if (y !== p[1]) {
        continue;
      }
      upChar = y - 1 <= 0 ? null : answerBoard[x][y - 1];
      if (upChar !== p[2]) {
        continue;
      }
      downChar = this.y <= y + 1 ? null : answerBoard[x][y + 1];
      if (downChar !== p[3]) {
        continue;
      }
      leftChar = x - 1 <= 0 ? null : answerBoard[x - 1][y];
      if (leftChar !== p[4]) {
        continue;
      }
      rightChar = this.x <= x + 1 ? null : answerBoard[x + 1][y];
      if (rightChar !== p[5]) {
        continue;
      }
      upDirection = y - 1 < 0 ? null : directionY[x][y - 1];
      if (upDirection !== p[6]) {
        continue;
      }
      downDirection = this.y - 1 <= y ? null : directionY[x][y];
      if (downDirection !== p[7]) {
        continue;
      }
      leftDirection = x - 1 < 0 ? null : directionX[x - 1][y];
      if (leftDirection !== p[8]) {
        continue;
      }
      rightDirection = this.x - 1 <= x ? null : directionX[x][y];
      if (rightDirection !== p[9]) {
        continue;
      }
      return true;
    }
    return false;
  };

  Board.prototype.generateTriedPattern = function(x, y, answerBoard, directionX, directionY) {

    /*
    パターン
    [0]座標X
    [1]座標Y
    [2]上の文字
    [3]下の文字
    [4]左の文字
    [5]右の文字
    [6]上の矢印
    [7]下の矢印
    [8]左の矢印
    [9]右の矢印
     */
    var downChar, downDirection, leftChar, leftDirection, res, rightChar, rightDirection, upChar, upDirection;
    res = [];
    res.push(x);
    res.push(y);
    upChar = y - 1 <= 0 ? null : answerBoard[x][y - 1];
    res.push(upChar);
    downChar = this.y <= y + 1 ? null : answerBoard[x][y + 1];
    res.push(downChar);
    leftChar = x - 1 <= 0 ? null : answerBoard[x - 1][y];
    res.push(leftChar);
    rightChar = this.x <= x + 1 ? null : answerBoard[x + 1][y];
    res.push(rightChar);
    upDirection = y - 1 < 0 ? null : directionY[x][y - 1];
    res.push(upDirection);
    downDirection = this.y - 1 <= y ? null : directionY[x][y];
    res.push(downDirection);
    leftDirection = x - 1 < 0 ? null : directionX[x - 1][y];
    res.push(leftDirection);
    rightDirection = this.x - 1 <= x ? null : directionX[x][y];
    res.push(rightDirection);
    return res;
  };

  Board.prototype.getDirectionX = function() {
    var directions, j, l, ref, ref1, xIndex, yIndex;
    directions = Utl.array2dFill(this.x - 1, this.y, null);
    for (xIndex = j = 0, ref = directions.length; 0 <= ref ? j < ref : j > ref; xIndex = 0 <= ref ? ++j : --j) {
      for (yIndex = l = 0, ref1 = directions[xIndex].length; 0 <= ref1 ? l < ref1 : l > ref1; yIndex = 0 <= ref1 ? ++l : --l) {
        directions[xIndex][yIndex] = Utl.rand(0, 1);
      }
    }
    return directions;
  };

  Board.prototype.getDirectionY = function() {
    var directions, j, l, ref, ref1, xIndex, yIndex;
    directions = Utl.array2dFill(this.x, this.y - 1, null);
    for (xIndex = j = 0, ref = directions.length; 0 <= ref ? j < ref : j > ref; xIndex = 0 <= ref ? ++j : --j) {
      for (yIndex = l = 0, ref1 = directions[xIndex].length; 0 <= ref1 ? l < ref1 : l > ref1; yIndex = 0 <= ref1 ? ++l : --l) {
        directions[xIndex][yIndex] = Utl.rand(0, 1);
      }
    }
    return directions;
  };

  Board.prototype.getCharFromFrequency = function(maxDosuu, minDosuu, rejectChars) {
    var char, maxIndex, minIndex;
    if (minDosuu == null) {
      minDosuu = 0;
    }
    if (rejectChars == null) {
      rejectChars = [];
    }
    minIndex = Math.floor((window.frequencyR2CT.length - 1) * minDosuu);
    if (minIndex < 0) {
      minIndex = 0;
    }
    maxIndex = Math.ceil((window.frequencyR2CT.length - 1) * maxDosuu);
    if (window.frequencyR2CT.length <= maxIndex) {
      maxIndex = window.frequencyR2CT.length - 1;
    }
    while (true) {
      char = window.frequencyR2CT[Utl.rand(minIndex, maxIndex)][0];
      if (!Utl.inArray(char, rejectChars)) {
        return char;
      }
    }
  };

  Board.prototype.outputAnswerBoard = function(answerBoard, directionX, directionY) {
    var buf, j, l, o, ref, ref1, ref2, x, y, yArrow;
    if (answerBoard == null) {
      answerBoard = null;
    }
    if (directionX == null) {
      directionX = null;
    }
    if (directionY == null) {
      directionY = null;
    }
    if (answerBoard === null) {
      answerBoard = this.answerBoard;
    }
    if (directionX === null) {
      directionX = this.directionX;
    }
    if (directionY === null) {
      directionY = this.directionY;
    }
    buf = '';
    for (y = j = 0, ref = this.y; 0 <= ref ? j < ref : j > ref; y = 0 <= ref ? ++j : --j) {
      for (x = l = 0, ref1 = this.x; 0 <= ref1 ? l < ref1 : l > ref1; x = 0 <= ref1 ? ++l : --l) {
        if (answerBoard[x][y] !== null) {
          buf += answerBoard[x][y];
        } else {
          buf += '　';
        }
        if (directionX !== null && directionY !== null) {
          if ((directionX[x] != null) && (directionX[x][y] != null)) {
            if (directionX[x][y] === 0) {
              buf += '→';
            } else {
              buf += '←';
            }
          }
        }
      }
      buf += "\n";
      if (directionX !== null && directionY !== null) {
        if (directionY[0][y] != null) {
          yArrow = [];
          for (x = o = 0, ref2 = this.x; 0 <= ref2 ? o < ref2 : o > ref2; x = 0 <= ref2 ? ++o : --o) {
            if (directionY[x][y] != null) {
              if (directionY[x][y] === 0) {
                yArrow.push('↓');
              } else {
                yArrow.push('↑');
              }
            }
          }
          buf += yArrow.join('　') + "\n";
        }
      }
    }
    return console.log(buf);
  };

  return Board;

})();

Utl = (function() {
  function Utl() {}

  Utl.numFormat = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  Utl.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Utl.genPassword = function(length) {
    var chars, i, j, ref, res;
    if (length == null) {
      length = 4;
    }
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    res = '';
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      res += chars.substr(this.rand(0, chars.length - 1), 1);
    }
    return res;
  };

  Utl.adrBar = function(url) {
    return window.history.replaceState('', '', '' + url);
  };

  Utl.getQuery = function(key, defaultValue) {
    var j, k, len, p, params, query, ref, res, v;
    if (key == null) {
      key = null;
    }
    if (defaultValue == null) {
      defaultValue = null;
    }
    query = document.location.search.substring(1);
    params = query.split('&');
    res = {};
    for (j = 0, len = params.length; j < len; j++) {
      p = params[j];
      ref = p.split('='), k = ref[0], v = ref[1];
      res[k] = v;
    }
    if (key === null) {
      return res;
    }
    if (res[key] != null) {
      return res[key];
    }
    return defaultValue;
  };

  Utl.normalize = function(num, min, max) {
    var range;
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 1;
    }
    range = Math.abs(max - min);
    if (num < min) {
      num += range * Math.ceil(Math.abs(num - min) / range);
    } else if (max <= num) {
      num -= range * (Math.floor(Math.abs(num - max) / range) + 1);
    }
    return num;
  };

  Utl.time = function(date) {
    if (date == null) {
      date = null;
    }
    if (date === null) {
      date = new Date();
    }
    return Math.floor(+date / 1000);
  };

  Utl.militime = function(date, getAsFloat) {
    if (date == null) {
      date = null;
    }
    if (getAsFloat == null) {
      getAsFloat = false;
    }
    if (date === null) {
      date = new Date();
    }
    return +date / (getAsFloat ? 1000 : 1);
  };

  Utl.dateStr = function(date, dateSep) {
    if (date == null) {
      date = null;
    }
    if (dateSep == null) {
      dateSep = '-';
    }
    if (date === null) {
      date = new Date();
    }
    return '' + this.zerofill(date.getFullYear(), 4) + dateSep + this.zerofill(date.getMonth() + 1, 2) + dateSep + this.zerofill(date.getDate(), 2);
  };

  Utl.datetimeStr = function(date, dateSep, timeSep, betweenSep) {
    if (date == null) {
      date = null;
    }
    if (dateSep == null) {
      dateSep = '-';
    }
    if (timeSep == null) {
      timeSep = ':';
    }
    if (betweenSep == null) {
      betweenSep = ' ';
    }
    if (date === null) {
      date = new Date();
    }
    return this.dateStr(date, dateSep) + betweenSep + this.zerofill(date.getHours(), 2) + timeSep + this.zerofill(date.getMinutes(), 2) + timeSep + this.zerofill(date.getSeconds(), 2);
  };

  Utl.difftime = function(targetDate, baseDate, nowSec, nowStr, agoStr, secStr, minStr, hourStr, dayStr, monStr, yearStr) {
    var baseTime, d, diffTime, h, m, mo, targetTime, y;
    if (baseDate == null) {
      baseDate = null;
    }
    if (nowSec == null) {
      nowSec = 0;
    }
    if (nowStr == null) {
      nowStr = 'ついさっき';
    }
    if (agoStr == null) {
      agoStr = '前';
    }
    if (secStr == null) {
      secStr = '秒';
    }
    if (minStr == null) {
      minStr = '分';
    }
    if (hourStr == null) {
      hourStr = '時間';
    }
    if (dayStr == null) {
      dayStr = '日';
    }
    if (monStr == null) {
      monStr = '月';
    }
    if (yearStr == null) {
      yearStr = '年';
    }
    if (baseDate === null) {
      baseTime = this.time();
    }
    targetTime = this.time(targetDate);
    diffTime = baseTime - targetTime;
    if (diffTime < 0) {
      return null;
    }
    if (nowSec >= diffTime) {
      return nowStr;
    }
    y = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
    if (y > 0) {
      return '' + y + yearStr + agoStr;
    }
    diffTime -= y * (60 * 60 * 24 * 30 * 12);
    mo = Math.floor(diffTime / (60 * 60 * 24 * 30));
    if (mo > 0) {
      return '' + mo + monStr + agoStr;
    }
    diffTime -= mo * (60 * 60 * 24 * 30);
    d = Math.floor(diffTime / (60 * 60 * 24));
    if (d > 0) {
      return '' + d + dayStr + agoStr;
    }
    diffTime -= d * (60 * 60 * 24);
    h = Math.floor(diffTime / (60 * 60));
    if (h > 0) {
      return '' + h + hourStr + agoStr;
    }
    diffTime -= h * (60 * 60);
    m = Math.floor(diffTime / 60);
    if (m > 0) {
      return '' + m + minStr + agoStr;
    }
    diffTime -= m * 60;
    if (diffTime > 0) {
      return '' + diffTime + secStr + agoStr;
    }
    return nowStr;
  };

  Utl.zerofill = function(num, digit) {
    return ('' + this.repeat('0', digit) + num).slice(-digit);
  };

  Utl.repeat = function(str, times) {
    return Array(1 + times).join(str);
  };

  Utl.shuffle = function(ary) {
    var i, n, ref;
    n = ary.length;
    while (n) {
      n--;
      i = this.rand(0, n);
      ref = [ary[n], ary[i]], ary[i] = ref[0], ary[n] = ref[1];
    }
    return ary;
  };

  Utl.inArray = function(needle, ary) {
    var j, k, len, v;
    if ($.isArray(ary)) {
      for (j = 0, len = ary.length; j < len; j++) {
        v = ary[j];
        if (v === needle) {
          return true;
        }
      }
    } else if (ary instanceof Object) {
      for (k in obj) {
        v = obj[k];
        if (v === needle) {
          return true;
        }
      }
    }
    return false;
  };

  Utl.clone = function(obj) {
    var res;
    res = obj;
    if ($.isArray(obj)) {
      res = $.extend(true, [], obj);
    } else if (obj instanceof Object) {
      res = $.extend(true, {}, obj);
    }
    return res;
  };

  Utl.arrayFill = function(length, val) {
    var i, j, ref, res;
    if (val == null) {
      val = null;
    }
    res = [];
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      res[i] = this.clone(val);
    }
    return res;
  };

  Utl.array2dFill = function(x, y, val) {
    var j, l, ref, ref1, res, xx, yAry, yy;
    if (y == null) {
      y = null;
    }
    if (val == null) {
      val = null;
    }
    if (y === null) {
      y = x;
    }
    res = [];
    yAry = [];
    for (yy = j = 0, ref = y; 0 <= ref ? j < ref : j > ref; yy = 0 <= ref ? ++j : --j) {
      yAry[yy] = this.clone(val);
    }
    for (xx = l = 0, ref1 = x; 0 <= ref1 ? l < ref1 : l > ref1; xx = 0 <= ref1 ? ++l : --l) {
      res[xx] = this.clone(yAry);
    }
    return res;
  };

  Utl.count = function(object) {
    return Object.keys(object).length;
  };

  Utl.uuid4 = function() {
    var i, j, random, uuid;
    uuid = '';
    for (i = j = 0; j < 32; i = ++j) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? random & 3 | 8 : random)).toString(16);
    }
    return uuid;
  };

  Utl.delLs = function(key) {
    return localStorage.removeItem(key);
  };

  Utl.setLs = function(key, value) {
    var json;
    if (value == null) {
      value = null;
    }
    if (value === null) {
      return this.delLs(key);
    }
    json = JSON.stringify(value);
    return localStorage.setItem(key, json);
  };

  Utl.getLs = function(key) {
    var error, res;
    res = localStorage.getItem(key);
    try {
      res = JSON.parse(res);
    } catch (error) {
      res = null;
    }
    return res;
  };

  return Utl;

})();
