import type { TFunction } from "next-i18next";
import { describe, expect, it, vi } from "vitest";

import * as event from "./event";

describe("event tests", () => {
  describe("fn: getEventName", () => {
    it("should return event_between_users message if no name", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("foo");

      const lastCall = tFunc.mock.lastCall;
      expect(lastCall).toEqual([
        "event_between_users",
        {
          eventName: "example event type",
          host: "example host",
          attendeeName: "example attendee",
          interpolation: {
            escapeValue: false,
          },
        },
      ]);
    });

    it("should return event_between_users message if no name with team set", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        teamName: "example team name",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("foo");

      const lastCall = tFunc.mock.lastCall;
      expect(lastCall).toEqual([
        "event_between_users",
        {
          eventName: "example event type",
          host: "example team name",
          attendeeName: "example attendee",
          interpolation: {
            escapeValue: false,
          },
        },
      ]);
    });

    it("should fall back to Nameless when attendeeName object is invalid", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: { foo: "bar" } as unknown as { firstName: string },
        eventType: "example event type",
        host: "example host",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("foo");

      const lastCall = tFunc.mock.lastCall;
      expect(lastCall).toEqual([
        "event_between_users",
        {
          eventName: "example event type",
          host: "example host",
          attendeeName: "Nameless",
          interpolation: {
            escapeValue: false,
          },
        },
      ]);
    });

    it("should return event name if no vars used", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "example event name",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("example event name");
    });

    it("should support templating of event type", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "event type: {Event type title}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("event type: example event type");
    });

    it("should support templating of scheduler", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "scheduler: {Scheduler}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("scheduler: example attendee");
    });

    it("should support templating of organiser", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "organiser: {Organiser}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("organiser: example host");
    });

    it("should support templating of user", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "user: {USER}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("user: example attendee");
    });

    it("should support templating of attendee", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "attendee: {ATTENDEE}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("attendee: example attendee");
    });

    it("should support templating of host", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "host: {HOST}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("host: example host");
    });

    it("should support templating of attendee with host/attendee", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "host or attendee: {HOST/ATTENDEE}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("host or attendee: example attendee");
    });

    it("should support templating of host with host/attendee", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName(
        {
          attendeeName: "example attendee",
          eventType: "example event type",
          host: "example host",
          eventName: "host or attendee: {HOST/ATTENDEE}",
          eventDuration: 15,
          t: tFunc as TFunction,
        },
        true
      );

      expect(result).toBe("host or attendee: example host");
    });

    it("should support templating of custom booking fields", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "custom field: {customField}",
        bookingFields: {
          customField: "example custom field",
        },
        t: tFunc as TFunction,
      });

      expect(result).toBe("custom field: example custom field");
    });

    it("should support templating of custom booking fields with values", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "custom field: {customField}",
        eventDuration: 15,
        bookingFields: {
          customField: {
            value: "example custom field",
          },
        },
        t: tFunc as TFunction,
      });

      expect(result).toBe("custom field: example custom field");
    });

    it("should support templating of custom booking fields with non-string values", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "custom field: {customField}",
        eventDuration: 15,
        bookingFields: {
          customField: {
            value: 808,
          },
        },
        t: tFunc as TFunction,
      });

      expect(result).toBe("custom field: 808");
    });

    it("should support templating of custom booking fields with no value", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "custom field: {customField}",
        eventDuration: 15,
        bookingFields: {
          customField: {
            value: undefined,
          },
        },
        t: tFunc as TFunction,
      });

      expect(result).toBe("custom field: ");
    });

    it("should support templating of location via {Location}", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        location: "attendeeInPerson",
        eventName: "location: {Location}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("location: in_person_attendee_address");
    });

    it("should support templating of location via {LOCATION}", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        location: "attendeeInPerson",
        eventName: "location: {LOCATION}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("location: in_person_attendee_address");
    });

    it("should strip location template if none set", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        eventName: "location: {Location}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("location: ");
    });

    it("should strip location template if empty", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        location: "",
        eventName: "location: {Location}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("location: ");
    });

    it("should template {Location} as passed location if unknown type", () => {
      const tFunc = vi.fn(() => "foo");

      const result = event.getEventName({
        attendeeName: "example attendee",
        eventType: "example event type",
        host: "example host",
        location: "unknownNonsense",
        eventName: "location: {Location}",
        eventDuration: 15,
        t: tFunc as TFunction,
      });

      expect(result).toBe("location: unknownNonsense");
    });
  });

  it("should support templating of event duration", () => {
    const tFunc = vi.fn(() => "foo");

    const result = event.getEventName({
      attendeeName: "example attendee",
      eventType: "example event type",
      host: "example host",
      eventName: "event duration: {Event duration}",
      eventDuration: 15,
      t: tFunc as TFunction,
    });
    expect(result).toBe("event duration: 15 mins");
  });

  it("should support templating of Scheduler first name", () => {
    const tFunc = vi.fn(() => "foo");

    const result = event.getEventName({
      attendeeName: "example attendee",
      eventType: "example event type",
      host: "example host",
      location: "attendeeInPerson",
      eventName: "Scheduler first name: {Scheduler first name}",
      eventDuration: 15,
      t: tFunc as TFunction,
    });

    expect(result).toBe("Scheduler first name: example");
  });

  describe("fn: validateCustomEventName", () => {
    it("should be valid when no variables used", () => {
      expect(event.validateCustomEventName("foo")).toBe(true);
    });

    [
      "Event type title",
      "Organiser",
      "Scheduler",
      "Location",
      "LOCATION",
      "HOST/ATTENDEE",
      "HOST",
      "ATTENDEE",
      "USER",
      "Event duration",
    ].forEach((value) => {
      it(`should support {${value}} variable`, () => {
        expect(event.validateCustomEventName(`foo {${value}} bar`)).toBe(true);

        expect(event.validateCustomEventName(`{${value}} bar`)).toBe(true);

        expect(event.validateCustomEventName(`foo {${value}}`)).toBe(true);
      });
    });

    it("should support booking field variables", () => {
      expect(
        event.validateCustomEventName("foo{customField}bar", {
          customField: true,
        })
      ).toBe(true);
    });

    it("should return variable when invalid variable used", () => {
      expect(event.validateCustomEventName("foo{nonsenseField}bar")).toBe("{nonsenseField}");
    });
  });
});
