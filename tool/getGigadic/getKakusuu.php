<?php

require_once dirname(__FILE__).'/getBase.php';

$pdo = new PDOMain();

for ($index = 1; $index <= 30; $index++) {
  $indexZerofill = sprintf('%02d', $index);
  $html = file_get_contents('http://kanji.jitenon.jp/cat/kakusu'.$indexZerofill.'.html');

  preg_match_all('`<td class="normalbg">(.+?)</td>`is', $html, $matches);

  foreach ($matches[1] as $string) {
    $string = preg_replace('`<.*?>`is', '', $string);

    $sql = 'replace into kakusuu (`char`, kakusuu) values (?,?) ';
    $pdo->executeSql($sql, [$string, $index]);
  }
}

