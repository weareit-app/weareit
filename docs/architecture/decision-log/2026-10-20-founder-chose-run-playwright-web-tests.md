# 2026-10-20

Founder chose to run the Playwright web tests in CI as their own job (weareit-app/weareit#63), reversing the choice in #66 to leave them out as slow and prone to failing for reasons unrelated to the code. Deploys from master now also wait for them; if they prove flaky, remove the `e2e` job.
