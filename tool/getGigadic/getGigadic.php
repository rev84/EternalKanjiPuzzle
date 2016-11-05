<?php

define('OUTPUT_DIR', dirname(__FILE__).'/result');

$kanas = [
    'あ','い','う','え','お',
    'か','き','く','け','こ',
    'さ','し','す','せ','そ',
    'た','ち','つ','て','と',
    'な','に','ぬ','ね','の',
    'は','ひ','ふ','へ','ほ',
    'ま','み','む','め','も',
    'や','ゆ','よ',
    'ら','り','る','れ','ろ',
    'わ','を','ん',
    'が','ぎ','ぐ','げ','ご',
    'ざ','じ','ず','ぜ','ぞ',
    'だ','ぢ','づ','で','ど',
    'ば','び','ぶ','べ','ぼ',
    'ぱ','ぴ','ぷ','ぺ','ぽ',
];

foreach ($kanas as $index => $kana) {
    echoSjis("「".$kana."」取得中...");
    
    $html = file_get_contents('http://gigadict.com/cgi-bin/Kanji/dicJKK.cgi?mode=search&word='.$kana.'&action=0&page_max=100000');
    file_put_contents(OUTPUT_DIR.'/'.mb_convert_encoding($kana, 'SJIS', 'UTF-8').'.html', $html);
    
    echoSjis("完了\n");
    
    sleep(5);
}

function echoSjis($str)
{
    echo mb_convert_encoding($str, 'SJIS', 'UTF-8');
}