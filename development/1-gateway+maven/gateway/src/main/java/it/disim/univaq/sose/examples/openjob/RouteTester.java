package it.disim.univaq.sose.examples.openjob;
import org.springframework.boot.ApplicationRunner;
import org.springframework.cloud.gateway.config.GatewayProperties;
import org.springframework.stereotype.Component;
@Component
public class RouteTester {
    private final GatewayProperties props;
    public RouteTester(GatewayProperties props) { this.props = props; }
    @org.springframework.context.annotation.Bean
    public ApplicationRunner printGatewayProps() {
        return args -> {
            System.out.println("========== GATEWAY PROPERTIES ==========");
            System.out.println("Routes size: " + props.getRoutes().size());
            for (var r : props.getRoutes()) {
                System.out.println(r.getId() + " - " + r.getUri());
            }
            System.out.println("========================================");
        };
    }
}
