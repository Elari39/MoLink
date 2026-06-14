package shortlink.elari39.github.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class PublicBaseUrlResolverTest {

    @Test
    void configuredBaseUrlWinsAndTrimsTrailingSlash() {
        PublicBaseUrlResolver resolver = new PublicBaseUrlResolver(
                new AppProperties(" https://fixed.example.com/ ", 238328L, 60L, 4, 16));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Forwarded-Proto", "https");
        request.addHeader("X-Forwarded-Host", "shorten.miku831.fun");

        assertEquals("https://fixed.example.com", resolver.resolve(request));
    }

    @Test
    void resolvesHttpsDomainFromForwardedHeaders() {
        PublicBaseUrlResolver resolver = new PublicBaseUrlResolver(
                new AppProperties(null, 238328L, 60L, 4, 16));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("X-Forwarded-Proto", "https");
        request.addHeader("X-Forwarded-Host", "shorten.miku831.fun");
        request.addHeader("Host", "127.0.0.1:8763");

        assertEquals("https://shorten.miku831.fun", resolver.resolve(request));
    }

    @Test
    void resolvesLocalHostWithPortFromHostHeader() {
        PublicBaseUrlResolver resolver = new PublicBaseUrlResolver(
                new AppProperties("", 238328L, 60L, 4, 16));
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setScheme("http");
        request.addHeader("Host", "localhost:8763");

        assertEquals("http://localhost:8763", resolver.resolve(request));
    }
}
