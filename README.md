# Dreploy

Continuously deploy projects to server via SFTP.

## Installation

```bash
$ npm install --global dreploy
```

## Usage

Let's say you want to deploy a new project;

1. Create a project to be deployed
    ```bash
    $ mkdir prj
    $ cd prj
    ```

2. Create a `package.json` file
    ```bash
    $ npm init -y
    ```

3. Write some code
    ```bash
    $ echo "console.log('hello world');" > index.js
    ```

4. Initialize the deploy target for the project
    ```bash
    $ dreploy init -y
    ```

5. Open newly created `.dreployrc.json` and edit to suit your needs (see [Configuration](#configuration) section for details). Do not forget to add `"index.js"` to `local.files` array in the deploy target file.
    * On *nix
      ```bash
      $ $EDITOR .dreployrc.json
      ```

    * On Windows
      ```bash
      > notepad .dreployrc.json
      ```

6. Deploy the project
    ```bash
    $ dreploy
    ```

## Use-Cases

<details>
  <summary>Deploy a new project (for the first-time)</summary>

  > See [Usage](#usage) section for this use-case.
</details>

## Configuration

bla bla

## Usage Examples

### Initialize the deploy target

bla bla

## Development

* To identify more project languages create a JavaScript file under the `src/projectLangIdentifiers` directory. Currently to identify a Node.js (JavaScript) project we have a JavaScript file at [`src/projectLangIdentifiers/nodejs.js`](https://github.com/ozanmuyes/dreploy/blob/master/src/projectLangIdentifiers/nodejs.js) which looks for the `package.json` file in given [`Dirent`](https://nodejs.org/api/fs.html#fs_class_fs_dirent) array. The `package.json` file is what we seek for due to every Node.js project must have one.


## Remarks

* Cannot change the project configuration file path or load from somewhere else. If there is no `.dreployrc.json` exists on the project root there is no project configuration exists, the configuration may only come from global configuration file and from CLI (if any).
FIXME TR ama zaten `dreploy init` yapılmadan da `dreploy` komutu ile deploy edilemez? o zaman her halükarda `.dreployrc.json` dosyası project root'ta bulunur.

* TR project config'de (`.dreployrc.json`) verilen remote kullanıcısının, yine project config'de verilen remote path'de klasör ve dosya oluşturma ve yazma izni olması lazım

* TR `.dreplyrc.json` dosyası gizli tutulmalıdır, internete konulmamalıdır; VCS'e gönderilmemeli vb. Ancak bu dosya, aynı projeyi deploy edecek tüm development environment'lerde bulunmalı.

* TR `deployment.json` dosyası ise VCS'e veya internette ortak bir alana konulmalı. Çünkü bu dosya herhangi bir development environment'ten yapılan son deployment'ı temsil ediyor. Bu dosyayı edinmeden yapılmaya çalışılan sonraki deploy (A kişisi deploy ettikten sonra bu dosyaya sahip olmayan B kişisinin yapmaya çalışacağı deploy) hata verecektir (çünkü remote'da B kişisinin yüklemeye çalıştığı dosyalar var)

* TR ÖNEMLİ kaynak dosyaları belirli bir standartta kaydedilmeli; her development environment'inde tab'lar ya 2 space, ya 4 space ya da 1 tab olmalı, yeni satır ya LF ya da CRLF olmalı vb. Aynı kodları barındırmasına rağmen A development environment'inde CRLF, B development environment'inde LF ile kaydedilen dosyalar dreploy tarafından farklı iki dosya olarak görülecektir (çünkü hash'leri iki development environment'inde farklı olacaktır).
Bunun engellemenin en garanti ve genel yolu project config'de remote preDeploy hook'unu kullanarak kaynak kodlarında bu tarz standardizasyonu sağlayacak bir script çalıştırmaktır (otomatik olarak çalıştırılacaktır, script'i yazmak yeterlidir). Ancak bu yol biraz uğraştırıcıdır, bunun yerine varolan araçlar kullanılabilir; editor+editorconfig, prettifier etc.
