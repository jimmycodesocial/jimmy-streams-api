-----------------------------------------------------------------------------------------------------------------------
-- findSubscribers Function
-- Returns the "id" property of all the streams "subscribed_to" another stream
-- PARAMETERS:
--   * starter: The Stream Id
--   * offset: Pagination control, use with SKIP
--   * quantity: Pagination control, use with LIMIT
-----------------------------------------------------------------------------------------------------------------------
DELETE FROM OFunction where name = 'findSubscriptions';

CREATE FUNCTION findSubscriptions
"SELECT expand(in('SUBSCRIBED_TO').id) from (SELECT FROM Stream WHERE id = :starter) SKIP :offset LIMIT :quantity;"
PARAMETERS [starter, offset, quantity] IDEMPOTENT false LANGUAGE sql
