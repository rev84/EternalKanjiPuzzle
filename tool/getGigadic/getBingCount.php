<?php

require_once 'HTTP/Request2.php';

//define('API_KEY', '5b676f1e51214aefbdbc35e3c0c2b749');
define('API_KEY', '3a1e17fa1ef94924aa846842312390ff');

function getJson($word)
{

    $request = new Http_Request2('https://api.cognitive.microsoft.com/bing/v5.0/search');
    $url = $request->getUrl();

    $headers = array(
        // Request headers
        'Ocp-Apim-Subscription-Key' => API_KEY,
    );

    $request->setHeader($headers);

    $parameters = [
        'q' => '"'.$word.'"',
        'count' => '10',
        'offset' => '0',
        'mkt' => 'ja-JP',
        'safesearch' => 'Off',
    ];

    $url->setQueryVariables($parameters);

    $request->setMethod(HTTP_Request2::METHOD_GET);

    // Request body
    $request->setBody("{body}");

    try
    {
        $response = $request->send();
        return $response->getBody();
    }
    catch (HttpException $ex)
    {
        echo $ex;
    }
}

$pdo = new PDOMain();

//$sql = 'select * from words order by rand() ';
$sql = 'select * from words where bing_count is null order by rand() ';
$gen = $pdo->getLineFromGenerator($sql);

foreach ($gen as $r) {
    $word = $r['char1'].$r['char2'];
    echo("「".$word."」を検索中...");

    $json = getJson($word);

    // 200
    if ($json !== false) {

      file_put_contents(dirname(__FILE__).'/bing_count/'.$word.'.json', $json);

      $jsonArray = json_decode($json, true);
      // 件数
      $count = $jsonArray['webPages']['totalEstimatedMatches'];

      $pdo = new PDOMain();
      $sql = 'update words set bing_count = ? where char1 = ? and char2 = ? ';
      $pdo->executeSql($sql, [$count, $r['char1'], $r['char2']]);

      echo($count.'件ヒット');

      echo "\n";

      sleep(1);
    }
    // 200以外
    else {
      sleep(180);
    }
}





function echoSjis($str)
{
    echo mb_convert_encoding($str, 'SJIS', 'UTF-8');
}

function var_dump_file($var, $filename = './var_dump.txt'){
    if(file_exists($filename)){
        unlink($filename);
    }
    ob_start();
    var_dump($var);
    $out = ob_get_contents();
    ob_end_clean();
    file_put_contents($filename, $out, FILE_APPEND);

    return true;
}

/**
 * PDOを拡張したクラス
 *
 * @author revin
 */
class PDOBase extends PDO
{
    const DB_NAME = null;
    // コミット時に削除するメモキャッシュ
    protected $_deleteMemcachedKeys = [];
    
    public function __construct() {
        parent::__construct(
            'mysql:host='.static::getHost().';dbname='.static::DB_NAME.';port='.static::getPort().'',
            static::getUsername(),
            static::getPassword()
        );
        $this->query('SET NAMES utf8;');
        // fetch時に数値型を文字列型で返すのを止めようとしたが、意味ないらしい
        //$this->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
    }
    
    /**
     * トランザクション開始と同時に、メモキャッシュの削除キーをクリアする
     * @return type
     */
    public function beginTransaction()
    {
        $this->_deleteMemcachedKeys = [];
        return parent::beginTransaction();
    }
    
    /**
     * コミットと同時に、メモキャッシュの特定のキーを削除する
     * @return type
     */
    public function commit()
    {
        $res = parent::commit();
        $this->deleteMemcached();
        return $res;
    }
    
    /**
     * 削除するメモキャッシュのキーを追加
     * @param type $key
     * @return boolean
     */
    public function addMemcachedKey($key)
    {
        if (in_array($key, $this->_deleteMemcachedKeys)) return true;
        
        $this->_deleteMemcachedKeys[] = $key;
        return true;
    }
    
