<?php

require_once dirname(__FILE__).'/getBase.php';

$pdo = new PDOMain();
$sql = <<<EOM
select char1, sum(cnt) as total from
(
(select char1, count(char1) as cnt from words a group by char1)
union
(select char2, count(char2) from words b group by char2)
) as uni
group by char1
order by total desc
;
EOM;
$gen = $pdo->getLineFromGenerator($sql);

$char2total = [];
$rank2charTotal = [];

foreach ($gen as $r) {
    $c = $r['char1'];
    $total = $r['total'];

    $char2total[$c] = (int)$total;

    $rank2charTotal[] = [$c, (int)$total];
}

file_put_contents(dirname(__FILE__).'/json/frequency.js', 'window.frequencyC2T='.json_encode($char2total).';window.frequencyR2CT='.json_encode($rank2charTotal).';');
file_put_contents(dirname(__FILE__).'/../../js/frequency.js', 'window.frequencyC2T='.json_encode($char2total).';window.frequencyR2CT='.json_encode($rank2charTotal).';');
