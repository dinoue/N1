import _ from 'underscore'
import classnames from 'classnames'
import React from 'react'

const DISABLED_CALENDARS = "nylas.disabledCalendars"
import {calcColor} from './calendar-helpers'

function renderCalendarToggles(calendars, disabledCalendars) {
  return calendars.map((calendar) => {
    const calendarId = calendar.id
    const onClick = () => {
      const cals = NylasEnv.config.get(DISABLED_CALENDARS) || []
      if (cals.includes(calendarId)) {
        cals.splice(cals.indexOf(calendarId), 1)
      } else {
        cals.push(calendarId)
      }
      NylasEnv.config.set(DISABLED_CALENDARS, cals)
    }

    const checked = !disabledCalendars.includes(calendar.id);
    const checkboxClass = classnames({
      "colored-checkbox": true,
      "checked": checked,
    })
    const bgColor = checked ? calcColor(calendar.id) : "transparent"
    return (
      <div
        title={calendar.name}
        onClick={onClick}
        className="toggle-wrap"
        key={`check-${calendar.id}`}
      >
        <div className={checkboxClass}>
          <div className="bg-color" style={{backgroundColor: bgColor}}></div>
        </div>
        <label>{calendar.name}</label>
      </div>)
  })
}

export default function CalendarToggles(props) {
  const calsByAccountId = _.groupBy(props.calendars, "accountId");
  const accountSections = []
  for (const accountId of Object.keys(calsByAccountId)) {
    const calendars = calsByAccountId[accountId]
    const account = _.findWhere(props.accounts, {accountId})
    if (!account || !calendars || calendars.length === 0) {
      continue;
    }
    accountSections.push(
      <div key={accountId} className="account-calendars-wrap">
        <div className="account-label">{account.label}</div>
        {renderCalendarToggles(calendars, props.disabledCalendars)}
      </div>
    )
  }
  return <div className="calendar-toggles-wrap">{accountSections}</div>
}

CalendarToggles.propTypes = {
  accounts: React.PropTypes.array,
  calendars: React.PropTypes.array,
  disabledCalendars: React.PropTypes.array,
}
