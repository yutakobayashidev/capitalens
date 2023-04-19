import requests
from bs4 import BeautifulSoup
import csv
import urllib.parse
import time

# 議員一覧ページのURL
url = 'https://www.sangiin.go.jp/japanese/giin/hireiku/hireiku.htm'

# 議員一覧ページの取得
response = requests.get(url)

# BeautifulSoupオブジェクトの作成
soup = BeautifulSoup(response.content, 'html.parser')

# 議員一覧表の取得
table = soup.find('table', {'class': 'list mt20'})

# 行の取得
rows = table.find_all('tr')

# CSVファイルの作成とヘッダーの書き込み
with open('sangiin.csv', 'w', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['選挙区', '議員名', 'ひらがな', '写真',"所属会派","プロフィール","URL"])

    # 各行の情報を取得してCSVに書き込む
    for row in rows[1:]:
        cols = row.find_all('td')
        constituency = cols[0].text.strip()
        member_name = cols[1].text.strip()

        # ログ出力
        print(member_name)

        political_party = cols[2].text.strip()

        # 議員ページのURLを取得してアクセス
        member_link = cols[1].find('a')['href']
        member_response = requests.get(f"https://www.sangiin.go.jp{member_link}")
        member_soup = BeautifulSoup(member_response.content, 'html.parser')

        # プロフィール写真のパスを絶対パスに変換
        profile_photo_rel_path = member_soup.find('div', {'id': 'profile-photo'}).find('img')['src']
        profile_photo_abs_path = urllib.parse.urljoin(member_link, profile_photo_rel_path)

        # 所属会派情報の取得
        profile_dl_list = member_soup.find_all('dl', {'class': 'profile-detail'})
        party_info = profile_dl_list[0].find('dd').text.strip()

        # プロフィール情報の取得
        profile = member_soup.find('p', {'class': 'profile2'}).text.strip()

        # CSVに書き込み
        writer.writerow([constituency, member_name, political_party, "https://www.sangiin.go.jp" + profile_photo_abs_path,party_info,profile,member_link])

        # 1秒間待機
        time.sleep(1)
