from atproto import Client, models
import os
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)

EMAIL_ADDRESS = os.environ.get("BLUESKAY_EMAIL_ADDRESS")
PASSWORD = os.environ.get("BLUESKAY_PASSWORD")

api = Client()

api.login(EMAIL_ADDRESS, PASSWORD)

embed_external = models.AppBskyEmbedExternal.Main(
    external=models.AppBskyEmbedExternal.External(
        title="参議院 外交防衛委員会",
        description="aaa",
        uri="https://capitalens.vercel.app/meetings/cliq8u5rm0002qxoifbze1vbz",
    )
)

summary = "- 委員長（阿達雅志君）が外交防衛委員会を開会し、政府参考人の出席要求について説明する。\n- 政府参考人（町田一仁君）が、過去の答弁の誤りについて謝罪し、修正答弁を行う。\n- 山添拓君が、オスプレイのクラッチの不具合に関する質問を行う。\n- 政府参考人（安藤敦史君）が、オスプレイの安全性について説明する。\n- 山添拓君が、防衛省の対応に疑念を抱き、説明の不誠実さを指摘する。\n - 委員長（阿達雅志君）が質疑を終了し、本日の調査を終了する。"

api.send_post(
    text=f"参議院 外交防衛委員会が開会されました\n\n📅 2022年11月10日\n⌛ 2:56:00\n🗣️ John Doe,AmandaTakada Junji\n\n{summary}",
    embed=embed_external,
)
