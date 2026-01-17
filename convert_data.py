import json

with open('real_contributions.json', 'r') as f:
    raw_data = json.load(f)

calendar = raw_data['data']['user']['contributionsCollection']['contributionCalendar']
days = []
for week in calendar['weeks']:
    for day in week['contributionDays']:
        days.append({
            'date': day['date'],
            'count': day['contributionCount']
        })

with open('contributions.json', 'w') as f:
    json.dump(days, f)
