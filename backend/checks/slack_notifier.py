import os
from slack_sdk import WebClient

client = WebClient(token=os.getenv("SLACK_BOT_TOKEN"))
CHANNEL = "#data-quality-alerts"

def send_slack_alert(text):
    client.chat_postMessage(channel=CHANNEL, text=text)
