<?php

require_once dirname(__FILE__).'/getBase.php';
require_once dirname(__FILE__).'/Goutte-master/crawler/vendor/autoload.php';

use GuzzleHttp\Client as GuzzleClient;
use Goutte\Client;

$pdo = new PDOMain();
//$sql = 'select * from words where bing_count is null order by rand() ';
$selectSql = 'select * from words where bing_count is null order by rand() limit 1 ';
//$gen = $pdo->getLineFromGenerator($sql);

//foreach ($gen as $r) {
while (false !== ($r = $pdo->getLine($selectSql))) {
    $word = $r['char1'].$r['char2'];
    //echo("「".$word."」を検索中...");

    $proxyIp = ProxtList::getProxyIp();
    $html = getHtml($proxyIp, $word);

    // 200
    if ($html !== false) {

      file_put_contents(dirname(__FILE__).'/bing_count_scraping/'.$word.'.html', $html);
      // 件数
      $res = preg_match('`<span class="sb_count">([\d\,]+) 件の検索結果</span>`is', $html, $matches);

      // 件数あり
      if ($res) {
          $count = preg_replace('`[^\d]`', '', $matches[1]);
          $pdo = new PDOMain();
          $updateSql = 'update words set bing_count = ? where char1 = ? and char2 = ? ';
          $pdo->executeSql($updateSql, [$count, $r['char1'], $r['char2']]);

          echo("「".$word."」を検索...".$count.'件ヒット'.'(IP:'.$proxyIp.')'."\n");
      }
      else {
          echo("「".$word."」を検索...ヒットせず".'(IP:'.$proxyIp.')'."\n");
      }
    }
    // 200以外
    else {
    }
}

function getHtml($proxyIp, $word) {
    $client = new Client();

    $crawler = $client->request('GET', 'http://www.bing.com/search?q="'.urlencode($word).'"&lf=1', [
        'proxy' => 'tcp://'.$proxyIp,
    ]);
    //echo '(IP:'.$proxyIp.')...';
    return $crawler->html();
}

class ProxtList {
    public static function getProxyIp() {
        $proxy = [
            "122.96.59.102:81",
            "31.214.144.178:80",
            "122.96.59.102:80",
            "93.51.247.104:80",
            "201.55.46.6:80",
            "111.23.4.155:80",
            "47.88.195.233:3128",
            "111.23.4.155:8080",
            "82.237.102.143:8000 ",
            "103.27.24.236:80 ",
            "54.187.52.159:80",
            "62.113.208.183:3128",
            "202.171.253.72:80",
            "123.30.238.16:3128",
            "58.96.172.205:8888",
            "203.88.166.141:3128",
            "5.196.44.136:3128",
            "23.91.96.251:80",
            "23.91.97.54:80",
            "201.55.46.6:80",
            "128.199.190.72:8080",
            "203.223.143.51:8080",
            "213.16.167.147:80",
            "50.206.36.254:3128",
            "119.15.169.113:3128",
            "47.90.9.74:80",
            "187.18.123.47:3128",
            "193.194.69.36:3128",
            "103.253.145.86:8080",
            "87.98.219.96:8080",
            "47.88.195.233:3128",
            "97.77.104.22:80",
            "178.22.148.122:3129",
            "82.99.180.94:8080",
            "197.5.128.1:8080",
            "149.56.206.48:8080",
            "5.196.66.98:80",
            "94.177.164.72:80",
            "89.38.150.223:2824",
            "212.34.130.195:3128",
            "23.105.173.133:8118",
            "104.28.26.119:80",
            "104.28.0.10:80",
            "104.28.3.0:80",
            "107.183.231.174:8118",
            "23.105.78.252:8118",
            "104.28.9.5:80",
            "104.131.75.65:80",
            "104.28.2.15:80",
            "104.28.28.114:80",
            "219.129.164.122:3128",
            "46.101.7.133:8118",
            "104.28.2.100:80",
            "104.28.26.194:80",
            "23.105.39.107:8118",
            "104.28.17.121:80",
            "104.28.1.153:80",
            "104.129.10.202:80",
            "107.183.253.144:8118",
            "202.83.19.191:8080",
            "37.139.9.11:80",
            "104.28.8.170:80",
            "118.168.73.149:8080",
            "23.105.174.195:8118",
            "23.245.167.160:8118",
            "04.28.3.204:80",
            "104.140.209.82:8800",
            "104.28.28.17:80",
            "104.28.10.148:80",
            "153.149.163.142:3128",
            "104.28.6.32:80",
            "122.224.227.202:3128",
            "103.214.173.216:8080",
            "172.246.244.160:8800",
            "23.108.75.180:8118",
            "103.238.240.178:8080",
            "23.108.78.169:8118",
            "80.14.12.161:80",
            "104.28.10.67:80",
            "104.28.16.184:80",
            "103.48.25.30:8080",
            "186.179.109.77:8080",
            "107.183.231.242:8118",
            "104.28.6.24:80",
            "23.108.15.252:8118",
            "190.203.107.222:3128",
            "153.149.158.127:3128",
            "23.108.15.174:8118",
            "104.28.16.222:80",
            "89.42.147.239:8800",
        ];

        return $proxy[mt_rand(0, count($proxy)-1)];
    }
}

class ProxyClient {
    private $proxyIp;
    public function __construct($proxyIp)
    {
        $this->proxyIp = $proxyIp;
    }
    public function getClientInstance()
    {
        $gclient = new GuzzleClient([
            'defaults' => [
                'proxy'   => 'tcp://'.$this->proxyIp
            ]
        ]);
        // ユーザーエージェントの取得(自前)
        $useragent = HttpHeaderUtil::getUserAgent();
        $client = new Client(['HTTP_USER_AGENT'=>$useragent]);
        $client = $client->setClient($gclient);
        $client->getClient()->setDefaultOption('config/curl/'.CURLOPT_TIMEOUT,60);
        return $client;
    }
}
class HttpHeaderUtil {
    protected static $_uas = null;
    public static function getUserAgent() {
        if (is_null(self::$_uas)) {
            $file = file_get_contents(dirname(__FILE__).'/ua.txt');
            self::$_uas = explode("\n", $file);
        }

        return self::$_uas[mt_rand(0, count(self::$_uas)-1)];
    }
}
