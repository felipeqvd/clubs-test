from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)

with open('clubsdata.json') as clubsdata:
  data = json.load(clubsdata)


def verify_club(club_name):
    club_names = [club['club_name'] for club in data["clubs"]]
    club_index = club_names.index(club_name)
    return club_index
    #if club_name not in club_names:
     #   abort(404, message="Club {} doesn't exist".format(club_name))

parser = reqparse.RequestParser()
parser.add_argument('club_name', type=str) 
parser.add_argument('club_address', type=str)
parser.add_argument('club_members', type=list, location='json')
parser.add_argument('all_data', type=list, location='json') 

# Club
# shows a single club item and lets you delete and update a club item
class Club(Resource):
    def get(self, club_id):
        new_club_id = int(club_id)
        return data["clubs"][new_club_id]

    def delete(self, club_id):
        new_club_id = int(club_id)        
        del data["clubs"][new_club_id]
        return '', 204

    def put(self, club_id):
        new_club_id = int(club_id)
        args = parser.parse_args()        
        data["clubs"][new_club_id] = args
        json_object = json.dumps(data, indent = 4) 
        with open("clubsdata.json", "w") as outfile: 
            outfile.write(json_object)
        return {"data": args, "success": True}, 201

# ClubsList
# shows a list of all clubs, and lets you POST to add new club
class ClubsList(Resource):
    def get(self):
        response = {"list": data}        
        return response

    def post(self):
        args = parser.parse_args()
        data["clubs"] = args["all_data"];
        json_object = json.dumps(data, indent = 4) 
        with open("clubsdata.json", "w") as outfile: 
            outfile.write(json_object)
        return {"data": args["all_data"], "success": True}, 201


api.add_resource(ClubsList, 
    '/clubs',
    '/clubslist')
api.add_resource(Club, '/clubs/<club_id>')

if __name__ == '__main__':
    app.run(debug=True)