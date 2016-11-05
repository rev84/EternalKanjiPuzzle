<?php

require_once dirname(__FILE__).'/getBase.php';

$pdo = new PDOMain();
$sql = 'select * from words ';
$gen = $pdo->getLineFromGenerator($sql);

$words = [];
$wordsReverse = [];
foreach ($gen as $r) {
    $c1 = $r['char1'];
    $c2 = $r['char2'];
    $count = $r['bing_count'];

    if (!array_key_exists($c1, $words)) $words[$c1] = [];
    if (!array_key_exists($c2, $wordsReverse)) $wordsReverse[$c2] = [];

    $words[$c1][$c2] = (int)ceil($count / 100);
    $wordsReverse[$c2][$c1] = (int)ceil($count / 100);
}

file_put_contents(dirname(__FILE__).'/json/words.js', 'window.words='.json_encode($words).';window.wordsReverse='.json_encode($wordsReverse).';');
file_put_contents(dirname(__FILE__).'/../../js/words.js', 'window.words='.json_encode($words).';window.wordsReverse='.json_encode($wordsReverse).';');
