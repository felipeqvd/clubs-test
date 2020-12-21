import { Component, OnInit } from '@angular/core';
import { ClubsService } from 'src/app/services/clubs.service';

interface ClubsData {
  [index: number]: ClubItemData;
}

interface ClubItemData {
  club_id: number;
  club_name: string;
  club_address: string;
  club_members: MembersData;
  expand: boolean;
}

interface MembersData {
  [index: number]: MemberItemData;
}

interface MemberItemData {
  name: string;
  age: number;  
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  clubsList: ClubsData[] = []; 
  editCache: any = [];
  columnsList = [
    {
      title: 'Name',
      compare: (a: ClubItemData, b: ClubItemData) => a.club_name.localeCompare(b.club_name),
      priority: 1
    },
    {
      title: 'Address',
      compare: (a: ClubItemData, b: ClubItemData) => a.club_address.localeCompare(b.club_address),
      priority: 2
    }
  ]
  editFlag = false;
  
  constructor(private clubsService: ClubsService) { }

  ngOnInit(): void {
    this.readClubs(); 
  }

  readClubs(): void {    
    this.clubsService.readAll()
      .subscribe(
        clubs => {
          let clubsListTemp = clubs.list.clubs; 
          for(let i=0; i<clubsListTemp.length; i++){
            if (clubsListTemp[i].club_members){
              let clubMembers = clubsListTemp[i].club_members;
              for(let j=0;j<clubMembers.length; j++){
                clubMembers[j].member_id = j;
              }
              clubsListTemp[i].club_members = clubMembers;
            }
            this.editCache[i] = {
              edit: false,
              item: clubsListTemp[i]
            };
            clubsListTemp[i].expand = false;
            clubsListTemp[i].club_id = i;            
          }          
          this.clubsList = clubsListTemp;          
        },
        error => {
          console.log(error);
        });
  }
  
  startEdit(club_id: number): void {
    this.editCache[club_id].edit = true;
    this.editFlag = true;
  }

  cancelEdit(club_id: number): void {
    this.editCache[club_id].edit = false;
    Object.assign(this.editCache[club_id].item, this.clubsList[club_id]);
  }

  saveEdit(club_id: number): void {   
    this.clubsService.update(club_id,this.editCache[club_id].item)
      .subscribe(response => {
        if (response.success){          
          Object.assign(this.clubsList[club_id], this.editCache[club_id].item);
          this.editCache[club_id].edit = false;
        }      
      },
      error => {
        console.log(error);
      });     
  }

  saveAll(): void {
    let dataToSend = [];
    for(let i=0;i<this.editCache.length;i++){
      dataToSend[i] = this.editCache[i].item;
    }       
    this.clubsService.saveAll(dataToSend)
      .subscribe(response => {
        if (response.success){
          for(let i=0;i<this.editCache.length;i++){
            Object.assign(this.clubsList[i], this.editCache[i].item);
            this.editCache[i].edit = false;
          }       
        }      
      },
      error => {
        console.log(error);
      });     
  }
  
}