    /**
     * 登録されているキーをメモキャッシュから削除
     * @return boolean
     */
    protected function deleteMemcached()
    {
        $mem = static::getMemcachedInstance();
        if ($mem !== false) {
            foreach ($this->_deleteMemcachedKeys as $key) {
                $mem->delete($key);
            }
        }
        
        $this->_deleteMemcachedKeys = [];
        
        return true;
    }
    
    /**
     * メモキャッシュのベースクラスを取得するようにオーバーライド
     * @return MyMemcachedBase|false
     */
    protected static function getMemcachedInstance()
    {
        return false;
    }
    
    /**
     * ホストを取得
     * @see オーバーライドすること
     */
    protected static function getHost()
    {
    }
    
    /**
     * ポートを取得
     * @see オーバーライドすること
     */
    protected static function getPort()
    {
    }
    
    /**
     * ユーザ名を取得
     * @see オーバーライドすること
     */
    protected static function getUsername()
    {
        return 'rev84pg';
    }

    /**
     * パスワードを取得
     * @see オーバーライドすること
     */
    protected static function getPassword()
    {
        return 'f8jjpcg7';
    }

    
    /**
     * SQLを単に実行
     * @param type $sql
     * @param type $params
     * @return boolean
     */
    public function executeSql($sql, $params = []) {
        if (false === ($stm = $this->prepare($sql))) {
            return false;
        }
        return $stm->execute($params);
    }
    
    /**
     * SQLを単に実行、作用した行数を返す
     * @param type $sql
     * @param type $params
     * @return int|false
     */
    public function executeSqlReturnRowCount($sql, $params = []) {
        if (false === ($stm = $this->prepare($sql))) {
            return false;
        }
        $res = $stm->execute($params);
        if (false === $res) return false;
        return $stm->rowCount();
    }
    
    /**
     * 要素をひとつだけ返す
     * @param type $sql
     * @param type $params
     * @return boolean
     */
    public function getOne($sql, $params = []) {
        if (false === ($stm = $this->prepare($sql))) {
            return false;
        }
        if (false === $stm->execute($params)) {
            return false;
        }
        return $stm->fetchColumn();
    }
    
    /**
     * 要素を一行だけ返す
     * @param type $sql
     * @param type $params
     * @return boolean
     */
    public function getLine($sql, $params = []) {
        if (false === ($stm = $this->prepare($sql))) {
            return false;
        }
        if (false === $stm->execute($params)) {
            return false;
        }
        return $stm->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * 要素を一行だけ返す
     * @param type $sql
     * @param type $params
     * @return boolean
     */
    public function getAll($sql, $params = []) {
        if (false === ($stm = $this->prepare($sql))) {
            return false;
        }
        if (false === $stm->execute($params)) {
            return false;
        }
        return $stm->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * ジェネレータを利用して次々と行を取得する
     * @param string $sql
     * @param array $params
     * @return boolean
     */
    public function getLineFromGenerator($sql, $params = [])
    {
        if (false === ($stm = $this->prepare($sql))) {
            return;
        }
        if (false === $stm->execute($params)) {
            return;
        }
        while ($res = $stm->fetch(PDO::FETCH_ASSOC)) {
            yield $res;
        }
    }
}


class PDOMain extends PDOBase
{
    const DB_NAME = 'jukugo';
    /**
     * ホストを取得
     * @return string
     * @throws Exception
     */
    protected static function getHost()
    {
        $res = 'localhost';
        
        if ($res === false) {
            throw new PDOException('invalid mysql host');
        }
        
        return $res;
    }
    
    /**
     * ポートを取得
     * @return int
     * @throws Exception
     */
    protected static function getPort()
    {
        $res = 3306;
        
        if ($res === false) {
            throw new PDOException('invalid mysql port');
        }
        
        return $res;
    }
    
    /**
     * メモキャッシュのベースクラスを取得するようにオーバーライド
     * @return MyMemcachedBase
     */
    protected static function getMemcachedInstance()
    {
        return MyMemcached::getDbh();
    }

}
