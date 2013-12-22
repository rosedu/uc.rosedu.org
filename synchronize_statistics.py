import json
from copy import deepcopy

TRACKS = ['anul_1','anul_2','anul_3','anul_4_si_master']

class FileContentsNotInJSONFormatError(Exception):
    pass

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

def dump_to_file(
      file_handle,
      dictionary
    ):

    raw_json = json.dumps(dictionary)

    f = open(file_handle, 'w')
    print >> f, raw_json
    f.close()

    return

def participant_record_with_extra_stats(participant):
    file_to_read_from = 'data/' + participant['file'].encode('ascii')
    raw_contents_of_file = read_raw_json(file_to_read_from)
    contribution_records = parse_raw_json(raw_contents_of_file)

    contrib_count = 0
    overall_score = 0.0
    for contribution in contribution_records:
        if contribution['date']:
            contrib_count += 1
            difficulty_score = \
                float(contribution['difficulty_score']) if contribution['difficulty_score'] else 0.0
            impact_score = \
                float(contribution['impact_score']) if contribution['impact_score'] else 0.0
            overall_score += difficulty_score + impact_score

    participant['contrib_count'] = contrib_count
    participant['overall_score'] = overall_score

    return participant

def absorb_participant_record_into_global_stats_hash(stats_hash, participant_record):
    clone_of_stats_hash = deepcopy(stats_hash)

    contrib_count = participant_record['contrib_count']

    count_key = participant_record['track'] + '_contrib_count'
    clone_of_stats_hash[count_key] = \
        clone_of_stats_hash.get(count_key, 0) + contrib_count

    clone_of_stats_hash['global_contrib_count'] = \
        clone_of_stats_hash.get('global_contrib_count', 0) + contrib_count

    overall_score = participant_record['overall_score']

    overall_score_key = participant_record['track'] + '_overall_score'
    clone_of_stats_hash[overall_score_key] = \
        clone_of_stats_hash.get(overall_score_key, 0.0) + overall_score

    clone_of_stats_hash['global_overall_score'] = \
        clone_of_stats_hash.get('global_overall_score', 0.0) + overall_score

    track_participants_key = participant_record['track'] + '_participants_list'
    pre_existing_list = clone_of_stats_hash.get(track_participants_key, [])
    pre_existing_list.append(participant_record)
    clone_of_stats_hash[track_participants_key] = pre_existing_list

    return clone_of_stats_hash

if __name__ == '__main__':
    file_to_read_from = 'data/_participants.json'
    raw_contents_of_file = read_raw_json(file_to_read_from)
    raw_participant_records = parse_raw_json(raw_contents_of_file)

    records_with_stats_annotations = \
        [ participant_record_with_extra_stats(participant)
          for participant in raw_participant_records
          if participant['last_name'] ]

    global_stats_hash = \
        reduce(absorb_participant_record_into_global_stats_hash, records_with_stats_annotations, {})

    for track in TRACKS:
        track_participants_key = track + '_participants_list'
        track_participants_list = global_stats_hash.get(track_participants_key, [])
        if len(track_participants_list) == 0:
            global_stats_hash[track_participants_key] = []
        if len(track_participants_list) > 1:
            global_stats_hash[track_participants_key] = \
                sorted(track_participants_list, key = lambda d: (-d['overall_score'], d['last_name']))

    file_to_write_to = 'data/generated/global_stats.json'
    dump_to_file(file_to_write_to, global_stats_hash)

    print 'Global stats generated successfully.'

