# Bugs and issues encountered
- First code run gets stuck at processing contacts because the filters sent do not pass the validations. 
  The exponential backoff + retry should not happen if the response complains about the input 
  (because the same error will happen if the same input is sent.)
- Updated filters to use GT instead of GTQ and LT instead of LTQ (should either be GT or GTE and LT or LTE
- as per [docs](https://developers.hubspot.com/docs/guides/api/crm/search#filter-search-results)
```js
    filters: [
        { propertyName, operator: 'GT', value: `${date.valueOf()}` },
        { propertyName, operator: 'LT', value: `${nowDate.valueOf()}` }
    ]
```
- Unless the `lastPulledDate` is overridden it is not possible to pull old entities and get the app to run properly. 
- It is possible to update the `lastPulledDate` of the entities in the DB but at each run the date would be updated 
to a recent date.
- Because of this issue I added two extra props to the .env file.
  - FORCE_OLD_PULLED_DATE: which enables or disables the behavior to force an old pull date
  (This is using JSON.parse so it should always be defined true/false, otherwise an exception will be thrown.)
  - OLD_PULLED_DATE_MONTHS_AGO: How many months ago to pull
- Updated the `utils` file to make the entire output of the `console.log` of the `goal` function possible.
- 
# Code Quality and Readability
   - The code is concentrated in very few files and could benefit if concerns were separated in more files.
   - The code does a lot of object transformations and could benefit from a library like lodash or similar to simplify them.
   - Adding references to the APIs used and adding comments on top of functions or  where the code is unusual would make 
   - the project easier to read and follow.
   - The project lack tests and instructions to run all code paths or what the expected output should be.
   - The project lack instructions on how to debug it.

# Code Architecture
   - Abstracting the HubSpot API communication as a service layer would make the code potentially simpler to read.
   - The business logic could be separated from the "cron" logic.
   - All `processing` functions have code pieces in common that could benefit from some abstraction to make them reusable.
   - Infinite while-loop with a break pattern can inadvertently create an infinite loop if the developer is not careful.

# Code Performance
   - Exponential backoff retries could be better implemented and the exponential backoff should not be used if the request has
validation issues (because the exponential backoff won't solve the issue in this case)
   - The HubSpot Node Client API has its [own implementation](https://github.com/HubSpot/hubspot-api-nodejs?tab=readme-ov-file#retry-mechanism) 
of retries which could be used instead of a custom implementation
   - A real queueing system could potentially speed up the processing time because the queue could be consumed in parallel by more than one 
processing unit (to be considered with the rate limits of HubSpot).
   - A real queueing system would give the project better reliability in case of outages because it could 
resume from where it stopped.
   - Data could potentially be cached between batches to speed up processing time, e.g.: Companies of Contacts and Contacts of Meetings.