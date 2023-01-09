// Generated by https://quicktype.io

export interface Rides {
    rides: Ride[];
}

export interface Ride {
    _id:                       string;
    name:                      string;
    origin:                    string;
    destination:               string;
    originVicinity:                    string;
    destinationVicinity:               string;
    originDisplay:                    string;
    destinationDisplay:               string;
    departureDate: null | string;
    returnDate: null | string;
    recurrence:          string[] | null;
    departureTime:          string;
    returnTime:          string;
    smoking:                   boolean;
    emptySeats:             string;
    price:                     number;
    tripDescription:        string;
    contact:                   string;
    postDate:            string;
    comments: Comment[];
}

export interface Comment {
    comment: string;
    author:  string;
    commentDate: string;
}

export interface ListComponentProps {
    rides:Ride[];
}

export interface PostRideComponentProps {
    rides:Ride[];
    onResponse:Function;
    onError:Function;
    RETREIVE_SCRIPT:string;
    setLoading: Function;
}

export interface ViewRideComponentProps {
    rides:Ride[];
    onResponse:Function;
    onError:Function;
    RETREIVE_SCRIPT:string;
    setLoading: Function;
}

export interface FindRideComponentProps {
    rides:Ride[];
    RETREIVE_SCRIPT:string;
    setLoading: Function;
    onResponse:Function;
    onError:Function;
}