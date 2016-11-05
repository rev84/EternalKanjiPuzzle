<?php

require_once dirname(__FILE__).'/getBase.php';

$pdo = new PDOMain();

$sql = 'select * from words where bing_count is not null order by bing_count desc ';

$res = $pdo->getAll($sql);

$buf = <<<EOM
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>二次熟語の検索ヒット件数ランキング</title>
<style>
th {
    font-size: 150%;
}
td {
    font-size: 150%;
}
td.word {
    width: 100px;
    text-align: center;
}
td.count {
    width: 200px;
    text-align: right;
}
</style>
</head>
<body>
<table border="1">
<tr>
<th class="rank">順位</th>
<th class="word">熟語</th>
<th class="count">件数</th>
</tr>
EOM;

$preRank = null;
$preCount = null;
foreach ($res as $index => $r) {
    $word = $r['char1'].$r['char2'];
    $count = $r['bing_count'];
    $rank = !is_null($preRank) && $preCount == $count ? $preRank : $index+1;

    $preRank = $rank;
    $preCount = $count;

    $buf .= '<tr>';
    $buf .= '<th class="rank">'.$rank.'</th>';
    $buf .= '<td class="word">'.$word.'</td>';
    $buf .= '<td class="count">'.number_format($count).' 件</td>';
    $buf .= '</tr>';
}

$buf .= <<<EOM
</body>
</html>
EOM;

file_put_contents(dirname(__FILE__).'/ranking.html', $buf);
