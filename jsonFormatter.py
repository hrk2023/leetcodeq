import json

result = []

def question_formatter(data,topic):
    dt = {
        "Topic" : topic,
        "Problem": data["Title"],
        "Done": False,
        "URL": data["Link"],
        "Youtube" : data["Youtube"],
        "Amazon": data["Amazon"] == "Yes" and True or False,
        "Google": data["Google"] == "Yes" and True or False,
        "Facebook": data["Facebook"] == "Yes" and True or False,
        "Microsoft": data["Microsoft"] == "Yes" and True or False,
        "Apple": data["Apple"] == "Yes" and True or False,
        "Uber": data["Uber"] == "Yes" and True or False,
        "Expedia": data["Expedia"] == "Yes" and True or False,
        "Twitter": data["Twitter"] == "Yes" and True or False,
        "ByteDance": data["ByteDance"] == "Yes" and True or False,
        "Airbnb": data["Airbnb"] == "Yes" and True or False,
        "Paypal": data["Paypal"] == "Yes" and True or False,
        "Bloomberg": data["Bloomberg"] == "Yes" and True or False,
        "Oracle": data["Oracle"] == "Yes" and True or False,
        "eBay": data["eBay"] == "Yes" and True or False,
        "Snap": data["Snap"] == "Yes" and True or False,
        "Adobe": data["Adobe"] == "Yes" and True or False,
        "LinkedIn": data["LinkedIn"] == "Yes" and True or False,
        "Citedal": data["Citedal"] == "Yes" and True or False,
        "Salesforce": data["Salesforce"] == "Yes" and True or False,
        "Robinhood": data["Robinhood"] == "Yes" and True or False,
        "Pinterest": data["Pinterest"] == "Yes" and True or False,
        "Wish": data["Wish"] == "Yes" and True or False,
        "Tesla": data["Tesla"] == "Yes" and True or False,
        "IBM": data["IBM"] == "Yes" and True or False,
        "Dropbox": data["Dropbox"] == "Yes" and True or False,
        "VMWare": data["VMWare"] == "Yes" and True or False
    }
    return dt

def topic_formatter(data,topic):
    dt = question_formatter(data,topic)
    response = {
        "topicName": topic,
		"position": 0,
		"started": False,
		"doneQuestions": 0,
        "questions" : []
    }
    return response

def format_json(data):
    ds = data["Data Structure"].split(",")
    algo = data["Algorithm"].split(",")
    if(algo[0] != ''):
        if(len(result) != 0):
            for alg in algo:
                isPresent = False
                alg = alg.strip()
                for topic in result:
                    if(topic["topicName"] == alg):
                        isPresent = True
                        dt = question_formatter(data,alg)
                        topic["questions"].append(dt)
                        
                if(not isPresent):
                    dt = topic_formatter(data,alg)
                    dt["questions"].append(question_formatter(data,alg))
                    result.append(dt)
        else:
            for alg in algo:
                alg = alg.strip()
                dt = topic_formatter(data,alg)
                dt["questions"].append(question_formatter(data,alg))
                result.append(dt)

    elif(ds[0] != ''):
        if(len(result) != 0):
            for dss in ds:
                isPresent = False
                dss = dss.strip()
                for topic in result:
                    if(topic["topicName"] == dss):
                        isPresent = True
                        dt = question_formatter(data,dss)
                        topic["questions"].append(dt)
                        
                if(not isPresent):
                    dt = topic_formatter(data,dss)
                    dt["questions"].append(question_formatter(data,dss))
                    result.append(dt)
        else:
            for dss in ds:
                dss = dss.strip()
                dt = topic_formatter(data,dss)
                dt["questions"].append(question_formatter(data,dss))
                result.append(dt)
                

datas = []
print("Loading Json...")
with open('lp564-rf3v5.json') as f:
    datas = json.load(f)
print("Loaded Json...")

print("Formatting Json...")
for data in datas:
    dt = format_json(data)
print("Formatting Complete...")

print("Writing to file...")
with open("leetcodeFinal.json","w") as fp:
    fp.write(str(json.dumps(result)))
print("Writing Complete...")




