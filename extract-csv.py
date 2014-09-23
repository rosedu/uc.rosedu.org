# This program is licensed under the CC-BY-NC license (with clarifications)
# For details, please refer to the file synchronize_statistics.license.md

import json
from copy import deepcopy

def read_raw_json(file_handle):

    raw_json = ''

    f = open(file_handle, 'r')

    try:
        raw_json = f.read()
    finally:
        f.close()

    return raw_json

def parse_raw_json(raw_json):

    try:
        parsed_json = json.loads(raw_json)
    except ValueError:
        raise FileContentsNotInJSONFormatError

    return parsed_json

if __name__ == '__main__':
    file_to_read_from = 'data/_participants.json'
    raw_contents_of_file = read_raw_json(file_to_read_from)
    raw_participant_records = parse_raw_json(raw_contents_of_file)

    print "Track,Data,Nume,Proiect,Patch URL"
    for record in raw_participant_records:
        if not record['first_name']:    # Pass through empty records.
            continue
        raw_contributions = read_raw_json('data/' + record['first_name'].split()[0].lower() + '_' + record['last_name'].lower() + '.json')
        parsed_contributions = parse_raw_json(raw_contributions)
        for contrib_record in parsed_contributions:
            if not contrib_record['project']:   # Pass through empty records.
                continue
            print "%s,%s,%s,%s,%s" % (
                    record['track'],
                    contrib_record['date'],
                    record['first_name'] + " " + record['last_name'],
                    contrib_record['project'],
                    contrib_record['patch_url'])
