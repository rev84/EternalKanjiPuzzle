<?php

require_once dirname(__FILE__).'/getBase.php';

$pdo = new PDOMain();
$sql = <<<EOM
select char1, sum(cnt) as total, kakusuu.kakusuu as kakusuu from
(
  (select char1, count(char1) as cnt from words a group by char1)
  union
  (select char2, count(char2) from words b group by char2)
) as uni
left join kakusuu on uni.char1 = kakusuu.char
group by char1
order by total desc
;
EOM;
$gen = $pdo->getLineFromGenerator($sql);

$c2kakusuu = [];
$kakusuu2c = [];

foreach ($gen as $r) {
    $c = $r['char1'];
    $kakusuu = $r['kakusuu'];

    $c2kakusuu[$c] = (int)$kakusuu;

    if (!array_key_exists($kakusuu, $kakusuu2c)) $kakusuu2c[$kakusuu] = [];
    $kakusuu2c[$kakusuu][] = $c;
}

file_put_contents(dirname(__FILE__).'/json/kakusuu.js', 'window.c2kakusuu='.json_encode($c2kakusuu).';window.kakusuu2c='.json_encode($kakusuu2c).';');
file_put_contents(dirname(__FILE__).'/../../js/kakusuu.js', 'window.c2kakusuu='.json_encode($c2kakusuu).';window.kakusuu2c='.json_encode($kakusuu2c).';');
