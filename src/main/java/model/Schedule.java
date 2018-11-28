package model;

import java.util.ArrayList;

public class Schedule {
	public final ArrayList<TimeSlot> timeslots;
	public final User organizer;
	public final Time startTime;
	public final Time endTime;
	public final int slotDelta;
	public final String secretCode;
	public final String scheduleID;
	public final String name;
	
	public Schedule (ArrayList<TimeSlot> ts, User o, Time st, Time et, int sd, String sc, String id, String name) {
		this.timeslots = ts;
		this.organizer = o;
		this.startTime = st;
		this.endTime = et;
		this.slotDelta = sd;
		this.secretCode = sc;
		this.scheduleID = id;
		this.name = name;
	}
}
