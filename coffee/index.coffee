$().ready ->
  newGame()
  $('#regenerate').on 'click', newGame

newGame = ->
  switchLoading true

  xy = Number $('#config_xy').val()
  openId = Number $('#config_open_id').val()
  countRankMax = Number $('#config_count_rank_max').val()

  window.board = new Board(xy, xy, openId, countRankMax)
  
  switchLoading false

switchLoading = (bool)->
  if bool
    $('.loading').removeClass('no_display')
  else
    $('.loading').addClass('no_display')

class Board
  CONST :
    # 最初の文字の出現頻度の度数下限
    FIRST_CHAR_FREQUENCY : 0.2
    # セルのサイズ
    CELL_SIZE : 100
    # オープンするセル
    OPEN_ID :
      ICHIMATU : 1
      DIAGONAL : 2
      RANDOM_50 : 3
      RANDOM_25 : 4
      RANDOM_3 : 5
      RANDOM_2 : 6
      RANDOM_1 : 7
      NONE : 8

  answerBoard = null
  directionX = null
  directionY = null

  constructor:(@x, @y, @openId, @countRankMax)->
    @init()
    @initDraw()
    @open()

  countRankMax2count:(countRankMax)->
    switch countRankMax
      when 10
        1980000
      when 20
        567000
      when 30
        166000
      when 40
        62600
      when 50
        29700
      when 60
        12200
      when 70
        5230
      when 80
        2720
      else
        0

  initDraw:->
    $('#field').html('')

    table = $('<table>').addClass('game_table')
                        .css('width', ''+(@x*@CONST.CELL_SIZE + (@x-1)*(@CONST.CELL_SIZE/4))+'px')
                        .css('height', ''+(@y*@CONST.CELL_SIZE + (@y-1)*(@CONST.CELL_SIZE/4))+'px')
    for y in [0...@y]
      tr = $('<tr>')
      for x in [0...@x]
        kakusuu = window.c2kakusuu[@answerBoard[x][y]]
        td = $('<td>').addClass('cell').css('width', ''+@CONST.CELL_SIZE+'px').css('height', ''+@CONST.CELL_SIZE+'px')
        text = $('<span>').addClass('char')
               .data('kakusuu', kakusuu)
               .attr('x', x)
               .attr('y', y)
               .attr('xy', ''+x+'_'+y)
               .css('width', ''+@CONST.CELL_SIZE+'px')
               .css('height', ''+@CONST.CELL_SIZE+'px')
               .css('font-size', ''+(@CONST.CELL_SIZE*0.5)+'px')
               .css('line-height', ''+(@CONST.CELL_SIZE)+'px')
               .on('click', ->
                  return if $(@).hasClass('locked')
                  $('.char').removeClass('choiced')
                  $(@).addClass('choiced')
                  window.board.drawCharPallet($(@).data('kakusuu'))
               )
        hint = $('<span>').addClass('hint').html(kakusuu)
        
        td.append(text).append(hint)
        tr.append(td)

        # 横向き矢印
        if @directionX[x]? and @directionX[x][y]?
          if @directionX[x][y] is 0
            img = $('<img>').attr('src', './img/left.png')
          else
            img = $('<img>').attr('src', './img/right.png')
          img.css('max-height', ''+(@CONST.CELL_SIZE/5)+'px')
             .css('max-width', ''+(@CONST.CELL_SIZE/5)+'px')
          td = $('<td>').addClass('arrow')
                        .css('width', ''+(@CONST.CELL_SIZE/4)+'px')
                        .css('font-size', ''+(@CONST.CELL_SIZE/4)+'px')
                        .append(img)
          tr.append td

        table.append(tr)

      # 縦向き矢印
      if @directionY[0]? and @directionY[0][y]?
        tr = $('<tr>')
        for x in [0...@x]
          if @directionY[x][y] is 0
            img = $('<img>').attr('src', './img/down.png')
          else
            img = $('<img>').attr('src', './img/up.png')
          img.css('max-height', ''+(@CONST.CELL_SIZE/5)+'px')
             .css('max-width', ''+(@CONST.CELL_SIZE/5)+'px')
          td = $('<td>').addClass('arrow')
                        .css('height', ''+(@CONST.CELL_SIZE/4)+'px')
                        .append(img)
          tr.append td
          tr.append $('<td>') unless x is @x-1
        table.append(tr)

    $('#field').append(table)

  open:->
    openCell = []
    # 市松模様
    if @openId is @CONST.OPEN_ID.ICHIMATU
      for x in [0...@x]
        for y in [0...@y]
          if (x + y) % 2 is 0
            openCell.push [x, y]
    # 対角線
    else if @openId is @CONST.OPEN_ID.DIAGONAL
      for x in [0...@x]
        for y in [0...@y]
          if x is y
            openCell.push [x, y]
    # ランダム割合50
    else if @openId is @CONST.OPEN_ID.RANDOM_50
      for x in [0...@x]
        for y in [0...@y]
          openCell.push [x, y]
      openCell = Utl.shuffle openCell
      openCell.splice 0, Math.ceil(openCell.length*0.5)
    # ランダム割合25
    else if @openId is @CONST.OPEN_ID.RANDOM_25
      for x in [0...@x]
        for y in [0...@y]
          openCell.push [x, y]
      openCell = Utl.shuffle openCell
      openCell.splice 0, Math.ceil(openCell.length*0.25)
    # ランダム個数3
    else if @openId is @CONST.OPEN_ID.RANDOM_3
      for x in [0...@x]
        for y in [0...@y]
          openCell.push [x, y]
      openCell = Utl.shuffle openCell
      openCell.splice 0, 3
    # ランダム個数2
    else if @openId is @CONST.OPEN_ID.RANDOM_2
      for x in [0...@x]
        for y in [0...@y]
          openCell.push [x, y]
      openCell = Utl.shuffle openCell
      openCell.splice 0, 2
    # ランダム個数1
    else if @openId is @CONST.OPEN_ID.RANDOM_1
      for x in [0...@x]
        for y in [0...@y]
          openCell.push [x, y]
      openCell = Utl.shuffle openCell
      openCell.splice 0, 1

    for [x, y] in openCell
      $('.char[xy="'+x+'_'+y+'"]').addClass('locked').html(@answerBoard[x][y])

  drawCharPallet:(kakusuu)->
    $('#char_pallet').html('')
    for char in window.kakusuu2c[kakusuu]
      span = $('<span>').addClass('pallet').html(char).on('click', ->
        $('.choiced').html($(@).html())
      )
      $('#char_pallet').append(span)


  init:->
    # 文字が入るところ
    answerBoard = Utl.array2dFill @x, @y, null

    # 全マス埋まるまでやる
    while true
      # もし全マス何もなければ、適当に置く
      isEmpty = true
      for x in [0...@x]
        for y in [0...@y]
          if answerBoard[x][y] isnt null
            isEmpty = false
            break
      if isEmpty or isAlreadyTriedCount > @x*@y*5
        # 盤面リセット
        answerBoard = Utl.array2dFill @x, @y, null
        # 使用済み文字リセット
        usedChars = []
        # 試行済パターンリセット
        triedPatterns = []
        # 試行済に引っかかった回数もリセット
        isAlreadyTriedCount = 0
        # 方角もリセット
        directionX = @getDirectionX()
        directionY = @getDirectionY()
        # ランダムに文字を入れるところを決める
        initX = Utl.rand 0, @x-1
        initY = Utl.rand 0, @y-1
        # とりあえず上位20%
        initChar = @getCharFromFrequency @CONST.FIRST_CHAR_FREQUENCY
        answerBoard[initX][initY] = initChar
        usedChars.push initChar

      # 既存のマスに隣接する場所を探す
      for x in [0...@x]
        for y in [0...@y]
          # 何か書いてあれば飛ばす
          continue if answerBoard[x][y] isnt null

          # もうやったパターンだったら消して次
          if @isAlreadyTriedPattern(triedPatterns, x, y, answerBoard, directionX, directionY)
            # 周りの文字を2段階ぜんぶ消す
            [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x, y)
            [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x-1, y)
            [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x+1, y)
            [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x, y-1)
            [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x, y+1)
            isAlreadyTriedCount++
            continue


          # 上下左右調査
          nearCells = []
          for [xPlus, yPlus] in [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
            # 自分、範囲外は飛ばす
            continue if xPlus is 0 and yPlus is 0
            continue unless 0 <= x+xPlus < @x
            continue unless 0 <= y+yPlus < @y
            # あれば追加
            nearCells.push [xPlus, yPlus] if answerBoard[x+xPlus][y+yPlus] isnt null
          # 隣接マスがある
          if 0 < nearCells.length
            # 使える文字
            enableChars = null

            # その隣接マスすべてに合致する文字を探す
            for [xPlus, yPlus] in nearCells
              # 対象文字
              targetChar = answerBoard[x+xPlus][y+yPlus]
              # x方向
              if yPlus is 0
                # 自分が頭文字
                if xPlus < 0 and directionX[x-1][y] is 1 or xPlus > 0 and directionX[x][y] is 0
                  targetWords = window.wordsReverse[targetChar]
                  isHead = true
                # 自分が尻の文字
                else
                  targetWords = window.words[targetChar]
                  isHead = false
              # y方向
              else
                # 自分が頭文字
                if yPlus < 0 and directionY[x][y-1] is 1 or yPlus > 0 and directionY[x][y] is 0
                  targetWords = window.wordsReverse[targetChar]
                  isHead = true
                # 自分が尻の文字
                else
                  targetWords = window.words[targetChar]
                  isHead = false
              # その組み合わせで使える文字を返す
              tempEnableChars = []
              for okChar, count of targetWords
                # 単語として規定の件数を超えていない場合は飛ばす
                continue if isHead and (not window.words[okChar] or not window.words[okChar][targetChar]? or window.words[okChar][targetChar] < @countRankMax2count(@countRankMax) / 100)
                continue if not isHead and (not window.words[targetChar]? or not window.words[targetChar][okChar]? or window.words[targetChar][okChar] < @countRankMax2count(@countRankMax) / 100)
                tempEnableChars.push okChar
              # フィルタする
              enableChars = @filterEnableChar enableChars, tempEnableChars, usedChars

              # もしフィルタによって使える文字がなくなったら
              if enableChars.length <= 0
                # 有効な組み合わせがないので、これ以上の探索は無駄。抜ける
                break

            # すべての条件をクリアして、文字の候補が残った
            if enableChars.length > 0
              # ランダムな文字を設定
              resChar = enableChars[Utl.rand(0, enableChars.length-1)]
              answerBoard[x][y] = resChar
              usedChars.push resChar
            # 使える文字がなかった
            else
              # ダメだったパターンを記憶
              triedPatterns.push @generateTriedPattern(x, y, answerBoard, directionX, directionY)
              # 周りの文字をぜんぶ消す
              [usedChars, answerBoard] = @eraseAroundCell(usedChars, answerBoard, x, y)

      # 全マス埋まっていれば終わり
      isComplete = true
      for x in [0...@x]
        for y in [0...@y]
          isComplete = false if answerBoard[x][y] is null
      if isComplete
        break
      @outputAnswerBoard answerBoard, directionX, directionY

    @outputAnswerBoard answerBoard, directionX, directionY

    @directionX = directionX
    @directionY = directionY
    @answerBoard = answerBoard

  # 文字をフィルタする
  filterEnableChar:(enableChars, okChars, rejectChars = [])->
    # 使える文字が未初期化なら、使える文字をそのまま返す
    if enableChars is null
      res = []
      for c in okChars
        res.push c if not Utl.inArray(c, rejectChars)
    # 初期化済なら、フィルタする
    else
      res = []
      for c in enableChars
        res.push c if Utl.inArray(c, okChars) and not Utl.inArray(c, rejectChars)
    res

  # 周りの文字をすべて消す処理
  eraseAroundCell:(usedChars, answerBoard, x, y)->
    for [xPlus, yPlus] in [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
      continue unless 0 <= x+xPlus < @x and 0 <= y+yPlus < @y
      resChar = answerBoard[x+xPlus][y+yPlus]
      if resChar isnt null
        answerBoard[x+xPlus][y+yPlus] = null
        usedChars.splice(usedChars.indexOf(resChar), 1) if usedChars.indexOf resChar >= 0
    [usedChars, answerBoard]

  # ダメだったパターンと照合。もうあったら
  isAlreadyTriedPattern:(triedPatterns, x, y, answerBoard, directionX, directionY)->
    for p in triedPatterns
      #[0]座標X
      continue if x isnt p[0]
      #[1]座標Y
      continue if y isnt p[1]
      #[2]上の文字
      upChar = if y-1 <= 0 then null else answerBoard[x][y-1]
      continue if upChar isnt p[2]
      #[3]下の文字
      downChar = if @y <= y+1 then null else answerBoard[x][y+1]
      continue if downChar isnt p[3]
      #[4]左の文字
      leftChar = if x-1 <= 0 then null else answerBoard[x-1][y]
      continue if leftChar isnt p[4]
      #[5]右の文字
      rightChar = if @x <= x+1 then null else answerBoard[x+1][y]
      continue if rightChar isnt p[5]
      #[6]上の矢印
      upDirection = if y-1 < 0 then null else directionY[x][y-1]
      continue if upDirection isnt p[6]
      #[7]下の矢印
      downDirection = if @y-1 <= y then null else directionY[x][y]
      continue if downDirection isnt p[7]
      #[8]左の矢印
      leftDirection = if x-1 < 0 then null else directionX[x-1][y]
      continue if leftDirection isnt p[8]
      #[9]右の矢印
      rightDirection = if @x-1 <= x then null else directionX[x][y]
      continue if rightDirection isnt p[9]

      return true
    false

  # 盤面などから、ダメだったパターンの配列を生成
  generateTriedPattern:(x, y, answerBoard, directionX, directionY)->
    ###
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
    ###

    res = []
    #[0]座標X
    res.push x
    #[1]座標Y
    res.push y
    #[2]上の文字
    upChar = if y-1 <= 0 then null else answerBoard[x][y-1]
    res.push upChar
    #[3]下の文字
    downChar = if @y <= y+1 then null else answerBoard[x][y+1]
    res.push downChar
    #[4]左の文字
    leftChar = if x-1 <= 0 then null else answerBoard[x-1][y]
    res.push leftChar
    #[5]右の文字
    rightChar = if @x <= x+1 then null else answerBoard[x+1][y]
    res.push rightChar
    #[6]上の矢印
    upDirection = if y-1 < 0 then null else directionY[x][y-1]
    res.push upDirection
    #[7]下の矢印
    downDirection = if @y-1 <= y then null else directionY[x][y]
    res.push downDirection
    #[8]左の矢印
    leftDirection = if x-1 < 0 then null else directionX[x-1][y]
    res.push leftDirection
    #[9]右の矢印
    rightDirection = if @x-1 <= x then null else directionX[x][y]
    res.push rightDirection

    res

  # 0:順方向（右）、1:逆方向（左）
  getDirectionX:->
    directions = Utl.array2dFill @x-1, @y, null
    for xIndex in [0...directions.length]
      for yIndex in [0...directions[xIndex].length]
        directions[xIndex][yIndex] = Utl.rand(0, 1)
    directions

  # 0:順方向（下）、1:逆方向（上）
  getDirectionY:->
    directions = Utl.array2dFill @x, @y-1, null
    for xIndex in [0...directions.length]
      for yIndex in [0...directions[xIndex].length]
        directions[xIndex][yIndex] = Utl.rand(0, 1)
    directions

  # 頻度の度数範囲で文字をランダムチョイス
  getCharFromFrequency:(maxDosuu, minDosuu = 0, rejectChars = [])->
    minIndex = Math.floor((window.frequencyR2CT.length-1) * minDosuu)
    minIndex = 0 if minIndex < 0
    maxIndex = Math.ceil((window.frequencyR2CT.length-1) * maxDosuu)
    maxIndex = window.frequencyR2CT.length-1 if window.frequencyR2CT.length <= maxIndex

    while true
      char = window.frequencyR2CT[Utl.rand(minIndex, maxIndex)][0]
      return char unless Utl.inArray char, rejectChars

  outputAnswerBoard:(answerBoard = null, directionX = null, directionY = null)->
    answerBoard = @answerBoard if answerBoard is null
    directionX = @directionX if directionX is null
    directionY = @directionY if directionY is null

    buf = ''
    for y in [0...@y]
      for x in [0...@x]
        if answerBoard[x][y] isnt null
          buf += answerBoard[x][y]
        else
          buf += '　'
        # 矢印
        if directionX isnt null and directionY isnt null
          if directionX[x]? and directionX[x][y]?
            if directionX[x][y] is 0
              buf += '→'
            else
              buf += '←'
      buf += "\n"
      # 矢印
      if directionX isnt null and directionY isnt null
        if directionY[0][y]?
          yArrow = []
          for x in [0...@x]
            if directionY[x][y]?
              if directionY[x][y] is 0
                yArrow.push '↓'
              else
                yArrow.push '↑'
          buf += yArrow.join('　')+"\n"
    console.log buf